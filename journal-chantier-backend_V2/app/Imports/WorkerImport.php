<?php

namespace App\Imports;

use App\Models\Resource;
use App\Models\Worker;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

/**
 * Import des ouvriers (Canvas ou fichier « Tous les ouvriers »).
 *
 *  - Matricule NOUVEAU   : l'ouvrier est créé (situation ACTIF par défaut).
 *  - Matricule EXISTANT  : rien n'est écrasé, SAUF la « situation_actuelle »
 *                          (mise à jour en masse, CDC § 3.3.3).
 *  - « situation_actuelle » : ACTIF ou INACTIF (vide = ne change rien / ACTIF pour un nouveau).
 *    Seuls les profils RH (permission "manage worker status") peuvent la modifier ;
 *    pour les autres, la colonne est ignorée.
 */
class WorkerImport implements ToModel, WithHeadingRow, WithValidation
{
    public int $created = 0;
    public int $updated = 0;

    private bool $canManageStatus;

    public function __construct()
    {
        $this->canManageStatus = Gate::allows('manage worker status');
    }

    public function model(array $row)
    {
        $situation = $this->situation($row);

        $existing = Worker::where('registration_number', $row['matricule'])->first();

        if ($existing) {
            // Mise à jour en masse : seulement la situation, et seulement par un profil RH
            if ($this->canManageStatus && $situation !== null && $existing->is_active !== ($situation === 'ACTIF')) {
                $existing->update(['is_active' => $situation === 'ACTIF']);
                $this->updated++;
            }

            return null;
        }

        $this->created++;

        return new Worker([
            'registration_number' => $row['matricule'],
            'name' => $row['nom_complet'],
            'contract_type' => $row['type_contrat'],
            'resource_id' => $this->getResourceIdByCode($row['code_fonction']),
            'is_active' => $this->canManageStatus && $situation === 'INACTIF' ? false : true,
        ]);
    }

    /**
     * ACTIF / INACTIF accepté en minuscules ou avec des espaces (« actif », « Inactif ») ; vide = null.
     */
    public function prepareForValidation($data, $index)
    {
        if (isset($data['situation_actuelle'])) {
            $data['situation_actuelle'] = mb_strtoupper(trim((string) $data['situation_actuelle'])) ?: null;
        }

        return $data;
    }

    public function rules(): array
    {
        return [
            'matricule' => 'required',
            'nom_complet' => ['required', 'string', 'max:150'],
            'type_contrat' => ['required', 'string', 'max:150', 'in:CDC,TECTRA,ANAPEC,CDI'],
            'code_fonction' => 'required|exists:resources,code',
            'situation_actuelle' => ['nullable', 'in:ACTIF,INACTIF'],
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'situation_actuelle.in' => 'La situation actuelle doit être ACTIF ou INACTIF.',
            'type_contrat.in' => 'Le type de contrat doit être CDC, TECTRA, ANAPEC ou CDI.',
            'code_fonction.exists' => 'Code fonction inconnu.',
        ];
    }

    private function situation(array $row): ?string
    {
        $value = mb_strtoupper(trim((string) ($row['situation_actuelle'] ?? '')));

        return in_array($value, ['ACTIF', 'INACTIF'], true) ? $value : null;
    }

    private function getResourceIdByCode($code)
    {
        $resource = Resource::where('code', $code)->first();
        return $resource ? $resource->id : null;
    }
}
