<?php

namespace App\Exports;

use App\Models\Worker;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Export « Tous les ouvriers » = modèle de mise à jour en masse (CDC § 3.3.3).
 *
 * Colonnes : Matricule | Nom | Qualification | Type de contrat | Situation Actuelle | Code
 * Le RH corrige ce fichier (nom, qualification, contrat, ACTIF / INACTIF…) puis le réimporte :
 * les ouvriers sont retrouvés par leur Matricule et mis à jour, sans doublon.
 * La colonne Code est là pour information (ignorée à l'import).
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
                    'nom' => $worker->name,
                    'qualification' => $worker->resourceRel?->name,
                    'type_de_contrat' => $worker->contract_type,
                    'situation_actuelle' => $worker->is_active ? 'ACTIF' : 'INACTIF',
                    'code' => $worker->code,
                ];
            });
    }

    /**
     * Excel headers.
     */
    public function headings(): array
    {
        return ['Matricule', 'Nom', 'Qualification', 'Type de contrat', 'Situation Actuelle', 'Code'];
    }

    public function styles(Worksheet $sheet)
    {
        // Listes déroulantes : Type de contrat (D) et Situation Actuelle (E)
        $lastRow = max($sheet->getHighestRow(), 2) + 500;

        WorkerExport::dropdown($sheet, 'D', $lastRow, 'CDC,TECTRA,ANAPEC,CDI', 'Type de contrat', 'Choisissez CDC, TECTRA, ANAPEC ou CDI dans la liste.');
        WorkerExport::dropdown($sheet, 'E', $lastRow, 'ACTIF,INACTIF', 'Situation Actuelle', 'Choisissez ACTIF ou INACTIF dans la liste.');

        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
