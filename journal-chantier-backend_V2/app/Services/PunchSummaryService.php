<?php

namespace App\Services;

use App\Models\Punch;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Str;

/**
 * État Récapitulatif Journalier de Pointage (cahier des charges V3 — § 3.1).
 *
 * Calcule, pour une date, une ligne par chantier pointé + une ligne TOTAL :
 *   HN, HS, HT = HN + HS, Taux HS/HT = HS / HT x 100,
 *   MOD, MOI, Effectif = MOD + MOI, Taux MOI = MOI / Effectif x 100,
 *   détail par métier (nombre de personnes présentes).
 *
 * Le calcul est fait à chaque demande à partir des pointages :
 * une modification de pointage est donc visible immédiatement (§ 3.1.6).
 * Utilisé par l'écran de la plateforme, le PDF et l'e-mail automatique.
 */
class PunchSummaryService
{
    /**
     * Corps de métier couverts (§ 3.1.4), dans l'ordre des colonnes du tableau.
     * La clé est comparée au nom de la ressource (qualification) de l'ouvrier,
     * sans accents, sans majuscules ni apostrophes.
     */
    public const MOD = [
        'ouvrier travaux' => 'Ouvrier travaux',
        'boiseur' => 'Boiseur',
        'macon' => 'Maçon',
        'ferrailleur' => 'Ferrailleur',
        'poseur' => 'Poseur',
        'traceur' => 'Traceur',
        'platrier' => 'Plâtrier',
        'grutier' => 'Grutier',
    ];

    public const MOI = [
        'chef chantier' => 'Chef chantier',
        'chef dequipe travaux' => "Chef d'équipe travaux",
        'magasinier' => 'Magasinier',
        'chef ferrailleur' => 'Chef ferrailleur',
        'caporal' => 'Caporal',
        'conducteur bobcat' => 'Conducteur BOBCAT',
        'conducteur manitou' => 'Conducteur MANITOU',
        'conducteur jcb' => 'Conducteur JCB',
        'chauffeur chargeuse' => 'Chauffeur chargeuse',
    ];

    // Types de pointage "présent" : 1 Service normal, 2 Travail à la tâche, 3 Travail à la tâche multiple
    // (4 Licencié, 5 Absent autorisé, 6 Absent non autorisé, 7 Malade ne sont pas comptés)
    public const PRESENT_TYPES = [1, 2, 3];

    /**
     * @param string     $date    date au format Y-m-d
     * @param array|null $siteIds chantiers autorisés pour l'utilisateur (null = tous)
     * @param int|null   $siteId  un chantier précis (null = tous les chantiers)
     */
    public function build(string $date, ?array $siteIds = null, ?int $siteId = null): array
    {
        $punches = Punch::with(['site', 'punchWorkers.worker.resourceRel'])
            ->whereDate('date', $date)
            ->when($siteIds !== null, fn($query) => $query->whereIn('site_id', $siteIds))
            ->when($siteId, fn($query) => $query->where('site_id', $siteId))
            ->get()
            ->filter(fn($punch) => $punch->site)
            ->sortBy(fn($punch) => Str::lower($punch->site->name))
            ->values();

        $rows = $punches->map(fn($punch) => $this->row($punch))->values()->all();

        return [
            'date' => Carbon::parse($date)->format('Y-m-d'),
            'trades' => [
                'mod' => array_values(self::MOD),
                'moi' => array_values(self::MOI),
            ],
            'rows' => $rows,
            'total' => $this->total($rows),
        ];
    }

