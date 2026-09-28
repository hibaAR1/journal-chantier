<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PunchResource extends JsonResource
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
            'site_name' => $this->site->name,
            'date' => $this->date,
            'code' => $this->code,
            'validated' => $this->validated,
            'punch_workers_count' => $this->punch_workers_count ?? 0,
        ];
    }
}
