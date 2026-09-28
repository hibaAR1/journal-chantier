<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSiteRequest;
use App\Http\Requests\UpdateSiteRequest;
use App\Http\Resources\SiteResource;
use App\Models\Site;
use App\Models\Worker;
use Illuminate\Support\Facades\Gate;

class SiteController extends Controller
{
    private $moduleName = 'Site';

    /**
     * Display a listing of the resource.
     */
    public function index() {
        if (Gate::allows("view all sites")) {
            // Return all sites
            return SiteResource::collection(Site::all());
        } elseif (Gate::allows("view some sites")) {
            $id = auth()->id();

            // Return some sites
            return SiteResource::collection(Site::where(function($query) use ($id) {
                $query->where('project_responsible_id', $id)
                    ->orWhere('conductor_id', $id)
                    ->orWhere('worker_id', $id);
            })->get());
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSiteRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the site
        $site = Site::create($fields);

//        $worker = Worker::where('registration_number', $site->worker->registration_number)->first();
//
//        $worker->site_id = $site->id;
//
//        $worker->save();

        // Return new site
        return response()->json([
            "site" => new SiteResource($site)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find site by ID using checkSite method
        $site = $this->checkSite($id);

        if ($site) {
            // Return site
            return [
                "site" => new SiteResource($site)
            ];
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSiteRequest $request, $id) {
        // Find site by ID using checkSite method
        $site = $this->checkSite($id);

        if ($site) {
            // Get the last worker associated with the site
            $lastWorker = Worker::where('site_id', $site->id)->latest()->first();

            if ($lastWorker) {
                // Set the site_id to null for the last worker
                $lastWorker->site_id = null;
                $lastWorker->save();
            }

            // Validate the request
            $fields = $request->validated();

            // Update the site
            $site->update($fields);

            // Return updated site
            return response()->json(["site" => new SiteResource($site)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find site by ID using checkSite method
        $site = $this->checkSite($id);

        if ($site) {
            // Delete the site
            $site->delete();

            // Return success message
            return response()->json(['message' => 'Site deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkSite($id) {
        // Find site by ID
        $site = Site::find($id);

        // Return site if found, otherwise return null
        return $site ?? null;
    }
}
