<?php

namespace App\Http\Controllers;

use App\Exports\PunchWorkerExport;
use App\Http\Requests\StorePunchRequest;
use App\Http\Requests\UpdatePunchRequest;
use App\Http\Resources\PunchResource;
use App\Models\Punch;
use App\Observers\ModelActivityObserver;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;

class PunchController extends Controller
{
    private $moduleName = 'Punch';

    /**
     * Display a listing of the resource.
     */ public function index() {
    if (Gate::allows("view all punches")) {
        // Retourner tous les punches avec le nombre d'ouvriers
        $punches = Punch::withCount('punchWorkers')->get();

        return PunchResource::collection($punches);
    } elseif (Gate::allows("view some punches")) {
        $id = auth()->id();

        // Retourner seulement les punches autorisés avec le nombre d'ouvriers
        $punches = Punch::withCount('punchWorkers')
            ->whereHas('site', function($query) use ($id) {
                $query->where(function($q) use ($id) {
                    $q->where('project_responsible_id', $id)
                        ->orWhere('conductor_id', $id)
                        ->orWhere('worker_id', $id);
                });
            })->get();

        return PunchResource::collection($punches);
    } else {
        return $this->errorMessage($this->moduleName);
    }
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePunchRequest $request) {
        // Validate the request
        $fields = $request->validated();

        $fields['date'] = Carbon::parse($fields['date'])->format('Y-m-d');

        $existingPunch = Punch::where('date', $fields['date'])
            ->where('site_id', $fields['site_id'])
            ->first();

        if ($existingPunch) {
            return response()->json([
                'error' => 'le pointage existe déjà à cette date pour ce site là.'
            ], 409);
        }

        // Store the punch
        $punch = Punch::create($fields);

        // Return new punch
        return response()->json([
            "punch" => new PunchResource($punch)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        if (Gate::allows("view all punches")) {
            $punch = $this->checkPunch($id);

            if ($punch) {
                // Return punch
                return new PunchResource($punch);
            } else {
                // Return error message
                return $this->errorMessage($this->moduleName);
            }
        } elseif (Gate::allows("view some punches")) {
            $userId = auth()->id();

            // Get punch by Id and user Id
            $punch = Punch::where('id', $id)->whereHas('site', function($query) use ($userId) {
                $query->where(function($q) use ($userId) {
                    $q->where('project_responsible_id', $userId)
                        ->orWhere('conductor_id', $userId)
                        ->orWhere('worker_id', $userId);
                });
            })->first();

            if ($punch) {
                // Return punch
                return new PunchResource($punch);
            } else {
                // Return error message
                return $this->errorMessage($this->moduleName);
            }
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePunchRequest $request, $id) {
        // Find punch by ID using checkPunch method
        $punch = $this->checkPunch($id);

        if ($punch) {

            if ($punch->validated) {
                return response()->json([
                    'error' => 'Impossible de modifier ce pointage car il est déjà validé.'
                ], 403);
            }
            // Validate the request
            $fields = $request->validated();

            $fields['date'] = Carbon::parse($fields['date'])->format('Y-m-d');

            // Update the punch
            $punch->update($fields);

            // Return updated punch
            return response()->json(["punch" => new PunchResource($punch)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find punch by ID using checkPunch method
        $punch = $this->checkPunch($id);

        if ($punch) {

            if ($punch->validated) {
                return response()->json([
                    'error' => 'Impossible de supprimer ce pointage car il est déjà validé.'
                ], 403);
            }
            // Delete the punch
            $punch->delete();

            // Return success message
            return response()->json(['message' => 'Punch deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

     public function validatePunch($id) {

         $punch = Punch::with('punchWorkers')->find($id);

         if (!$punch) {
            return response()->json(['error' => 'Punch not found'], 404);
        }

         if ($punch->punchWorkers()->count() === 0) {
             return response()->json(['error' => 'Impossible de valider un pointage sans travailleurs.'], 400);
         }

        if ($punch->validated) {
            return response()->json(['punch' => 'Ce pointage est déjà validé'],200);
        }

         $punch->skipObserver = true;
         $punch->validated = true;
        $punch->save();

         ModelActivityObserver::log('validated', $punch);

        return response()->json([
            "punch" => new PunchResource($punch),
            "message" => "Pointage validé avec succès."],
        200);
     }

     public function invalidatePunch($id) {

        $punch = $this->checkPunch($id);

        if (!$punch) {
            return response()->json(['message' => 'Punch not found'], 404);
        }

        if (!$punch->validated) {
            return response()->json(['message' => 'Ce pointage est déjà non validé.'], 200);
        }

         $punch->skipObserver = true;
         $punch->validated = false;
        $punch->save();

         ModelActivityObserver::log('invalidated', $punch);

         return response()->json([
            "punch" => new PunchResource($punch),
            "message" => "Pointage dévalidé avec succès."
        ], 200);
     }
    private function checkPunch($id) {
        // Find punch by ID
        $punch = Punch::find($id);

        // Return punch if found, otherwise return null
        return $punch ?? null;
    }

}
