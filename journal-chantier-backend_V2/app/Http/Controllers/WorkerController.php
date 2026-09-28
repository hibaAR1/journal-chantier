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

class WorkerController extends Controller
{
    private $moduleName = 'Worker';

    /**
     * Display a listing of the resource.
     */
    public function index() {
        // Return all workers
        return WorkerResource::collection(Worker::all());
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
            Excel::import(new WorkerImport, $request->file('file'));

            return response()->json([
                'message' => 'Workers imported successfully'
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
                'message' => 'Error importing workers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function checkWorker($id) {
        // Find worker by ID
        $worker = Worker::find($id);

        // Return worker if found, otherwise return null
        return $worker ?? null;
    }
}
