<?php

namespace App\Http\Controllers;

use App\Exports\PunchDetailExport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Export Pointage Détaillé — Format Excel (cahier des charges V3 — § 3.2).
 *
 * GET /api/punch-details/export?from=2026-09-01&to=2026-09-30&site_ids[]=1&site_ids[]=3
 *  - from / to : période (ou un seul jour si from = to) ;
 *  - site_ids  : chantiers choisis (vide = tous).
 *
 * Accès réservé (Service RH, Directeur d'Exploitation) : permission "export punch details".
 */
class PunchDetailExportController extends Controller
{
    private $moduleName = 'Punch';

    public function export(Request $request)
    {
        if (!Gate::allows('export punch details')) {
            return $this->errorMessage($this->moduleName, 403);
        }

        $request->validate([
            'from' => ['required', 'date'],
            'to' => ['required', 'date', 'after_or_equal:from'],
            'site_ids' => ['nullable', 'array'],
            'site_ids.*' => ['integer', 'exists:sites,id'],
        ], [
            'from.required' => 'La date de début est obligatoire.',
            'to.required' => 'La date de fin est obligatoire.',
            'to.after_or_equal' => 'La date de fin doit être après la date de début.',
        ]);

        $from = Carbon::parse($request->from)->format('Y-m-d');
        $to = Carbon::parse($request->to)->format('Y-m-d');

        // Garde-fou : une colonne par jour, on limite à une année
        if (Carbon::parse($from)->diffInDays(Carbon::parse($to)) > 366) {
            return response()->json(['message' => 'La période ne peut pas dépasser un an.'], 422);
        }

        $siteIds = $request->input('site_ids') ?: null;

        $fileName = $from === $to
            ? "Pointage_detaille_{$from}.xlsx"
            : "Pointage_detaille_{$from}_au_{$to}.xlsx";

        return Excel::download(new PunchDetailExport($from, $to, $siteIds), $fileName);
    }
}
