<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportWorkTypeWorkerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'report_work_type_id' => $this->report_work_type_id,
            'worker_id' => $this->worker_id,
            'worker_name' => $this->worker->name,
            'worker_code' => $this->worker->code,
            'worker_registration_number' => $this->worker->registration_number,
            'normal_hours' => $this->normal_hours,
            'overtime_hours' => $this->overtime_hours,
            'report_validated' => is_object($this->reportWorkType?->report) ? $this->reportWorkType->report->validated : null,

        ];
    }
}
