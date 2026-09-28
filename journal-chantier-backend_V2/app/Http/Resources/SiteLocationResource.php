<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteLocationResource extends JsonResource
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
            'site_id' => $this->site_id,
            'site_name' => $this->site->name,
            'site_code' => $this->site->code,
            'location_id' => $this->location_id,
            'location_code' => $this->location->code,
            'location_name' => $this->location->name,
            'block' => $this->block,
            'element' => $this->element,
        ];
    }
}
