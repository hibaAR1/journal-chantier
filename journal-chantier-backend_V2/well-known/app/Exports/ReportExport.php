<?php

namespace App\Exports;

use App\Models\Report;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ReportExport implements FromArray, WithHeadings, WithStyles, WithEvents
{
    protected $report;

    public function __construct(Report $report)
    {
        $this->report = $report;
    }

    public function array(): array
    {
        $data = [];

        // --- En-tête global : 1ère ligne = titres ---
        $data[] = ['', '', 'Date téléchargement', 'Titre', 'Code journal', '', ''];
        // --- 2ème ligne = valeurs ---
        $data[] = ['', '', now()->format('d/m/Y'), 'Journal Chantier', $this->report->code, '', ''];
        $data[] = ['', '', '', '', '', '', '']; // ligne vide

        foreach ($this->report->reportWorkTypes as $tache) {
            // Ligne titre tâche (7 colonnes fusionnées)
            $data[] = ["Tâche : {$tache->workType->name} - {$tache->siteLocation->name}", '', '', '', '', '', ''];

            // --- En-tête ouvriers (7 colonnes, avec regroupement) ---
            $data[] = [
                'Ouvrier', '',          // prend 2 colonnes
                'Matricule', '',        // prend 2 colonnes
                'Heures normales',      // 1 colonne
                'Heures supplémentaires'// 1 colonne
            ];

            // --- Liste des ouvriers (alignée sur 7 colonnes) ---
            foreach ($tache->reportWorkTypeWorkers as $worker) {
                $data[] = [
                    $worker->worker->name, '',
                    $worker->worker->registration_number, '',
                    $worker->normal_hours,
                    $worker->overtime_hours,
                    '' // reste vide pour garder 7 colonnes
                ];
            }

            // --- En-tête pied de tableau (7 colonnes) ---
            $data[] = [
                'État du travail',
                'Quantité réalisée',
                'Temps unitaire',
                'Rendement',
                'Nombre ouvriers',
                'Total H normales',
                'Total H supp'
            ];

            // --- Valeurs pied (7 colonnes) ---
            $data[] = [
                $tache->stat_work,
                $tache->quantity_completed,
                $tache->unitTime() ?? '--',
                $tache->rendement() ?? '--',
                $tache->reportWorkTypeWorkers->count(),
                $tache->reportWorkTypeWorkers->sum('normal_hours'),
                $tache->reportWorkTypeWorkers->sum('overtime_hours'),
            ];

            // Ligne vide
            $data[] = ['', '', '', '', '', '', ''];
        }

        return $data;
    }

    public function headings(): array
    {
        return []; // pas de heading global
    }

    public function styles(Worksheet $sheet)
    {
        // Style global
        $sheet->getDefaultRowDimension()->setRowHeight(18);
        $sheet->getDefaultColumnDimension()->setWidth(20);

        $sheet->getStyle($sheet->calculateWorksheetDimension())->applyFromArray([
            'font' => [
                'name' => 'Dax-Regular',
                'size' => 11,
                'color' => ['rgb' => '000000']
            ]
        ]);

        return [];
    }

    public function registerEvents(): array
    {
        return [
            \Maatwebsite\Excel\Events\AfterSheet::class => function (\Maatwebsite\Excel\Events\AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                foreach ($sheet->getRowIterator() as $row) {
                    $rowIndex = $row->getRowIndex();
                    $rowData = $sheet->rangeToArray("A{$rowIndex}:G{$rowIndex}", null, true, false)[0];

                    // --- Style titres en-tête global (1ère ligne) ---
                    if ($rowIndex == 1) {
                        $sheet->getStyle("C{$rowIndex}:E{$rowIndex}")->applyFromArray([
                            'font' => ['bold' => true, 'name' => 'Dax-Regular', 'size' => 11, 'color' => ['rgb' => '000000']],
                            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9E8DB']],
                            'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '999999']]]
                        ]);
                    }

                    // --- Style valeurs en-tête global (2ème ligne) ---
                    if ($rowIndex == 2) {
                        $sheet->getStyle("A{$rowIndex}:C{$rowIndex}")->applyFromArray([
                            'font' => ['bold' => false, 'name' => 'Dax-Regular', 'size' => 11],
                            'alignment' => ['horizontal' => 'left', 'vertical' => 'center'],
                            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '999999']]]
                        ]);
                    }

                    // --- Style titre tâche ---
                    if (isset($rowData[0]) && str_starts_with($rowData[0], 'Tâche')) {
                        $sheet->mergeCells("A{$rowIndex}:G{$rowIndex}");
                        $sheet->getStyle("A{$rowIndex}:G{$rowIndex}")->applyFromArray([
                            'font' => ['bold' => true, 'size' => 11, 'name' => 'Dax-Regular'],
                            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9E8DB']],
                            'alignment' => ['horizontal' => 'left', 'vertical' => 'center'],
                        ]);
                    }

                    // --- Style en-tête ouvriers ---
                    if (isset($rowData[0]) && $rowData[0] === 'Ouvrier') {
                        $sheet->mergeCells("A{$rowIndex}:B{$rowIndex}");
                        $sheet->mergeCells("C{$rowIndex}:D{$rowIndex}");
                        $sheet->getStyle("A{$rowIndex}:G{$rowIndex}")->applyFromArray([
                            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'name' => 'Dax-Regular'],
                            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E8AE89']],
                            'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '999999']]]
                        ]);
                    }

                    // --- Style en-tête pied tableau ---
                    if (isset($rowData[0]) && $rowData[0] === 'État du travail') {
                        $sheet->getStyle("A{$rowIndex}:G{$rowIndex}")->applyFromArray([
                            'font' => ['bold' => true, 'name' => 'Dax-Regular'],
                            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E0E0E0']],
                            'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '999999']]]
                        ]);
                    }
                }
            }
        ];
    }
}
