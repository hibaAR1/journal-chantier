<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PunchWorkerResource extends JsonResource
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
            'worker_id' => $this->worker_id,
            'worker_name' => $this->worker->name,
            'resource_name' => $this->worker?->resourceRel?->name,
            'punch_id' => $this->punch_id,
            'punch_code' => $this->punch->code,
            'type' => $this->type,
            'natural_hours' => $this->natural_hours,
            'overtime_hours' => $this->overtime_hours,
            'punch_validated' => $this->punch->validated,
        ];
    }
}