    /**
     * Une ligne du tableau : un chantier pointé ce jour-là.
     */
        /**
     * Export PDF de l'état récapitulatif (pièce jointe de l'e-mail — § 3.1.5).
     * Tous les chantiers, format A3 paysage (29 colonnes : ne tient pas en A4).
     *
     *   app(PunchSummaryService::class)->pdf('2026-09-28')->save(storage_path('app/etat.pdf'));
     */
    public function pdf(string $date)
    {
        return Pdf::loadView('punch-summary.template', [
            'summary' => $this->build($date),
            'generatedAt' => now()->format('d/m/Y H:i'),
        ])->setPaper('A3', 'landscape');
    }
    private function row(Punch $punch): array
    {
        $present = $punch->punchWorkers
            ->filter(fn($punchWorker) => in_array((int) $punchWorker->type, self::PRESENT_TYPES) && $punchWorker->worker);

        $normalHours = $present->sum(fn($punchWorker) => (float) $punchWorker->natural_hours);
        $overtimeHours = $present->sum(fn($punchWorker) => (float) $punchWorker->overtime_hours);

        // Nombre de personnes présentes par métier
        $mod = array_fill_keys(array_values(self::MOD), 0);
        $moi = array_fill_keys(array_values(self::MOI), 0);
        $siteManagers = [];

        foreach ($present as $punchWorker) {
            $key = $this->normalize(optional($punchWorker->worker->resourceRel)->name);

            if (isset(self::MOD[$key])) {
                $mod[self::MOD[$key]]++;
            } elseif (isset(self::MOI[$key])) {
                $moi[self::MOI[$key]]++;

                // Chef de chantier = l'ouvrier pointé ce jour-là avec la qualification "Chef chantier"
                if ($key === 'chef chantier') {
                    $siteManagers[] = $punchWorker->worker->name;
                }
            }
        }

        return $this->withRates([
            'site_id' => $punch->site->id,
            'site' => $punch->site->name,
            'date' => Carbon::parse($punch->date)->format('Y-m-d'),
            'site_manager' => $siteManagers ? implode(', ', $siteManagers) : null,
            'normal_hours' => $normalHours,
            'overtime_hours' => $overtimeHours,
            'mod' => array_sum($mod),
            'moi' => array_sum($moi),
            'mod_detail' => $mod,
            'moi_detail' => $moi,
        ]);
    }

    /**
     * Ligne TOTAL : somme de toutes les lignes, taux recalculés sur les totaux.
     */
    private function total(array $rows): array
    {
        $sumDetail = function (string $field, array $trades) use ($rows) {
            $detail = array_fill_keys(array_values($trades), 0);
            foreach ($rows as $row) {
                foreach ($row[$field] as $trade => $count) {
                    $detail[$trade] += $count;
                }
            }
            return $detail;
        };

        return $this->withRates([
            'normal_hours' => array_sum(array_column($rows, 'normal_hours')),
            'overtime_hours' => array_sum(array_column($rows, 'overtime_hours')),
            'mod' => array_sum(array_column($rows, 'mod')),
            'moi' => array_sum(array_column($rows, 'moi')),
            'mod_detail' => $sumDetail('mod_detail', self::MOD),
            'moi_detail' => $sumDetail('moi_detail', self::MOI),
        ]);
    }

    /**
     * Règles de calcul (§ 3.1.3) : HT, Taux HS/HT, Effectif, Taux MOI.
     */
    private function withRates(array $line): array
    {
        $totalHours = $line['normal_hours'] + $line['overtime_hours'];
        $workforce = $line['mod'] + $line['moi'];

        return array_merge($line, [
            'total_hours' => $totalHours,
            'overtime_rate' => $totalHours > 0 ? round($line['overtime_hours'] / $totalHours * 100, 2) : 0,
            'workforce' => $workforce,
            'moi_rate' => $workforce > 0 ? round($line['moi'] / $workforce * 100, 2) : 0,
        ]);
    }

    /**
     * "Chef d'équipe Travaux" → "chef dequipe travaux" (sans accents, majuscules, apostrophes ni doubles espaces).
     */
    private function normalize(?string $name): string
    {
        $name = Str::lower(Str::ascii((string) $name));
        $name = str_replace(["'", '’', '-'], ['', '', ' '], $name);

        return trim(preg_replace('/\s+/', ' ', $name));
    }
}
