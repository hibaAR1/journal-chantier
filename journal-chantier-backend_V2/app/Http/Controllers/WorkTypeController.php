<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\WorkType;
use App\Http\Resources\WorkTypeResource;
use App\Http\Requests\StoreWorkTypeRequest;
use App\Http\Requests\UpdateWorkTypeRequest;

class WorkTypeController extends Controller
{
    private $moduleName = 'WorkType';

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Return all workTypes
        return WorkTypeResource::collection(WorkType::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkTypeRequest $request)
    {
        // Validate the request
        $fields = $request->validated();

        $work = Work::findOrFail($fields['work_id']);

        if ($work->site_id) {
            $fields['scope']   = 'C';
            $fields['site_id'] = $work->site_id;
        } else {
            $fields['scope']   = 'G';
            $fields['site_id'] = null;
        }

        // Store the workType
        $workType = WorkType::create($fields);

        // Return new workType
        return response()->json([
            "workType" => new WorkTypeResource($workType)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Find workType by ID using checkWorkType method
        $workType = $this->checkWorkType($id);

        if ($workType) {
            // Return workType
            return new WorkTypeResource($workType);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkTypeRequest $request, $id)
    {
        // Find workType by ID using checkWorkType method
        $workType = $this->checkWorkType($id);

        if ($workType) {
            // Validate the request
            $fields = $request->validated();

            if (array_key_exists('work_id', $fields)) {
                $work = Work::findOrFail($fields['work_id']);

                if ($work->site_id) {
                    $fields['scope']   = 'C';
                    $fields['site_id'] = $work->site_id;
                } else {
                    $fields['scope']   = 'G';
                    $fields['site_id'] = null;
                }
            }

            // Update the workType
            $workType->update($fields);

            // Return updated workType
            return response()->json(["workType" => new WorkTypeResource($workType)], 200);
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
        // Find workType by ID using checkWorkType method
        $workType = $this->checkWorkType($id);

        if ($workType) {
            // Delete the workType
            $workType->delete();

            // Return success message
            return response()->json(['message' => 'WorkType deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkWorkType($id)
    {
        // Find workType by ID
        $workType = WorkType::find($id);

        // Return workType if found, otherwise return null
        return $workType ?? null;
    }
}
