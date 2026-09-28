<?php

namespace App\Exports;

use App\Models\Report;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ReportExport implements FromArray, WithStyles, WithEvents
{
    protected $report;

    public function __construct(Report $report)
    {
        $this->report = $report;
    }

    public function array(): array
    {
        $data = [];

        // En-tête global
        $data[] = ['', '', 'Date de journal', 'Titre', 'Code journal', '', ''];
        $data[] = ['', '', $this->report->date , 'Journal Chantier', $this->report->code, '', ''];
        $data[] = ['', '', '', '', '', '', '']; // ligne vide

        foreach ($this->report->groupedWorkTypes() as $workName => $workItems) {
            $work = $workItems[0]->workType->work;
            $allTasks = $work->workTypes;

            // Titre du travail
            $data[] = ["Travail : ".strtoupper($work->name ?? '')];

            // ---- ENTÊTES ----
            $data[] = [
                'Équipe',
                'Travaux Réalisés',
                'Ouvriers', '', // fusion Ouvriers
                'Bloc / Villa',
                'Emplacement',
                'Éléments',
                'État',
                'Nb Heures', '', // fusion Nb Heures
                'Quantité Réalisée',
                'Temps unitaire',
                'Observation'
            ];

            // Sous-entêtes : Ouvriers et Nb Heures
            $data[] = [
                '', '',
                'Qualifiés', 'Main d’œuvre',
                '', '', '', '',
                'Nb Heures Qualifiés', 'Nb Heures Main d’œuvre',
                '', '', ''
            ];

            // ---- LIGNES DES TÂCHES ----
            foreach ($workItems as $index => $tache) {

                // Checkbox tâches
                $taskNames = '';
                foreach ($allTasks as $task) {
                    $taskNames .= ($task->id == $tache->work_type_id ? '☑ ' : '☐ ') . ($task->name ?? '');
                }

                // Chargements heures
                $qualified = $tache->hoursGrouped()->get('qualified')[0] ?? ['hn'=>0,'hs'=>0];
                $mo = $tache->hoursGrouped()->get('main_oeuvre')[0] ?? ['hn'=>0,'hs'=>0];

                $nbHeuresQualifies = "H.N : " . ($qualified['hn'] ?? 0) . "\nH.S : " . ($qualified['hs'] ?? 0);
                $nbHeuresMO = "H.N : " . ($mo['hn'] ?? 0) . "\nH.S : " . ($mo['hs'] ?? 0);

                $data[] = [
                    $index + 1,
                    $taskNames,
                    $tache->qualifiedWorkersCount(),
                    $tache->unqualifiedWorkersCount(),
                    $tache->siteLocation->block ?? '',
                    $tache->siteLocation->location->name ?? '',
                    $tache->siteLocation->element ?? '',
                    ($tache->stat_work ?? 0) == 100 ? '☑ Achevé' : '☑ En cours',
                    $nbHeuresQualifies,
                    $nbHeuresMO,
                    $tache->quantity_completed ?? 0,
                    $tache->unitTime() ?? 0,
                    $tache->observation ?? ''
                ];
            }

            // Ligne vide pour séparation
            $data[] = array_fill(0, 13, '');
        }

        // Signature
        $data[] = ['Chef d\'équipe principal : ____________________','','Le : ...... / ...... / ........'];

        return $data;
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getDefaultRowDimension()->setRowHeight(25);
        $sheet->getDefaultColumnDimension()->setWidth(20);

        $sheet->getStyle($sheet->calculateWorksheetDimension())->applyFromArray([
            'font' => ['name' => 'Dax-Regular', 'size' => 11],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true
            ]
        ]);

        return [];
    }

    public function registerEvents(): array
    {
        return [
            \Maatwebsite\Excel\Events\AfterSheet::class => function($event) {
                $sheet = $event->sheet->getDelegate();

                foreach ($sheet->getRowIterator() as $row) {
                    $rowIndex = $row->getRowIndex();
                    $rowData = $sheet->rangeToArray("A{$rowIndex}:M{$rowIndex}", null, true, false)[0];

                    // Fusion titre travail
                    if (isset($rowData[0]) && str_starts_with($rowData[0], 'Travail')) {
                        $sheet->mergeCells("A{$rowIndex}:M{$rowIndex}");
                        $sheet->getStyle("A{$rowIndex}:M{$rowIndex}")->applyFromArray([
                            'font' => ['bold' => true, 'size' => 12],
                            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9E8DB']],
                            'alignment' => ['horizontal' => 'left', 'vertical' => 'center']
                        ]);
                    }

                    // Fusion colonnes Ouvriers
                    if (isset($rowData[2]) && $rowData[2] === 'Ouvriers') {
                        $sheet->mergeCells("C{$rowIndex}:D{$rowIndex}");
                    }

                    // Fusion colonnes Nb Heures
                    if (isset($rowData[8]) && $rowData[8] === 'Nb Heures') {
                        $sheet->mergeCells("I{$rowIndex}:J{$rowIndex}");
                    }

                    // Bordures
                    $sheet->getStyle("A{$rowIndex}:M{$rowIndex}")
                        ->getBorders()->getAllBorders()
                        ->setBorderStyle(Border::BORDER_THIN);
                }
            }
        ];
    }
}
