<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportWorkType;
use App\Models\Site;
use App\Models\Work;
use App\Models\WorkType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

/**
 * Tableau de bord — exploitation des journaux de chantier (Cahier des charges V3 — § 2.2 à 2.5).
 *
 *  - daily()      : tableau de bord journalier (§ 2.2)
 *  - history()    : suivi historique d'un chantier (§ 2.3)
 *  - comparison() : comparatif multi-chantiers (§ 2.4)
 *  - prices()     : base de prix / référentiel des temps unitaires (§ 2.5)
 *
 * Règles communes :
 *  - TU (temps unitaire) = heures (H.N + H.S) ÷ quantité ; rendement = quantité ÷ heures ;
 *  - les valeurs sont calculées exactes et arrondies à 2 décimales uniquement à l'affichage ;
 *  - les tâches reportées automatiquement sans ouvrier ne sont pas comptées (voir workedTasks()).
 */
class DashboardController extends Controller
{
    private $moduleName = 'Dashboard';

    /**
     * Classement de la main-d'oeuvre directe selon la QUALIFICATION de l'ouvrier
     * (champ "Ressource"), comme demandé au § 2.6.2 et § 3.1.4 du cahier des charges :
     *  - "Main d'oeuvre" = Ouvrier travaux ;
     *  - "Qualifiés"     = le reste de la main-d'oeuvre directe.
     * Le type de contrat (CDI, TECTRA…) n'entre pas en compte.
     * Noms comparés sans accents ni majuscules ("Maçon" = "macon").
     */
    private const LABOUR_QUALIFICATIONS = ['ouvrier travaux'];
    private const QUALIFIED_QUALIFICATIONS = ['boiseur', 'macon', 'ferrailleur', 'poseur', 'traceur', 'platrier', 'grutier'];

    /**
     * GET /api/dashboard/daily?site_id=1&date=2026-07-07
     *
     * Si "date" est absente, on prend le dernier journal du chantier contenant du travail saisi.
     */
    public function daily(Request $request)
    {
        if (!Gate::allows('view dashboard')) {
            return $this->errorMessage($this->moduleName, 403);
        }

        $request->validate([
            'site_id' => ['required', 'exists:sites,id'],
            'date' => ['nullable', 'date'],
        ]);

        $site = Site::find($request->site_id);

        if (!$this->canViewSite($site)) {
            return $this->errorMessage($this->moduleName, 403);
        }

        $date = $request->filled('date')
            ? Carbon::parse($request->date)->format('Y-m-d')
            : $this->lastWorkedDate([$site->id]);

        $report = $date
            ? Report::with([
                'reportWorkTypes.workType.work',
                'reportWorkTypes.siteLocation',
                'reportWorkTypes.reportWorkTypeWorkers.worker.resourceRel',
            ])
                ->where('site_id', $site->id)
                ->whereDate('date', $date)
                ->first()
            : null;

        $tasks = $report ? $this->workedTasks($report->reportWorkTypes) : collect();

        return response()->json([
            'site' => [
                'id' => $site->id,
                'name' => $site->name,
            ],
            'date' => $date ? Carbon::parse($date)->format('Y-m-d') : null,
            'report' => $report ? [
                'id' => $report->id,
                'code' => $report->code,
                'validated' => (bool) $report->validated,
            ] : null,
            'indicators' => $this->indicators($tasks),
            'workforce_by_category' => $this->workforceByCategory($tasks),
            'tasks' => $this->tasksPerformance($tasks),
        ]);
    }

