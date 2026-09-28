<?php

namespace App\Http\Controllers;

use App\Models\SiteLocation;
use App\Http\Resources\SiteLocationResource;
use App\Http\Requests\StoreSiteLocationRequest;
use App\Http\Requests\UpdateSiteLocationRequest;
use Illuminate\Support\Facades\DB;

class SiteLocationController extends Controller
{
    private $moduleName = 'SiteLocation';

    // Display list of report work types have an id of site_id
    public function index($site_id) {
        // Get all siteLocations by site_id
        $siteLocations = SiteLocation::where('site_id', $site_id)->get();

        // Return collection of siteLocations
        return SiteLocationResource::collection($siteLocations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSiteLocationRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the siteLocation
        $siteLocation = SiteLocation::create($fields);

        // Return new siteLocation
        return response()->json([
            "siteLocation" => new SiteLocationResource($siteLocation)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find siteLocation by ID using checkSiteLocation method
        $siteLocation = $this->checkSiteLocation($id);

        if ($siteLocation) {
            // Return siteLocation
            return response()->json(["siteLocation" => new SiteLocationResource($siteLocation)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSiteLocationRequest $request, $id) {
        // Find siteLocation by ID using checkSiteLocation method
        $siteLocation = $this->checkSiteLocation($id);

        if ($siteLocation) {
            // Validate the request
            $fields = $request->validated();

            // Update the siteLocation
            $siteLocation->update($fields);

            // Return updated siteLocation
            return response()->json(["siteLocation" => new SiteLocationResource($siteLocation)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find siteLocation by ID using checkSiteLocation method
        $siteLocation = $this->checkSiteLocation($id);

        if ($siteLocation) {
            // Delete the siteLocation
            $siteLocation->delete();

            // Return success message
            return response()->json(['message' => 'SiteLocation deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkSiteLocation($id) {
        // Find siteLocation by ID
        $siteLocation = SiteLocation::find($id);

        // Return siteLocation if found, otherwise return null
        return $siteLocation ?? null;

    }
}
