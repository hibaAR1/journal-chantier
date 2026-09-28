<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Http\Resources\WorkResource;
use App\Http\Requests\StoreWorkRequest;
use App\Http\Requests\UpdateWorkRequest;

class WorkController extends Controller
{
    private $moduleName = 'Work';

    /**
     * Display a listing of the resource.
     */
    public function index() {
        // Return all works
        return WorkResource::collection(Work::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the work
        $work = Work::create($fields);

        // Return new work
        return response()->json([
            "work" => new WorkResource($work)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find work by ID using checkWork method
        $work = $this->checkWork($id);

        if ($work) {
            // Return work
            return new WorkResource($work);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkRequest $request, $id) {
        // Find work by ID using checkWork method
        $work = $this->checkWork($id);

        if ($work) {
            // Validate the request
            $fields = $request->validated();

            // Update the work
            $work->update($fields);

            // Return updated work
            return response()->json(["work" => new WorkResource($work)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find work by ID using checkWork method
        $work = $this->checkWork($id);

        if ($work) {
            // Delete the work
            $work->delete();

            // Return success message
            return response()->json(['message' => 'Work deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkWork($id) {
        // Find work by ID
        $work = Work::find($id);

        // Return work if found, otherwise return null
        return $work ?? null;

    }
}
