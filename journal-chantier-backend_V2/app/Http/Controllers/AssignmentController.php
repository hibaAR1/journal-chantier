<?php

namespace App\Http\Controllers;

use App\Exports\AssignmentWorkerExport;
use App\Http\Requests\StoreAssignmentRequest;
use App\Http\Requests\UpdateAssignmentRequest;
use App\Http\Resources\AssignmentResource;
use App\Models\Assignment;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;

class AssignmentController extends Controller
{
    private $moduleName = 'Assignment';

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Gate::allows("view all assignments")) {
            // Return all assignments
            return AssignmentResource::collection(Assignment::all());
        } elseif (Gate::allows("view some assignments")) {
            $id = auth()->id();

            // Return some assignments
            return AssignmentResource::collection(Assignment::whereHas('site', function ($query) use ($id) {
                $query->where(function ($q) use ($id) {
                    $q->where('project_responsible_id', $id)
                        ->orWhere('conductor_id', $id)
                        ->orWhere('worker_id', $id)
                        ->orWhere('data_entry_id', $id);
                });
            })->get());
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAssignmentRequest $request)
    {
        // Validate the request
        $fields = $request->validated();

        // Store the assignment
        $assignment = Assignment::create($fields);

        // Return new assignment
        return response()->json([
            "assignment" => new AssignmentResource($assignment)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        if (Gate::allows("view all assignments")) {
            $assignment = $this->checkAssignment($id);

            if ($assignment) {
                // Return assignment
                return new AssignmentResource($assignment);
            } else {
                // Return error message
                return $this->errorMessage($this->moduleName);
            }
        } elseif (Gate::allows("view some assignments")) {
            $userId = auth()->id();

            // Get assignment by Id and user Id
            $assignment = Assignment::where('id', $id)->whereHas('site', function ($query) use ($userId) {
                $query->where(function ($q) use ($userId) {
                    $q->where('project_responsible_id', $userId)
                        ->orWhere('conductor_id', $userId)
                        ->orWhere('worker_id', $userId);
                });
            })->first();

            if ($assignment) {
                // Return assignment
                return new AssignmentResource($assignment);
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
    public function update(UpdateAssignmentRequest $request, $id)
    {
        // Find assignment by ID using checkAssignment method
        $assignment = $this->checkAssignment($id);

        if ($assignment) {
            // Validate the request
            $fields = $request->validated();

            // Update the assignment
            $assignment->update($fields);

            // Return updated assignment
            return response()->json(["assignment" => new AssignmentResource($assignment)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find assignment by ID using checkAssignment method
        $assignment = $this->checkAssignment($id);

        if ($assignment) {
            // Delete the assignment
            $assignment->delete();

            // Return success message
            return response()->json(['message' => 'Assignment deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkAssignment($id)
    {
        // Find assignment by ID
        $assignment = Assignment::find($id);

        // Return assignment if found, otherwise return null
        return $assignment ?? null;
    }
}
