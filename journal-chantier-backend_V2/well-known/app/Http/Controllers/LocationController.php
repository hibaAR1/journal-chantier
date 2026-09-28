<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Http\Resources\LocationResource;
use App\Http\Requests\StoreLocationRequest;
use App\Http\Requests\UpdateLocationRequest;

class LocationController extends Controller
{
    private $moduleName = 'Location';

    /**
     * Display a listing of the resource.
     */
    public function index() {
        // Return all locations
        return LocationResource::collection(Location::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLocationRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the location
        $location = Location::create($fields);

        // Return new location
        return response()->json([
            "location" => new LocationResource($location)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find location by ID using checkLocation method
        $location = $this->checkLocation($id);

        if ($location) {
            // Return location
            return new LocationResource($location);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLocationRequest $request, $id) {
        // Find location by ID using checkLocation method
        $location = $this->checkLocation($id);

        if ($location) {
            // Validate the request
            $fields = $request->validated();

            // Update the location
            $location->update($fields);

            // Return updated location
            return response()->json(["location" => new LocationResource($location)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find location by ID using checkLocation method
        $location = $this->checkLocation($id);

        if ($location) {
            // Delete the location
            $location->delete();

            // Return success message
            return response()->json(['message' => 'Location deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkLocation($id) {
        // Find location by ID
        $location = Location::find($id);

        // Return location if found, otherwise return null
        return $location ?? null;

    }
}
