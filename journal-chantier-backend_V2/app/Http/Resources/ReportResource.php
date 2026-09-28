<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $date = Carbon::parse($this->date)->format('Y-m-d');

        return [
            'id' => $this->id,
            'code' => $this->code,
            'site_id' => $this->site_id,
            'site_code' => $this->site->code,
            'site_name' => $this->site->name,
            'site_locations' => SiteLocationResource::collection($this->site->siteLocations),
            'date' => $date,
            'problems' => $this->problems,
            'delays' => $this->delays,
            'security' => $this->security,
            'validated' => $this->validated,
        ];
    }
}
