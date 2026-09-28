<?php

namespace App\Http\Controllers;

use App\Exports\ReportExport;
use App\Http\Resources\ReportWorkTypeResource;
use App\Http\Resources\ReportWorkTypeWorkerResource;
use App\Models\Report;
use App\Http\Resources\ReportResource;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use App\Models\ReportWorkType;
use App\Observers\ModelActivityObserver;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    private $moduleName = 'Report';

    /**
     * Display a listing of the resource.
     */
    public function index() {
        if (Gate::allows("view all reports")) {
            // Return all reports
            return ReportResource::collection(Report::all());
        } elseif (Gate::allows("view some reports")) {
            $id = auth()->id();

            // Return some reports
            return ReportResource::collection(Report::whereHas('site', function($query) use ($id) {
                $query->where(function($q) use ($id) {
                    $q->where('project_responsible_id', $id)
                        ->orWhere('conductor_id', $id)
                        ->orWhere('worker_id', $id);
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
    public function store(StoreReportRequest $request)
    {
        $fields = $request->validated();
        $fields['date'] = Carbon::parse($fields['date'])->format('Y-m-d');

        // Vérifier si un journal existe déjà pour ce site à cette date
        $existingReport = Report::where('date', $fields['date'])
            ->where('site_id', $fields['site_id'])
            ->first();

        if ($existingReport) {
            return response()->json([
                'error' => 'Le journal existe déjà pour ce site à cette date.'
            ], 409);
        }

        // Création du nouveau journal
        $report = Report::create($fields);

        // Récupérer le dernier journal du chantier avant la date actuelle
        $lastReport = Report::where('site_id', $report->site_id)
            ->where('date', '<', $report->date)
            ->orderBy('date', 'desc')
            ->first();

        if ($lastReport) {
            // Tâches inachevées non encore reportées
            $tasksToReport = ReportWorkType::where('report_id', $lastReport->id)
                ->where('stat_work', '<', 100)
                ->where('is_reported', 0)
                ->get();

            foreach ($tasksToReport as $task) {
                // Cloner la tâche dans le nouveau journal
                ReportWorkType::create([
                    'report_id' => $report->id,
                    'work_type_id' => $task->work_type_id,
                    'site_location_id' => $task->site_location_id,
                    'stat_work' => $task->stat_work,
                    'quantity_completed' => $task->quantity_completed,
                    'is_reported' => true,
                    'original_report_date' => $lastReport->date,
                    'observations' => ($task->observations ?? '') . " | Tâche reportée automatiquement du {$lastReport->date}",
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // Marquer l’ancienne tâche comme reportée pour éviter double report
                $task->is_reported = true;
                $task->save();
            }
        }

        return response()->json([
            "report" => new ReportResource($report)
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show($id) {
        if (!Gate::allows("view all reports") && !Gate::allows("view some reports")) {
            return $this->errorMessage($this->moduleName);
        }

        $report = Report::with([
            'reportWorkTypes.workType',
            'reportWorkTypes.siteLocation',
            'reportWorkTypes.reportWorkTypeWorkers.worker'
        ])->find($id);

        if (!$report) {
            return $this->errorMessage($this->moduleName);
        }

        // Tâches reportées (provenant des jours précédents)
        $reportedTasks = $report->reportWorkTypes->where('is_reported', true);

        // Tâches normales du jour J
        $todayTasks = $report->reportWorkTypes->where('is_reported', false);

        return response()->json([
            "report" => new ReportResource($report),
            "reportedTasks" => ReportWorkTypeResource::collection($reportedTasks),
            "today_tasks" => ReportWorkTypeResource::collection(
                $report->reportWorkTypes->where('is_reported', false)
            )
        ]);

    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReportRequest $request, $id) {
        // Find report by ID using checkReport method
        $report = $this->checkReport($id);

        if ($report) {
            // Validate the request
            $fields = $request->validated();

            $fields['date'] = Carbon::parse($fields['date'])->format('Y-m-d');

            // Update the report
            $report->update($fields);

            ReportWorkType::where('report_id', $report->$id)
                ->where('is_reported', true)
                ->where('stat_work', 100)
                ->update([
                    'is_reported' => false,
                    'reported_from_date' => null
                ]);

            // Return updated report
            return response()->json(["report" => new ReportResource($report)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find report by ID using checkReport method
        $report = $this->checkReport($id);

        if ($report) {
            // Delete the report
            $report->delete();

            // Return success message
            return response()->json(['message' => 'Report deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    public function validateReport($id) {

        $report = Report::with('reportWorkTypeWorkers')->find($id);

        if (!$report) {
            return response()->json(['error' => 'Repport ot found'], '404');
        }

        if ($report->reportWorkTypeWorkers()->count() === 0) {
            return response()->json(['error' => 'Impossible de valider un journal sans travailleurs.'], 400);
        }

        if ($report->validated) {
            return response()->json(['report' => 'Ce journal est déjà validé'], 200);
        }

        $report->skipObserver = true;
        $report->validated = true;
        $report->save();

        ModelActivityObserver::log('validated', $report);

        return response()->json([
            "report" => new ReportResource($report),
            "message" => "Journal validé avec succès."], 200);
    }

    public function invalidateReport($id) {

        $report = $this->checkReport($id);

        if (!$report) {
            return response()->json(['message' => 'Ce journal est déjà non validé'], 200);
        }

        $report->skipObserver = true;
        $report->validated = false;
        $report->save();

        ModelActivityObserver::log('invalidated', $report);


        return response()->json([
            "report" => new ReportResource($report),
            "message" => "Journal dévalidé avec succès."
        ], 200);
    }


    public function downloadReport($id)
    {
        $report = Report::with([
            'site',
            'reportWorkTypes.workType',
            'reportWorkTypes.siteLocation',
            'reportWorkTypes.reportWorkTypeWorkers.worker'
        ])->findOrFail($id);

        // Passer les données à la vue Blade
        $pdf = PDF::loadView('report.template', [
            'report' => $report,
            'dateDownload' => Carbon::now()->format('d/m/Y H:i'),
        ])->setPaper('A4', 'portrait');

        // Téléchargement du PDF
        return $pdf->download('journal_chantier_'.$report->code.'.pdf');
    }
    public function downloadReportExcel($id)
    {
        $report = Report::with([
            'site',
            'reportWorkTypes.workType',
            'reportWorkTypes.siteLocation',
            'reportWorkTypes.reportWorkTypeWorkers.worker'
        ])->findOrFail($id);

        return Excel::download(new ReportExport($report), 'journal_chantier_'.$report->code.'.xlsx');
    }
    private function checkReport($id) {
        // Find report by ID
        $report = Report::find($id);

        // Return report if found, otherwise return null
        return $report ?? null;
    }

    public function isLast($id)
    {
        $report = Report::find($id);

        if (!$report) {
            return response()->json(['error' => 'Report not found'], 404);
        }

        // Trouver le dernier journal du même site
        $lastReport = Report::where('site_id', $report->site_id)
            ->orderBy('date', 'desc')
            ->first();

        return response()->json([
            "is_last" => $lastReport && $lastReport->id == $report->id
        ]);
    }
 }
