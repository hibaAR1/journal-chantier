<?php

namespace App\Http\Controllers;

use App\Exports\PunchWorkerExport;
use App\Http\Requests\StorePunchWorkerRequest;
use App\Http\Requests\UpdatePunchWorkerRequest;
use App\Http\Resources\PunchWorkerResource;
use App\Imports\PunchWorkerImport;
use App\Models\Punch;
use App\Models\PunchWorker;
use App\Models\Worker;
use App\Observers\ModelActivityObserver;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class PunchWorkerController extends Controller
{
    private $moduleName = 'PunchWorker';

    /**
     * Display a listing of the resource.
     */
    public function index($punchId) {
        // Get all punchWorkers by punchId
        $punchWorkers = PunchWorker::where('punch_id', $punchId)->get();

        // Return collection of reportWorkTypeWorkers
        return PunchWorkerResource::collection($punchWorkers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePunchWorkerRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the punch worker
        $punchWorker = PunchWorker::create($fields);

        // Return new punch worker
        return response()->json([
            "punchWorker" => new PunchWorkerResource($punchWorker)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find punch by ID using checkPunchWorker method
        $punchWorker = $this->checkPunchWorker($id);

        if ($punchWorker) {
            // Return punch
            return new PunchWorkerResource($punchWorker);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePunchWorkerRequest $request, $id) {
        // Find punch worker by ID using checkPunchWorker method
        $punchWorker = $this->checkPunchWorker($id);

        if ($punchWorker) {
            // Validate the request
            $fields = $request->validated();

            // Update the punch worker
            $punchWorker->update($fields);

            // Return updated punch worker
            return response()->json(["punchWorker" => new PunchWorkerResource($punchWorker)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find punch worker by ID using checkPunchWorker method
        $punchWorker = $this->checkPunchWorker($id);

        if ($punchWorker) {
            // Delete the punch worker
            $punchWorker->delete();

            // Return success message
            return response()->json(['message' => 'Punch worker deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Export a file containing the assignment workers.
     */
    public function export($id) {
        $punch = Punch::find($id);

        if ($punch) {
            $data = Worker::where('site_id', $punch->site_id)->get(['registration_number', 'name'])->toArray();

            // Convert each row to an array
            $formattedData = array_map(function ($item) {
                return (array) $item;
            }, $data);

            ModelActivityObserver::logExport($punch);

            // return PunchWorkerExport file
            return Excel::download(new PunchWorkerExport($punch->site_id, $punch->code, $formattedData), 'Pointage.xlsx');
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Import assignment workers from Excel file.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx'
        ]);

        try {
            Excel::import(new PunchWorkerImport, $request->file('file'));

            ModelActivityObserver::logGeneric('imported', \App\Models\PunchWorker::class, [
                'file_name' => $request->file('file')->getClientOriginalName()
            ]);


            return response()->json([
                'message' => 'Punch workers imported successfully'
            ], 201);

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errors = [];

            foreach ($failures as $failure) {
                $errors[] = [
                    'row' => $failure->row(),
                    'attribute' => $failure->attribute(),
                    'errors' => $failure->errors()
                ];
            }

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $errors
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error importing punch workers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function checkPunchWorker($id) {
        // Find punch worker by ID
        $punchWorker = PunchWorker::find($id);

        // Return punch worker if found, otherwise return null
        return $punchWorker ?? null;
    }
}
