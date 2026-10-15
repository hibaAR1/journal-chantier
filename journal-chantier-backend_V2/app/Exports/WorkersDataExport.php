<?php

namespace App\Exports;

use App\Models\Worker;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Export « Tous les ouvriers ».
 *
 * Les 5 premières colonnes ont les MÊMES noms que le fichier d'import (Canvas) :
 * le RH peut télécharger ce fichier, changer la « situation_actuelle » (liste déroulante
 * ACTIF / INACTIF) et le réimporter → mise à jour en masse par matricule (CDC § 3.3.3).
 * Les colonnes code et fonction sont là pour information (ignorées à l'import).
 */
class WorkersDataExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize
{
    /**
     * Export all workers.
     */
    public function collection()
    {
        return Worker::with('resourceRel')
            ->orderBy('registration_number')
            ->get()
            ->map(function ($worker) {
                return [
                    'matricule' => $worker->registration_number,
                    'nom_complet' => $worker->name,
                    'type_contrat' => $worker->contract_type,
                    'code_fonction' => $worker->resourceRel?->code,
                    'situation_actuelle' => $worker->is_active ? 'ACTIF' : 'INACTIF',
                    'code' => $worker->code,
                    'fonction' => $worker->resourceRel?->name,
                ];
            });
    }

    /**
     * Excel headers.
     */
    public function headings(): array
    {
        return [
            'matricule',
            'nom_complet',
            'type_contrat',
            'code_fonction',
            'situation_actuelle',
            'code',
            'fonction',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Colonne E « situation_actuelle » : liste déroulante ACTIF / INACTIF
        $lastRow = max($sheet->getHighestRow(), 2) + 500;

        $validation = $sheet->getCell('E2')->getDataValidation();
        $validation->setType(DataValidation::TYPE_LIST)
            ->setErrorStyle(DataValidation::STYLE_STOP)
            ->setAllowBlank(true)
            ->setShowDropDown(true)
            ->setShowErrorMessage(true)
            ->setErrorTitle('Situation actuelle')
            ->setError('Choisissez ACTIF ou INACTIF dans la liste.')
            ->setFormula1('"ACTIF,INACTIF"')
            ->setSqref('E2:E' . $lastRow);

        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
