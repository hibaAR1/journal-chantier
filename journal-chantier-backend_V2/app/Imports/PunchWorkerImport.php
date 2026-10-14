<?php

namespace App\Imports;

use App\Models\Punch;
use App\Models\PunchWorker;
use App\Models\Worker;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\WithValidation;

class PunchWorkerImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        $punch = $this->getPunchByCode($row['dossier_pointage']);
        $workerId = $this->getWorkerIdByRegistrationNumber($row['matricule']);
        $type = $row['type_service'];
        $natural_hours = $row['heures_normales'];
        $overtime_hours = $row['heures_supplementaires'];

        if ($punch) {
            $punchWorker = PunchWorker::where('punch_id', $punch->id)
                ->where('worker_id', $workerId)
                ->first();
        }

        if ($punchWorker) {
            return null; // or handle the error as needed
        }

        return new PunchWorker([
            'punch_id' => $punch->id,
            'worker_id' => $workerId,
            'type' => $type,
            'natural_hours' => $natural_hours,
            'overtime_hours' => $overtime_hours ? $overtime_hours : 0,
        ]);
    }

    public function rules(): array
    {
        return [
            'dossier_pointage' => 'required|string|exists:punches,code',
            // Situation Actuelle (CDC § 3.3) : un ouvrier INACTIF ne peut plus être pointé
            'matricule' => ['required', 'string', Rule::exists('workers', 'registration_number')->where('is_active', true)],
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'matricule.exists' => "Matricule introuvable ou ouvrier INACTIF : il ne peut plus être pointé.",
        ];
    }

    private function getPunchByCode($code)
    {
        $punch = Punch::where('code', $code)->first();
        return $punch ?? null;
    }

    private function getWorkerIdByRegistrationNumber($registrationNumber)
    {
        $worker = Worker::where('registration_number', $registrationNumber)->first();
        return $worker ? $worker->id : null;
    }
}
