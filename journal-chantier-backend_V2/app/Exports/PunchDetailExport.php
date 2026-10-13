<?php

namespace App\Exports;

use App\Models\PunchWorker;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Export Pointage Détaillé — Format Excel (cahier des charges V3 — § 3.2, présentation demandée par le superviseur).
 *
 * Colonnes : MATRICULE | NOM | FONCTION | CHANTIER | HN | HS | DATE
 * Règles :
 *  - un bloc par agent et par chantier ; l'agent (matricule, nom, fonction, chantier) est écrit
 *    seulement sur la 1re ligne du bloc ;
 *  - puis une ligne par jour de la période choisie (tous les jours, sans en sauter) ;
 *  - 0 = agent non pointé ce jour-là sur ce chantier ;
 *  - feuille nommée "Pointage_JJ-MMM_au_JJ-MMM" (ou "Pointage_JJ-MMM" pour un seul jour), en-têtes en couleur.
 *
 * WithStrictNullComparison : les 0 sont bien écrits "0" (sinon la cellule resterait vide).
 */
class PunchDetailExport implements FromArray, WithHeadings, WithTitle, WithStyles, ShouldAutoSize, WithStrictNullComparison
{
    /** @var string[] jours de la période, au format Y-m-d */
    private array $days;

    /** @var int[] numéros des lignes Excel où commence un agent (mises en gras) */
    private array $firstLines = [];

    /**
     * @param string     $from    date début (Y-m-d)
     * @param string     $to      date fin (Y-m-d)
     * @param array|null $siteIds chantiers choisis (null = tous)
     */
    public function __construct(private string $from, private string $to, private ?array $siteIds = null)
    {
        $this->days = collect(CarbonPeriod::create($from, $to))
            ->map(fn($day) => $day->format('Y-m-d'))
            ->all();
    }

    public function title(): string
    {
        // "Pointage_01-sept_au_30-sept", ou "Pointage_28-sept" pour un seul jour
        // (31 caractères max pour un nom de feuille Excel)
        $title = $this->from === $this->to
            ? 'Pointage_' . $this->dayLabel($this->from)
            : 'Pointage_' . $this->dayLabel($this->from) . '_au_' . $this->dayLabel($this->to);

        return mb_substr($title, 0, 31);
    }

    public function headings(): array
    {
        return ['MATRICULE', 'NOM', 'FONCTION', 'CHANTIER', 'HN', 'HS', 'DATE'];
    }

    public function array(): array
    {
        $punchWorkers = PunchWorker::with(['punch.site', 'worker.resourceRel'])
            ->whereHas('punch', function ($query) {
                $query->whereDate('date', '>=', $this->from)
                    ->whereDate('date', '<=', $this->to)
                    ->when($this->siteIds, fn($q) => $q->whereIn('site_id', $this->siteIds));
            })
            ->get()
            ->filter(fn($punchWorker) => $punchWorker->worker && $punchWorker->punch && $punchWorker->punch->site);

        // Un bloc = un agent sur un chantier ; trié par matricule puis par chantier
        $blocks = $punchWorkers
            ->groupBy(fn($punchWorker) => $punchWorker->worker_id . '-' . $punchWorker->punch->site_id)
            ->sortBy(fn($rows) => mb_strtolower($rows->first()->worker->registration_number . ' ' . $rows->first()->punch->site->name));

        $rows = [];
        $this->firstLines = [];
        $line = 2; // la ligne 1 contient les en-têtes

        foreach ($blocks as $blockRows) {
            $first = $blockRows->first();

            // Heures par jour (0 = non pointé ce jour-là sur ce chantier)
            $byDay = $blockRows->groupBy(fn($punchWorker) => Carbon::parse($punchWorker->punch->date)->format('Y-m-d'));

            foreach ($this->days as $index => $day) {
                $isFirst = $index === 0;

                // L'agent est écrit seulement sur la 1re ligne de son bloc
                $identity = $isFirst
                    ? [
                        $first->worker->registration_number,
                        $first->worker->name,
                        optional($first->worker->resourceRel)->name,
                        $first->punch->site->name,
                    ]
                    : ['', '', '', ''];

                $rows[] = array_merge($identity, [
                    (float) $byDay->get($day, collect())->sum('natural_hours'),
                    (float) $byDay->get($day, collect())->sum('overtime_hours'),
                    Carbon::parse($day)->format('d/m/Y'),
                ]);

                if ($isFirst) {
                    $this->firstLines[] = $line;
                }

                $line++;
            }
        }

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $lastRow = max($sheet->getHighestRow(), 1);

        // En-têtes en couleur (orange TCGM, texte blanc en gras)
        $sheet->getStyle('A1:G1')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'C94D25']],
        ]);

        // Bordures et centrage de tout le tableau
        $sheet->getStyle("A1:G{$lastRow}")->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'BFBFBF']]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);

        // Première ligne de chaque agent en gras (matricule, nom, fonction, chantier)
        foreach ($this->firstLines as $line) {
            $sheet->getStyle("A{$line}:D{$line}")->getFont()->setBold(true);
        }

        // En-têtes toujours visibles quand on descend dans le fichier
        $sheet->freezePane('A2');

        return [];
    }

    /**
     * "2026-09-19" → "19-sept" (JJ-MMM en français), pour le nom de la feuille
     */
    private function dayLabel(string $day): string
    {
        return rtrim(Carbon::parse($day)->locale('fr')->isoFormat('DD-MMM'), '.');
    }
}
