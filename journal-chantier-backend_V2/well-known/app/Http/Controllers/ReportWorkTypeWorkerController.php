<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReportResource;
use App\Models\ReportWorkTypeWorker;
use App\Http\Resources\ReportWorkTypeWorkerResource;
use App\Http\Requests\StoreReportWorkTypeWorkerRequest;
use App\Http\Requests\UpdateReportWorkTypeWorkerRequest;

class ReportWorkTypeWorkerController extends Controller
{
    private $moduleName = 'ReportWorkTypeWorker';

    // Display list of report work types have an id of report_work_type_id
    public function index($report_work_type_id) {
        // Get all reportWorkTypeWorkers by report_work_type_id
        $reportWorkTypeWorkers = ReportWorkTypeWorker::where('report_work_type_id', $report_work_type_id)->get();

        // Return collection of reportWorkTypeWorkers
        return ReportWorkTypeWorkerResource::collection($reportWorkTypeWorkers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReportWorkTypeWorkerRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the reportWorkTypeWorker
        $reportWorkTypeWorker = ReportWorkTypeWorker::create($fields);

        // Return new reportWorkTypeWorker
        return response()->json([
            "reportWorkTypeWorker" => new ReportWorkTypeWorkerResource($reportWorkTypeWorker)
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReportWorkTypeWorkerRequest $request, $id) {
        // Find reportWorkTypeWorker by ID using checkReportWorkTypeWorker method
        $reportWorkTypeWorker = $this->checkReportWorkTypeWorker($id);

        if ($reportWorkTypeWorker) {
            // Validate the request
            $fields = $request->validated();

            // Update the reportWorkTypeWorker
            $reportWorkTypeWorker->update($fields);

            // Return updated reportWorkTypeWorker
            return response()->json(["reportWorkTypeWorker" => new ReportWorkTypeWorkerResource($reportWorkTypeWorker)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find reportWorkTypeWorker by ID using checkReportWorkTypeWorker method
        $reportWorkTypeWorker = $this->checkReportWorkTypeWorker($id);

        if ($reportWorkTypeWorker) {
            // Delete the reportWorkTypeWorker
            $reportWorkTypeWorker->delete();

            // Return success message
            return response()->json(['message' => 'ReportWorkTypeWorker deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkReportWorkTypeWorker($id) {
        // Find reportWorkTypeWorker by ID
        $reportWorkTypeWorker = ReportWorkTypeWorker::find($id);

        // Return reportWorkTypeWorker if found, otherwise return null
        return $reportWorkTypeWorker ?? null;

    }

}
