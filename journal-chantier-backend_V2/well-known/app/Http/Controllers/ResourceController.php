<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Http\Resources\ResourceResource;
use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;

class ResourceController extends Controller
{
    private $moduleName = 'Resource';

    /**
     * Display a listing of the resource.
     */
    public function index() {
        // Return all resources
        return ResourceResource::collection(Resource::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResourceRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the resource
        $resource = Resource::create($fields);

        // Return new resource
        return response()->json([
            "resource" => new ResourceResource($resource)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find resource by ID using checkResource method
        $resource = $this->checkResource($id);

        if ($resource) {
            // Return resource
            return new ResourceResource($resource);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResourceRequest $request, $id) {
        // Find resource by ID using checkResource method
        $resource = $this->checkResource($id);

        if ($resource) {
            // Validate the request
            $fields = $request->validated();

            // Update the resource
            $resource->update($fields);

            // Return updated resource
            return response()->json(["resource" => new ResourceResource($resource)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find resource by ID using checkResource method
        $resource = $this->checkResource($id);

        if ($resource) {
            // Delete the resource
            $resource->delete();

            // Return success message
            return response()->json(['message' => 'Resource deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkResource($id) {
        // Find resource by ID
        $resource = Resource::find($id);

        // Return resource if found, otherwise return null
        return $resource ?? null;

    }
}
