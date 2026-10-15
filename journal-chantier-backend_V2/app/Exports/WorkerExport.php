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
                // Colonnes du modèle (CDC § 3.3.3)
                'Matricule',
                'Nom',
                'Qualification',
                'Type de contrat',
                'Situation Actuelle',
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

        // Listes déroulantes (lignes 2 à 1000) : Type de contrat (D) et Situation Actuelle (E)
        self::dropdown($worksheet, 'D', 1000, 'CDC,TECTRA,ANAPEC,CDI', 'Type de contrat', 'Choisissez CDC, TECTRA, ANAPEC ou CDI dans la liste.');
        self::dropdown($worksheet, 'E', 1000, 'ACTIF,INACTIF', 'Situation Actuelle', 'Choisissez ACTIF ou INACTIF dans la liste.');

        foreach (['A' => 15, 'B' => 30, 'C' => 25, 'D' => 18, 'E' => 20] as $column => $width) {
            $worksheet->getColumnDimension($column)->setWidth($width);
        }
    }

    /**
     * Liste déroulante Excel sur une colonne (de la ligne 2 à $lastRow).
     */
    public static function dropdown(Worksheet $worksheet, string $column, int $lastRow, string $values, string $title, string $error): void
    {
        $validation = $worksheet->getCell($column . '2')->getDataValidation();
        $validation->setType(DataValidation::TYPE_LIST)
            ->setErrorStyle(DataValidation::STYLE_STOP)
            ->setAllowBlank(true)
            ->setShowDropDown(true)
            ->setShowErrorMessage(true)
            ->setErrorTitle($title)
            ->setError($error)
            ->setFormula1('"' . $values . '"')
            ->setSqref($column . '2:' . $column . $lastRow);
    }
}
