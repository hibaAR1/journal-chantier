<?php

namespace App\Imports;

use App\Models\Assignment;
use App\Models\AssignmentWorker;
use App\Models\Worker;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class AssignmentWorkerImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        $assignmentId = $this->getAssignmentIdByCode($row['dossier_affectation']);
        $workerId = $this->getWorkerIdByRegistrationNumber($row['matricule']);

        $assignmentWorker = AssignmentWorker::where('assignment_id', $assignmentId)
            ->where('worker_id', $workerId)
            ->first();

        if ($assignmentWorker) {
            return null; // or handle the error as needed
        }

        return new AssignmentWorker([
            'assignment_id' => $assignmentId,
            'worker_id' => $workerId,
        ]);
    }

    public function rules(): array
    {
        return [
            'dossier_affectation' => 'required|string|exists:assignments,code',
            'matricule' => 'required|string|exists:workers,registration_number',
        ];
    }

    private function getAssignmentIdByCode($code)
    {
        $assignment = Assignment::where('code', $code)->first();
        return $assignment ? $assignment->id : null;
    }

    private function getWorkerIdByRegistrationNumber($registrationNumber)
    {
        $worker = Worker::where('registration_number', $registrationNumber)->first();
        return $worker ? $worker->id : null;
    }
}
