<?php

namespace App\Imports;

use App\Models\Resource;
use App\Models\Worker;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class WorkerImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        // Skip if registration number already exists
        if (Worker::where('registration_number', $row['matricule'])->exists()) {
            return null;
        }

        return new Worker([
            'registration_number' => $row['matricule'],
            'name' => $row['nom_complet'],
            'contract_type' => $row['type_contrat'],
            'resource_id' => $this->getResourceIdByCode($row['code_fonction']),
        ]);
    }

    public function rules(): array
    {
        return [
            'matricule' => 'required|string',
            'nom_complet' => ['required', 'string', 'max:150'],
            'type_contrat' => ['required', 'string', 'max:150', 'in:CDC,TECTRA,CDI'],
            'code_fonction' => 'required|exists:resources,code',
        ];
    }

    private function getResourceIdByCode($code)
    {
        $resource = Resource::where('code', $code)->first();
        return $resource ? $resource->id : null;
    }
}
