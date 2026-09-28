<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkerResource extends JsonResource
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
            'site_id' => $this->site_id,
            'resource_id' => $this->resource_id,
            'resource_name' => $this->resourceRel->name,
            'name' => $this->name,
            'registration_number' => $this->registration_number,
            'contract_type' => $this->contract_type,
            'code' => $this->code,
        ];
    }
}
