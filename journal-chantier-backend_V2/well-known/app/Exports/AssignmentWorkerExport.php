<?php

namespace App\Exports;

use App\Models\Worker;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class AssignmentWorkerExport implements FromCollection, WithHeadings, WithStyles
{
    protected $assignmentCode;

    public function __construct($assignmentCode) {
        $this->assignmentCode = $assignmentCode;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return collect();
    }

    public function headings(): array
    {
        return [
            ['dossier_affectation', 'matricule'],
            [$this->assignmentCode, ''],
        ];
    }

    public function styles(Worksheet $worksheet)
    {
        $headerStyleArray = [
            'font' => [
                'name' => 'Dax-Regular',
                'size' => 11,
                'color' => ['argb' => 'ffffffff'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'color' => ['argb' => 'ffd76a3e'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FFFFFFFF'],
                ],
            ],
        ];

        $worksheet->getStyle('A1:B1')->applyFromArray($headerStyleArray);

        $contentStyleArray = [
            'font' => [
                'name' => 'Dax-Regular',
                'size' => 11,
                'color' => ['argb' => 'ff000000'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'color' => ['argb' => 'FFFFFFFF'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'ff000000'],
                ],
            ],
        ];

        $worksheet->getStyle('A2:B2')->applyFromArray($contentStyleArray);
    }
}
