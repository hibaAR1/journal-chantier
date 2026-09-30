<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Services\PunchSummaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/**
 * État Récapitulatif Journalier de Pointage (cahier des charges V3 — § 3.1.6).
 *
 * GET /api/punch-summary?date=2026-09-28            → tous les chantiers
 * GET /api/punch-summary?date=2026-09-28&site_id=3  → un chantier
 *
 * Mêmes droits que les pointages :
 *  - "view all punches"  → tous les chantiers ;
 *  - "view some punches" → seulement les chantiers dont l'utilisateur est responsable.
 */
class PunchSummaryController extends Controller
{
    private $moduleName = 'Punch';

    public function index(Request $request, PunchSummaryService $service)
    {
        $siteIds = $this->visibleSiteIds();

        if ($siteIds === []) {
            return $this->errorMessage($this->moduleName, 403);
        }

        $request->validate([
            'date' => ['nullable', 'date'],
            'site_id' => ['nullable', 'exists:sites,id'],
        ]);

        // Sans date : aujourd'hui
        $date = $request->input('date', now()->format('Y-m-d'));

        return response()->json(
            $service->build($date, $siteIds, $request->integer('site_id') ?: null)
        );
    }

    /**
     * Chantiers visibles : null = tous, [] = aucun.
     */
    private function visibleSiteIds(): ?array
    {
        if (Gate::allows('view all punches')) {
            return null;
        }

        if (Gate::allows('view some punches')) {
            $id = auth()->id();

            return Site::where(function ($query) use ($id) {
                $query->where('project_responsible_id', $id)
                    ->orWhere('conductor_id', $id)
                    ->orWhere('worker_id', $id)
                    ->orWhere('data_entry_id', $id);
            })->pluck('id')->all();
        }

        return [];
    }
}
