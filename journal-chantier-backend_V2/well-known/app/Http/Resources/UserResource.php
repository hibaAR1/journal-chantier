<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $role = '';
        $permissions = [];

        if ($this->roles->isNotEmpty()) {
            $role = $this->roles->first()->name; // Katjib role dyal user
            $permissions = $this->getPermissionsViaRoles()->pluck('name'); // Katjib list dyal permissions
        }

        return [
            "id" => $this->id,
            "name" => $this->name,
            "job" => $this->job,
            "email" => $this->email,
            "username" => $this->username,
            "registration_number" => $this->registration_number,
            "phone" => $this->phone,
            "profile" => $this->profile(),
            "is_active" => $this->is_active,
            "role" => $role,
            "permissions" => $permissions,
        ];
    }
}
