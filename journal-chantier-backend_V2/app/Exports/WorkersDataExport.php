<?php

namespace App\Exports;

use App\Models\Worker;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class WorkersDataExport implements FromCollection, WithHeadings
{
    /**
     * Export all workers.
     */
    public function collection()
    {
        return Worker::with('resourceRel')
            ->get()
            ->map(function ($worker) {
                return [
                    'code' => $worker->code,
                    'name' => $worker->name,
                    'registration_number' => $worker->registration_number,
                    'contract_type' => $worker->contract_type,
                    'resource_code' => $worker->resourceRel?->code,
                    'resource_name' => $worker->resourceRel?->name,
                ];
            });
    }

    /**
     * Excel headers.
     */
    public function headings(): array
    {
        return [
            'code',
            'name',
            'registration_number',
            'contract_type',
            'resource_code',
            'resource_name',
        ];
    }
}
