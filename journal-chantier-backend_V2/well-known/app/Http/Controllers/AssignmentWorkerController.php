<?php

namespace App\Http\Controllers;

use App\Exports\AssignmentWorkerExport;
use App\Http\Requests\StoreAssignmentWorkerRequest;
use App\Http\Requests\UpdateAssignmentWorkerRequest;
use App\Http\Resources\AssignmentWorkerResource;
use App\Imports\AssignmentWorkerImport;
use App\Models\Assignment;
use App\Models\AssignmentWorker;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class AssignmentWorkerController extends Controller
{
    private $moduleName = 'AssignmentWorker';

    /**
     * Display a listing of the resource.
     */
    public function index($assignmentId) {
        // Get all assignmentWorkers by assignmentId
        $assignmentWorkers = AssignmentWorker::where('assignment_id', $assignmentId)->get();

        // Return collection of reportWorkTypeWorkers
        return AssignmentWorkerResource::collection($assignmentWorkers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAssignmentWorkerRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the assignment worker
        $assignmentWorker = AssignmentWorker::create($fields);

        // Return new assignment worker
        return response()->json([
            "assignmentWorker" => new AssignmentWorkerResource($assignmentWorker)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find assignment by ID using checkAssignmentWorker method
        $assignmentWorker = $this->checkAssignmentWorker($id);

        if ($assignmentWorker) {
            // Return assignment
            return new AssignmentWorkerResource($assignmentWorker);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAssignmentWorkerRequest $request, $id) {
        // Find assignment worker by ID using checkAssignmentWorker method
        $assignmentWorker = $this->checkAssignmentWorker($id);

        if ($assignmentWorker) {
            // Validate the request
            $fields = $request->validated();

            // Update the assignment worker
            $assignmentWorker->update($fields);

            // Return updated assignment worker
            return response()->json(["assignmentWorker" => new AssignmentWorkerResource($assignmentWorker)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find assignment worker by ID using checkAssignmentWorker method
        $assignmentWorker = $this->checkAssignmentWorker($id);

        if ($assignmentWorker) {
            // Delete the assignment worker
            $assignmentWorker->delete();

            // Return success message
            return response()->json(['message' => 'Assignment worker deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Export a file containing the assignment workers.
     */
    public function export($id) {
        // Find assignment worker by ID using checkAssignmentWorker method
        $assignment = Assignment::find($id);

        if ($assignment) {
            // return AssignmentWorkerExport file
            return Excel::download(new AssignmentWorkerExport($assignment->code), 'Assignments.xlsx');
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
            Excel::import(new AssignmentWorkerImport, $request->file('file'));

            return response()->json([
                'message' => 'Assignment workers imported successfully'
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
                'message' => 'Error importing assignment workers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function checkAssignmentWorker($id) {
        // Find assignment worker by ID
        $assignmentWorker = AssignmentWorker::find($id);

        // Return assignment worker if found, otherwise return null
        return $assignmentWorker ?? null;
    }
}
