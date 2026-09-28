<?php

namespace App\Exports;

use App\Models\Worker;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PunchWorkerExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $siteId;
    protected $punchCode;

    protected $data;

    public function __construct($siteId, $punchCode, $data) {
        $this->siteId = $siteId;
        $this->punchCode = $punchCode;
        $this->data = $data;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return new Collection($this->data);
    }

    public function headings(): array
    {
        return [
            'dossier_pointage',
            'matricule',
            'nom_complet',
            'type_service',
            'heures_normales',
            'heures_supplementaires',
        ];
    }

    public function map($row): array {

        return [
            $this->punchCode,
            $row['registration_number'],
            $row['name'],
            1,
            9,
            0,
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

        $worksheet->getStyle('A1:F1')->applyFromArray($headerStyleArray);

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

        $count = count($this->data);

        $worksheet->getStyle('A2:F'. $count + 1)->applyFromArray($contentStyleArray);
    }
}
