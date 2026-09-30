<?php

namespace App\Exports;

use App\Models\PunchWorker;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithPreCalculateFormulas;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Export Pointage Détaillé — Format Excel (cahier des charges V3 — § 3.2).
 *
 * Colonnes : CHANTIER | MATRICULE | NOM | FONCTION | HEURES | une colonne par jour (JJ-MMM) | TOTAL
 * Règles :
 *  - chaque agent génère 2 lignes par chantier (HN puis HS) ;
 *  - s'il change de chantier, il a un bloc de 2 lignes par chantier ;
 *  - 0 = agent non pointé ce jour-là sur ce chantier ;
 *  - TOTAL = formule Excel (somme des jours de la ligne) ;
 *  - feuille nommée "Pointage_JJ-MMM_au_JJ-MMM" (ou "Pointage_JJ-MMM" pour un seul jour), en-têtes en couleur.
 *
 * WithStrictNullComparison : les 0 sont bien écrits "0" (sinon la cellule resterait vide).
 * WithPreCalculateFormulas : le TOTAL est déjà calculé à l'ouverture du fichier.
 */
class PunchDetailExport implements FromArray, WithHeadings, WithTitle, WithStyles, ShouldAutoSize,
    WithStrictNullComparison, WithPreCalculateFormulas
{
    /** @var string[] jours de la période, au format Y-m-d */
    private array $days;

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
        return array_merge(
            ['CHANTIER', 'MATRICULE', 'NOM', 'FONCTION', 'HEURES'],
            array_map(fn($day) => $this->dayLabel($day), $this->days),
            ['TOTAL']
        );
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

        // Un bloc = un agent sur un chantier ; trié par nom d'agent puis par chantier
        $blocks = $punchWorkers
            ->groupBy(fn($punchWorker) => $punchWorker->worker_id . '-' . $punchWorker->punch->site_id)
            ->sortBy(fn($rows) => mb_strtolower($rows->first()->worker->name . ' ' . $rows->first()->punch->site->name));

        $rows = [];
        $line = 2; // la ligne 1 contient les en-têtes

        foreach ($blocks as $blockRows) {
            $first = $blockRows->first();

            // Heures par jour (0 = non pointé ce jour-là sur ce chantier)
            $byDay = $blockRows->groupBy(fn($punchWorker) => Carbon::parse($punchWorker->punch->date)->format('Y-m-d'));

            foreach (['HN' => 'natural_hours', 'HS' => 'overtime_hours'] as $type => $field) {
                $hours = array_map(
                    fn($day) => (float) $byDay->get($day, collect())->sum($field),
                    $this->days
                );

                $rows[] = array_merge(
                    [
                        $first->punch->site->name,
                        $first->worker->registration_number,
                        $first->worker->name,
                        optional($first->worker->resourceRel)->name,
                        $type,
                    ],
                    $hours,
                    [$this->totalFormula($line)]
                );

                $line++;
            }
        }

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $lastColumn = Coordinate::stringFromColumnIndex(5 + count($this->days) + 1);
        $lastRow = max($sheet->getHighestRow(), 1);

        // En-têtes en couleur (orange TCGM, texte blanc en gras)
        $sheet->getStyle("A1:{$lastColumn}1")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'C94D25']],
        ]);

        // Bordures et centrage de tout le tableau
        $sheet->getStyle("A1:{$lastColumn}{$lastRow}")->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'BFBFBF']]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);

        // Colonne TOTAL en gras
        $sheet->getStyle("{$lastColumn}1:{$lastColumn}{$lastRow}")->getFont()->setBold(true);

        // En-têtes toujours visibles quand on descend dans le fichier
        $sheet->freezePane('A2');

        return [];
    }

    /**
     * TOTAL de la ligne = formule Excel : se met à jour si on corrige un chiffre dans Excel.
     */
    private function totalFormula(int $line): string
    {
        $firstDay = Coordinate::stringFromColumnIndex(6);
        $lastDay = Coordinate::stringFromColumnIndex(5 + count($this->days));

        return "=SUM({$firstDay}{$line}:{$lastDay}{$line})";
    }

    /**
     * "2026-09-19" → "19-sept" (JJ-MMM en français)
     */
    private function dayLabel(string $day): string
    {
        return rtrim(Carbon::parse($day)->locale('fr')->isoFormat('DD-MMM'), '.');
    }
}
