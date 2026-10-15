<?php

namespace App\Http\Controllers;

use App\Exports\WorkerExport;
use App\Exports\WorkersDataExport;
use App\Http\Requests\StoreWorkerRequest;
use App\Http\Requests\UpdateWorkerRequest;
use App\Http\Resources\WorkerResource;
use App\Imports\WorkerImport;
use App\Models\Site;
use App\Models\Worker;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\WorkersImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class WorkerController extends Controller
{
    private $moduleName = 'Worker';

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        // Situation Actuelle (CDC § 3.3) :
        //  - les profils RH ("manage worker status") voient la liste complète, y compris les INACTIF ;
        //  - les autres, et toutes les listes de sélection (pointage, rendement, affectation : active_only=1),
        //    ne voient que les ouvriers ACTIF.
        $activeOnly = !Gate::allows('manage worker status') || $request->boolean('active_only');

        return WorkerResource::collection(
            Worker::when($activeOnly, fn($query) => $query->where('is_active', true))->get()
        );
    }

    /**
     * Display a listing of the resource.
     */
    public function workersBySite($siteId) {
        // Check if site exists
        $site = Site::find($siteId);

        if (!$site) {
            return response()->json([
                'message' => 'Site not found'
            ], 404);
        }

        // Return all workers by site ID
        return WorkerResource::collection(Worker::where("site_id", $siteId)->get());
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkerRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the worker
        $worker = Worker::create($fields);

        // Return new worker
        return response()->json([
            "worker" => new WorkerResource($worker)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find worker by ID using checkWorker method
        $worker = $this->checkWorker($id);

        if ($worker) {
            // Return worker
            return new WorkerResource($worker);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkerRequest $request, $id) {
        // Find worker by ID using checkWorker method
        $worker = $this->checkWorker($id);

        if ($worker) {
            // Validate the request
            $fields = $request->validated();

            // Seuls les profils RH peuvent changer la Situation Actuelle (ACTIF / INACTIF)
            if (array_key_exists('is_active', $fields) && !Gate::allows('manage worker status')) {
                return response()->json([
                    'message' => "Seuls les profils RH peuvent modifier la Situation Actuelle d'un ouvrier."
                ], 403);
            }

            // Update the worker
            $worker->update($fields);

            // Return updated worker
            return response()->json(["worker" => new WorkerResource($worker)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find worker by ID using checkWorker method
        $worker = $this->checkWorker($id);

        if ($worker) {
            // Delete the worker
            $worker->delete();

            // Return success message
            return response()->json(['message' => 'Worker deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Export a file containing workers.
     */
    public function export() {
        return Excel::download(new WorkerExport(), 'ouvriers.xlsx');
    }

    /**
     * Export all workers data.
     */
    public function exportAll()
    {
        return Excel::download(
            new WorkersDataExport(),
            'ouvriers.xlsx'
        );
    }

    /**
     * Import workers from Excel file.
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
            $import = new WorkerImport();
            Excel::import($import, $request->file('file'));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error importing workers',
                'error' => $e->getMessage()
            ], 500);
        }

        // Rapport d'import (CDC § 3.3.3) : lignes ajoutées / mises à jour + détail des erreurs.
        // Les lignes correctes sont enregistrées même s'il y a des erreurs ailleurs dans le fichier.
        $nothingSaved = $import->created === 0 && $import->updated === 0;

        return response()->json([
            'message' => "{$import->created} ouvrier(s) ajouté(s), {$import->updated} ouvrier(s) mis à jour, "
                . count($import->errors) . ' erreur(s).',
            'created' => $import->created,
            'updated' => $import->updated,
            'errors' => $import->errors,
        ], $nothingSaved && $import->errors ? 422 : 201);
    }

    private function checkWorker($id) {
        // Find worker by ID
        $worker = Worker::find($id);

        // Return worker if found, otherwise return null
        return $worker ?? null;
    }
}
