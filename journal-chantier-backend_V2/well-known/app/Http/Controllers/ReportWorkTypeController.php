<?php

namespace App\Http\Controllers;

use App\Models\ReportWorkType;
use App\Http\Resources\ReportWorkTypeResource;
use App\Http\Requests\StoreReportWorkTypeRequest;
use App\Http\Requests\UpdateReportWorkTypeRequest;

class ReportWorkTypeController extends Controller
{
    private $moduleName = 'ReportWorkType';

    // Display list of report work types have an id of report_id
   public function index($report_id) {
        // Get all reportWorkTypes by report_id
        $reportWorkTypes =
        ReportWorkType::where('report_id', $report_id) ->get();

        // Return collection of reportWorkTypes
        return ReportWorkTypeResource::collection($reportWorkTypes);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReportWorkTypeRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the reportWorkType
        $reportWorkType = ReportWorkType::create($fields);

        // Return new reportWorkType
        return response()->json([
            "reportWorkType" => new ReportWorkTypeResource($reportWorkType)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find reportWorkType by ID using checkReportWorkType method
        $reportWorkType = $this->checkReportWorkType($id);

        if ($reportWorkType) {
            // Return reportWorkType
            return response()->json(["reportWorkType" => new ReportWorkTypeResource($reportWorkType)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReportWorkTypeRequest $request, $id) {
        // Find reportWorkType by ID using checkReportWorkType method
        $reportWorkType = $this->checkReportWorkType($id);

        if ($reportWorkType) {
            // Validate the request
            $fields = $request->validated();

            // Update the reportWorkType
            $reportWorkType->update($fields);

            // Return updated reportWorkType
            return response()->json(["reportWorkType" => new ReportWorkTypeResource($reportWorkType)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find reportWorkType by ID using checkReportWorkType method
        $reportWorkType = $this->checkReportWorkType($id);

        if ($reportWorkType) {
            // Delete the reportWorkType
            $reportWorkType->delete();

            // Return success message
            return response()->json(['message' => 'ReportWorkType deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkReportWorkType($id) {
        // Find reportWorkType by ID
        $reportWorkType = ReportWorkType::find($id);

        // Return reportWorkType if found, otherwise return null

        return $reportWorkType ?? null;

    }

    public function reinstate($id)
    {
        $oldTask = ReportWorkType::findOrFail($id);
        $todayReportId = request()->report_id;

        if (!$todayReportId) {
            return response()->json([
                'message' => 'report_id requis'
            ], 422);
        }

        // Clone
        $newTask = $oldTask->replicate();
        $newTask->report_id = $todayReportId;
        $newTask->is_reported = false;
        $newTask->is_reinstated = true;

        // Valeurs modifiées depuis frontend
        $newTask->stat_work = request()->stat_work ?? $oldTask->stat_work;
        $newTask->quantity_completed = request()->quantity_completed ?? $oldTask->quantity_completed;

        $newTask->observations = ($oldTask->observations ?? '') . " | Réintégrée le " . now()->format('Y-m-d');
        $newTask->original_report_date = $oldTask->original_report_date ?? $oldTask->report->date;

        $newTask->save();

        // Ne pas supprimer l’ancienne tâche !

        return response()->json([
            'message' => 'Tâche réintégrée dans le journal du jour',
            'task' => new ReportWorkTypeResource($newTask)
        ]);
    }

}
