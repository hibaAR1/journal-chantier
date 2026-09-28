<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int)$this->id,
            'client_id' => (int)$this->client_id,
            'client_code' => $this->client->code,
            'client_registered_name' => $this->client->registered_name,
            'project_responsible_id' => (int)$this->project_responsible_id,
            'project_responsible_registration_number' => $this->projectResponsible->registration_number,
            'project_responsible_name' => $this->projectResponsible->name,
            'conductor_id' => (int)$this->conductor_id,
            'conductor_registration_number' => $this->conductor->registration_number,
            'conductor_name' => $this->conductor->name,
            'worker_id' => (int)$this->worker_id,
            'worker_registration_number' => $this->worker->registration_number,
            'worker_name' => $this->worker->name,
            'name' => $this->name,
            'address' => $this->address,
            'code' => $this->code,
        ];
    }
}