    /**
     * Suivi historique d'un chantier (Cahier des charges V3 — § 2.3).
     *
     * GET /api/dashboard/history?site_id=1&from=2026-07-10&to=2026-07-15
     *
     * Sans période : les 7 derniers jours jusqu'au dernier journal du chantier.
     * Un point par jour ayant un journal (découpage à la journée).
     */
    public function history(Request $request)
    {
        if (!Gate::allows('view dashboard')) {
            return $this->errorMessage($this->moduleName, 403);
        }

        $request->validate([
            'site_id' => ['required', 'exists:sites,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ]);

        $site = Site::find($request->site_id);

        if (!$this->canViewSite($site)) {
            return $this->errorMessage($this->moduleName, 403);
        }

        $lastReportDate = $this->lastWorkedDate([$site->id]);

        $to = $request->filled('to')
            ? Carbon::parse($request->to)
            : Carbon::parse($lastReportDate ?? now());

        $from = $request->filled('from')
            ? Carbon::parse($request->from)
            : $to->copy()->subDays(6);

        $reports = Report::with([
            'reportWorkTypes.workType.work',
            'reportWorkTypes.reportWorkTypeWorkers',
        ])
            ->where('site_id', $site->id)
            ->whereDate('date', '>=', $from->format('Y-m-d'))
            ->whereDate('date', '<=', $to->format('Y-m-d'))
            ->orderBy('date')
            ->get();

        $days = $reports
            ->map(fn($report) => Carbon::parse($report->date)->format('Y-m-d'))
            ->unique()
            ->values();

        // Toutes les lignes de tâches de la période, avec leur jour
        $tasks = $reports->flatMap(function ($report) {
            $day = Carbon::parse($report->date)->format('Y-m-d');

            return $this->workedTasks($report->reportWorkTypes)->map(fn($task) => ['day' => $day, 'task' => $task]);
        });

        return response()->json([
            'site' => [
                'id' => $site->id,
                'name' => $site->name,
            ],
            'from' => $from->format('Y-m-d'),
            'to' => $to->format('Y-m-d'),
            'days' => $days->all(),
            'quantity_by_unit' => $this->quantityByUnit($tasks, $days),
            'hours_by_day' => $this->hoursByDay($tasks, $days),
            'quantity_by_task' => $this->quantityByTask($tasks),
        ]);
    }

    /**
     * Une série par unité (M2, ML, KG…) : quantité réalisée chaque jour.
     * Seules les unités ayant au moins une valeur sur la période sont renvoyées.
     */
    private function quantityByUnit(Collection $tasks, Collection $days): array
    {
        return $tasks
            ->groupBy(fn($row) => optional(optional($row['task']->workType)->work)->unit ?? '—')
            ->map(function (Collection $rows, $unit) use ($days) {
                $byDay = $rows->groupBy('day');

                return [
                    'unit' => $unit,
                    // Catégories de travaux concernées, pour le titre : "M2 (maçonnerie et enduit)"
                    'categories' => $rows
                        ->map(fn($row) => $this->shortCategory(optional(optional($row['task']->workType)->work)->name))
                        ->filter()
                        ->unique()
                        ->values()
                        ->all(),
                    'values' => $days->map(
                        fn($day) => round($byDay->get($day, collect())->sum(fn($row) => $row['task']->quantity_completed ?? 0), 2)
                    )->all(),
                ];
            })
            ->filter(fn($serie) => array_sum($serie['values']) > 0)
            ->values()
            ->all();
    }

    /**
     * Heures normales et heures sup. cumulées par jour.
     */
    private function hoursByDay(Collection $tasks, Collection $days): array
    {
        $byDay = $tasks->groupBy('day');

        return $days->map(function ($day) use ($byDay) {
            $workers = $byDay->get($day, collect())->flatMap(fn($row) => $row['task']->reportWorkTypeWorkers);

            return [
                'date' => $day,
                'normal_hours' => round($workers->sum('normal_hours'), 2),
                'overtime_hours' => round($workers->sum('overtime_hours'), 2),
            ];
        })->all();
    }

    /**
     * Quantité totale par tâche sur la période (+ nombre de lignes de journal).
     */
    private function quantityByTask(Collection $tasks): array
    {
        return $tasks
            ->groupBy(fn($row) => optional($row['task']->workType)->id)
            ->map(function (Collection $rows) {
                $workType = $rows->first()['task']->workType;

                return [
                    'work_type_id' => optional($workType)->id,
                    'task' => optional($workType)->name,
                    'unit' => optional(optional($workType)->work)->unit,
                    'quantity' => round($rows->sum(fn($row) => $row['task']->quantity_completed ?? 0), 2),
                    'lines' => $rows->count(),
                ];
            })
            ->sortByDesc('quantity')
            ->values()
            ->all();
    }

    /**
     * Comparatif multi-chantiers (Cahier des charges V3 — § 2.4).
     *
     * GET /api/dashboard/comparison?from=2026-07-07&to=2026-07-07&work_type_id=5
     *
     * Sans période : la journée du dernier journal saisi (tous chantiers confondus).
     * "work_type_id" = tâche comparée dans le diagramme "Comparaison d'une tâche".
     */
    public function comparison(Request $request)
    {
        if (!Gate::allows('view dashboard')) {
            return $this->errorMessage($this->moduleName, 403);
        }

        $request->validate([
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
                 'work_type_id' => ['nullable', 'exists:work_types,id'],
            'site_ids' => ['nullable', 'array'],
            'site_ids.*' => ['integer'],
        ]);

        $siteIds = $this->visibleSiteIds();
        $lastReportDate = $this->lastWorkedDate($siteIds);

        $to = $request->filled('to')
            ? Carbon::parse($request->to)
            : Carbon::parse($lastReportDate ?? now());

        $from = $request->filled('from')
            ? Carbon::parse($request->from)
            : $to->copy();

        $reports = Report::with([
            'site:id,name',
            'reportWorkTypes.workType.work',
            'reportWorkTypes.workType.site:id,name',
            'reportWorkTypes.reportWorkTypeWorkers',
        ])
            ->whereIn('site_id', $siteIds)
            ->whereDate('date', '>=', $from->format('Y-m-d'))
            ->whereDate('date', '<=', $to->format('Y-m-d'))
            ->get();

               // Chantiers actifs = chantiers ayant au moins un journal sur la période
        $activeSites = $reports
            ->map(fn($report) => $report->site)
            ->filter()
            ->unique('id')
            ->sortBy('name')
            ->values();

        // Chantiers choisis dans le sélecteur (parmi les chantiers actifs) ; aucun choix = tous
        $selectedIds = collect($request->input('site_ids', []))->map(fn($id) => (int) $id);
        $sites = $selectedIds->isEmpty()
            ? $activeSites
            : $activeSites->filter(fn($site) => $selectedIds->contains($site->id))->values();

        $reports = $reports->whereIn('site_id', $sites->pluck('id'))->values();

        // Une ligne par tâche de journal, avec son chantier
        $tasks = $reports->flatMap(
            fn($report) => $this->workedTasks($report->reportWorkTypes)->map(fn($task) => ['site_id' => $report->site_id, 'task' => $task])
        );

        $sharedTasks = $this->sharedTasks($tasks);
        $periodTasks = $this->periodTasks($tasks);

        // Tâche comparée : celle demandée (si elle a été réalisée sur la période),
        // sinon la tâche partagée par le plus de chantiers, sinon la première tâche de la période
        $requested = $request->filled('work_type_id') ? (int) $request->work_type_id : null;
        $workTypeId = collect($periodTasks)->contains('id', $requested)
            ? $requested
            : (collect($sharedTasks)->first()['work_type_id'] ?? collect($periodTasks)->first()['id'] ?? null);

        return response()->json([
            'from' => $from->format('Y-m-d'),
            'to' => $to->format('Y-m-d'),
                       // Tous les chantiers actifs sur la période (options du sélecteur)
            'active_sites' => $activeSites->map(fn($site) => ['id' => $site->id, 'name' => $site->name])->all(),
            // Chantiers réellement comparés
                      // Tous les chantiers actifs sur la période (options du sélecteur)
            'active_sites' => $activeSites->map(fn($site) => ['id' => $site->id, 'name' => $site->name])->all(),
            // Chantiers réellement comparés
            'sites' => $sites->map(fn($site) => ['id' => $site->id, 'name' => $site->name])->all(),
            'sites_hours' => $this->sitesHours($reports, $sites),
            'tasks' => $periodTasks,
            'task_comparison' => $this->taskComparison($tasks, $sites, $workTypeId),
            'multi_tasks' => $sharedTasks,
        ]);
    }

    /**
     * Heures totales / H.N / H.S / Effectif / % H.S par chantier.
     */
    private function sitesHours(Collection $reports, Collection $sites): array
    {
        $bySite = $reports->groupBy('site_id');

        return $sites->map(function ($site) use ($bySite) {
            $workers = $bySite->get($site->id, collect())
                ->flatMap->reportWorkTypes
                ->flatMap->reportWorkTypeWorkers;

            $normal = round($workers->sum('normal_hours'), 2);
            $overtime = round($workers->sum('overtime_hours'), 2);
            $total = $normal + $overtime;

            return [
                'site_id' => $site->id,
                'site' => $site->name,
                'total_hours' => $total,
                'normal_hours' => $normal,
                'overtime_hours' => $overtime,
                'workforce' => $workers->pluck('worker_id')->unique()->count(),
                'overtime_rate' => $total > 0 ? round($overtime / $total * 100, 1) : 0,
            ];
        })->all();
    }

    /**
     * Liste des tâches réalisées sur la période (pour le sélecteur "Tâche").
     */
    private function periodTasks(Collection $tasks): array
    {
        return $tasks
            ->map(fn($row) => $row['task']->workType)
            ->filter()
            ->unique('id')
            ->sortBy('name')
            ->map(fn($workType) => [
                'id' => $workType->id,
                'name' => $this->taskLabel($workType),
                'unit' => optional($workType->work)->unit,
            ])
            ->values()
            ->all();
    }

    /**
     * TU réel d'une tâche sur chaque chantier l'ayant réalisée, + TU de référence.
     */
    private function taskComparison(Collection $tasks, Collection $sites, ?int $workTypeId): ?array
    {
        if (!$workTypeId) {
            return null;
        }

        $rows = $tasks->filter(fn($row) => $row['task']->work_type_id === $workTypeId);
        $workType = optional($rows->first())['task']?->workType;

        $values = $sites
            ->map(fn($site) => [
                'site' => $site->name,
                'unit_time' => $this->rounded($this->aggregatedUnitTime($rows->where('site_id', $site->id))),
            ])
            // Les chantiers n'ayant pas réalisé la tâche n'apparaissent pas
            ->filter(fn($row) => $row['unit_time'] !== null)
            ->values()
            ->all();

        return [
            'work_type_id' => $workTypeId,
            'task' => $workType ? $this->taskLabel($workType) : null,
            'unit' => optional(optional($workType)->work)->unit,
            'reference_unit_time' => optional($workType)->t_u !== null ? (float) $workType->t_u : null,
            'values' => $values,
        ];
    }

    /**
     * Tableau "Comparaison multi-tâches" : TU réel de chaque tâche réalisée
     * par au moins 2 chantiers sur la période. null = tâche non réalisée ("–").
     */
    private function sharedTasks(Collection $tasks): array
    {
        return $tasks
            ->groupBy(fn($row) => $row['task']->work_type_id)
            ->map(function (Collection $rows, $workTypeId) {
                $workType = $rows->first()['task']->workType;

                $unitTimes = $rows->groupBy('site_id')
                    ->map(fn($siteRows) => $this->rounded($this->aggregatedUnitTime($siteRows)))
                    ->filter(fn($unitTime) => $unitTime !== null);

                return [
                    'work_type_id' => (int) $workTypeId,
                    'task' => $workType ? $this->taskLabel($workType) : null,
                    'unit' => optional(optional($workType)->work)->unit,
                    'unit_times' => $unitTimes->all(), // { site_id: TU }
                ];
            })
            ->filter(fn($row) => count($row['unit_times']) >= 2)
            ->sortByDesc(fn($row) => count($row['unit_times']))
            ->values()
            ->all();
    }

    /**
     * TU sur une période = total des heures ÷ total des quantités (valeur exacte, non arrondie).
     */
    private function aggregatedUnitTime(Collection $rows): ?float
    {
        $hours = $rows->sum(fn($row) => $this->taskHours($row['task']));
        $quantity = $rows->sum(fn($row) => $row['task']->quantity_completed ?? 0);

        return ($hours > 0 && $quantity > 0) ? $hours / $quantity : null;
    }

    /**
     * Date du dernier journal contenant du travail saisi (au moins un ouvrier sur une tâche),
     * pour les périodes par défaut : on évite d'ouvrir le tableau de bord sur un journal vide.
     * S'il n'y en a aucun, on prend le dernier journal tout court.
     */
    private function lastWorkedDate(array $siteIds): ?string
    {
        $lastWorked = Report::whereIn('site_id', $siteIds)
            ->whereHas('reportWorkTypes.reportWorkTypeWorkers')
            ->latest('date')
            ->first();

        $report = $lastWorked ?? Report::whereIn('site_id', $siteIds)->latest('date')->first();

        return $report ? Carbon::parse($report->date)->format('Y-m-d') : null;
    }

    /**
     * Identifiants des chantiers visibles par l'utilisateur (même règle que les journaux).
     */
    private function visibleSiteIds(): array
    {
        if (Gate::allows('view all reports')) {
            return Site::pluck('id')->all();
        }

        if (Gate::allows('view some reports')) {
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

    /**
     * Base de prix / référentiel des temps unitaires (Cahier des charges V3 — § 2.5).
     *
     * GET /api/dashboard/prices?work_id=2&from=2026-01-01&to=2026-09-30
     *
     * Toutes les tâches du catalogue (même jamais réalisées : 0 relevé),
     * avec TU moyen / min / max calculés à partir des lignes de journal.
     * Sans période : tout l'historique.
     */
    public function prices(Request $request)
    {
        if (!Gate::allows('view dashboard')) {
            return $this->errorMessage($this->moduleName, 403);
        }

        $request->validate([
            'work_id' => ['nullable', 'exists:works,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ]);

        $siteIds = $this->visibleSiteIds();

        // Catalogue : tâches globales + tâches propres aux chantiers visibles
        $catalog = WorkType::with(['work', 'site:id,name'])
            ->where(fn($query) => $query->whereNull('site_id')->orWhereIn('site_id', $siteIds))
            ->when($request->filled('work_id'), fn($query) => $query->where('work_id', $request->work_id))
            ->orderBy('name')
            ->get();

        // Lignes de journal de la période (un relevé = une ligne avec heures et quantité)
        $lines = ReportWorkType::with('reportWorkTypeWorkers')
            ->whereIn('work_type_id', $catalog->pluck('id'))
            ->whereHas('report', function ($query) use ($request, $siteIds) {
                $query->whereIn('site_id', $siteIds)
                    ->when($request->filled('from'), fn($q) => $q->whereDate('date', '>=', Carbon::parse($request->from)->format('Y-m-d')))
                    ->when($request->filled('to'), fn($q) => $q->whereDate('date', '<=', Carbon::parse($request->to)->format('Y-m-d')));
            })
            ->get()
            ->groupBy('work_type_id');

        $rows = $catalog->map(function (WorkType $workType) use ($lines) {
            // TU exact de chaque relevé (heures ÷ quantité), en ignorant les lignes incomplètes
            $unitTimes = $this->workedTasks($lines->get($workType->id, collect()))
                ->map(fn(ReportWorkType $line) => $this->unitTime($line))
                ->filter(fn($unitTime) => $unitTime !== null)
                ->values();

            // On arrondit seulement le résultat final (et non chaque relevé)
            $average = $unitTimes->isNotEmpty() ? $unitTimes->avg() : null;
            $reference = $workType->t_u !== null ? (float) $workType->t_u : null;

            return [
                'id' => $workType->id,
                'task' => $this->taskLabel($workType),
                'category' => optional($workType->work)->name,
                'unit' => optional($workType->work)->unit,
                'average_unit_time' => $this->rounded($average),
                'min_unit_time' => $this->rounded($unitTimes->min()),
                'max_unit_time' => $this->rounded($unitTimes->max()),
                'reference_unit_time' => $reference,
                'status' => $this->taskStatus($average, $reference),
                'readings' => $unitTimes->count(),
            ];
        })
            // Par ordre de fiabilité décroissante (nombre de relevés), puis par nom
            ->sortBy([['readings', 'desc'], ['task', 'asc']])
            ->values()
            ->all();

        $categories = Work::where(fn($query) => $query->whereNull('site_id')->orWhereIn('site_id', $siteIds))
            ->orderBy('name')
            ->get(['id', 'name', 'unit']);

        return response()->json([
            'from' => $request->filled('from') ? Carbon::parse($request->from)->format('Y-m-d') : null,
            'to' => $request->filled('to') ? Carbon::parse($request->to)->format('Y-m-d') : null,
            'categories' => $categories,
            'rows' => $rows,
        ]);
    }

    /**
     * Heures normales / Heures sup. / Effectif pointé / Tâches achevées.
     */
    private function indicators(Collection $tasks): array
    {
        $workers = $tasks->flatMap->reportWorkTypeWorkers;

        return [
            'normal_hours' => round($workers->sum('normal_hours'), 2),
            'overtime_hours' => round($workers->sum('overtime_hours'), 2),
            // Un ouvrier affecté à plusieurs tâches n'est compté qu'une fois
            'workforce' => $workers->pluck('worker_id')->unique()->count(),
            'tasks_completed' => $tasks->filter(fn($task) => ($task->stat_work ?? 0) >= 100)->count(),
            'tasks_total' => $tasks->count(),
        ];
    }

    /**
     * Nombre d'ouvriers qualifiés / main d'oeuvre par catégorie de travaux (table "works").
     */
    private function workforceByCategory(Collection $tasks): array
    {
        return $tasks
            ->groupBy(fn($task) => optional(optional($task->workType)->work)->name ?? 'Autre')
            ->map(function (Collection $categoryTasks, $category) {
                $workers = $categoryTasks
                    ->flatMap->reportWorkTypeWorkers
                    ->filter(fn($rww) => $rww->worker)
                    ->unique('worker_id');

                return [
                    'category' => $category,
                    'qualified' => $workers->filter(fn($rww) => $this->workerGroup($rww->worker) === 'qualified')->count(),
                    'labour' => $workers->filter(fn($rww) => $this->workerGroup($rww->worker) === 'labour')->count(),
                ];
            })
            ->sortByDesc(fn($row) => $row['qualified'] + $row['labour'])
            ->values()
            ->all();
    }

    /**
     * Rendement par tâche, les plus faibles en premier.
     */
    private function tasksPerformance(Collection $tasks): array
    {
        return $tasks
            ->map(function (ReportWorkType $task) {
                $unitTime = $this->unitTime($task);
                $hours = $this->taskHours($task);
                $referenceUnitTime = optional($task->workType)->t_u !== null
                    ? (float) $task->workType->t_u
                    : null;

                return [
                    'id' => $task->id,
                    'task' => optional($task->workType)->name,
                    'block' => optional($task->siteLocation)->block,
                    'unit' => optional(optional($task->workType)->work)->unit,
                    'quantity' => $task->quantity_completed,
                    'stat_work' => $task->stat_work,
                    'unit_time' => $this->rounded($unitTime),
                    'reference_unit_time' => $referenceUnitTime,
                    // Rendement = quantité ÷ heures (unités par heure)
                    'performance' => ($hours > 0 && $task->quantity_completed > 0)
                        ? round($task->quantity_completed / $hours, 2)
                        : null,
                    // Comparaison sur la valeur exacte (et non la valeur arrondie affichée)
                    'status' => $this->taskStatus($unitTime, $referenceUnitTime),
                ];
            })
            ->sortBy(fn($row) => $row['performance'] ?? PHP_INT_MAX)
            ->values()
            ->all();
    }

    /**
     * "above" : la tâche a pris plus de temps que prévu (TU réel > TU réf.)
     * "ok"    : conforme
     * null    : pas de référence saisie (ou pas de TU réel) → aucun badge
     */
    private function taskStatus(?float $unitTime, ?float $referenceUnitTime): ?string
    {
        if ($unitTime === null || $referenceUnitTime === null) {
            return null;
        }

        return $unitTime > $referenceUnitTime ? 'above' : 'ok';
    }

    /**
     * Tâches réellement travaillées : on écarte les copies créées automatiquement
     * par le report des tâches inachevées (is_reported) sur lesquelles aucun ouvrier
     * n'a été affecté ce jour-là. Sinon leur quantité serait comptée deux fois (§ 2.6.1).
     */
    private function workedTasks(Collection $tasks): Collection
    {
        return $tasks
            ->reject(fn(ReportWorkType $task) => $task->is_reported && $task->reportWorkTypeWorkers->isEmpty())
            ->values();
    }

    /**
     * Heures d'une tâche = heures normales + heures sup. de tous ses ouvriers.
     */
    private function taskHours(ReportWorkType $task): float
    {
        return (float) $task->reportWorkTypeWorkers->sum('normal_hours')
            + (float) $task->reportWorkTypeWorkers->sum('overtime_hours');
    }

    /**
     * TU exact d'une ligne de journal = heures ÷ quantité (null si incomplet).
     */
    private function unitTime(ReportWorkType $task): ?float
    {
        $hours = $this->taskHours($task);

        return ($hours > 0 && $task->quantity_completed > 0) ? $hours / $task->quantity_completed : null;
    }

    /**
     * Nom de la tâche ; pour une tâche propre à un chantier (scope "C"), on ajoute le chantier
     * afin de la distinguer d'une tâche globale du même nom : "Maçonnerie (Villa Test)".
     */
    private function taskLabel(WorkType $workType): string
    {
        return $workType->site_id && $workType->site
            ? "{$workType->name} ({$workType->site->name})"
            : $workType->name;
    }

    private function rounded(?float $value): ?float
    {
        return $value === null ? null : round($value, 2);
    }

    /**
     * "qualified", "labour" ou null (main-d'oeuvre indirecte ou qualification inconnue).
     */
    private function workerGroup($worker): ?string
    {
        $qualification = Str::lower(Str::ascii(trim(optional(optional($worker)->resourceRel)->name ?? '')));

        if (in_array($qualification, self::LABOUR_QUALIFICATIONS, true)) {
            return 'labour';
        }

        if (in_array($qualification, self::QUALIFIED_QUALIFICATIONS, true)) {
            return 'qualified';
        }

        return null;
    }

    /**
     * "Travaux de maconnerie et enduit" → "maconnerie et enduit" (titres des mini-courbes).
     */
    private function shortCategory(?string $name): ?string
    {
        return $name ? Str::lower(preg_replace("/^travaux\s+(de\s+|d')/i", '', trim($name))) : null;
    }

    /**
     * Même périmètre que la liste des journaux (ReportController::index).
     */
    private function canViewSite(Site $site): bool
    {
        if (Gate::allows('view all reports')) {
            return true;
        }

        if (Gate::allows('view some reports')) {
            $id = auth()->id();

            return in_array($id, [
                $site->project_responsible_id,
                $site->conductor_id,
                $site->worker_id,
                $site->data_entry_id,
            ]);
        }

        return false;
    }
}
