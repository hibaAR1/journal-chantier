<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class WorkerExport implements FromCollection, WithHeadings, WithStyles
{
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
            [
                'matricule',
                'nom_complet',
                'type_contrat',
                'code_fonction',
                // Situation Actuelle (CDC § 3.3) : liste déroulante ACTIF / INACTIF
                'situation_actuelle',
            ],
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

        $worksheet->getStyle('A1:E1')->applyFromArray($headerStyleArray);

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

        $worksheet->getStyle('A2:E2')->applyFromArray($contentStyleArray);

        // Colonne E « situation_actuelle » : liste déroulante ACTIF / INACTIF (lignes 2 à 1000)
        $validation = $worksheet->getCell('E2')->getDataValidation();
        $validation->setType(DataValidation::TYPE_LIST)
            ->setErrorStyle(DataValidation::STYLE_STOP)
            ->setAllowBlank(true)
            ->setShowDropDown(true)
            ->setShowErrorMessage(true)
            ->setErrorTitle('Situation actuelle')
            ->setError('Choisissez ACTIF ou INACTIF dans la liste.')
            ->setFormula1('"ACTIF,INACTIF"')
            ->setSqref('E2:E1000');

        $worksheet->getColumnDimension('E')->setWidth(20);
    }
}
