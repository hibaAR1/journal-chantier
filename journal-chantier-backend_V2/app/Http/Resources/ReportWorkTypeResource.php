<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportWorkTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $date = Carbon::parse($this->report->date)->format('Y-m-d');

        // Count workers
        $totalWorkers = $this->reportWorkTypeWorkers->count();

        // Get sum of hours worked
        $totalNormalHours = $this->reportWorkTypeWorkers->sum('normal_hours');
        $totalOvertimeHours = $this->reportWorkTypeWorkers->sum('overtime_hours');
        $hoursWorked = $totalNormalHours + $totalOvertimeHours;

        // calc hours worked / quantity completed but check if quantity completed is not 0
        $unitTime = $this->quantity_completed != 0 ? $hoursWorked / $this->quantity_completed : 0;

        // calc the performance 1 / unit time but check if unit time is not 0
        $performance = $unitTime != 0 ? 1 / $unitTime : 0;

        return [
            'id' => $this->id,
            'code' => $this->code,
            'report_id' => $this->report_id,
            'site_id' => $this->report->site_id,
            'site_name' => $this->report->site->name,
            'site_code' => $this->report->site->code,
            'report_validated' => $this->report->validated,
            'site_location_id' => $this->site_location_id,
            'site_location_block' => $this->siteLocation->block,
            'site_location_element' => $this->siteLocation->element,
            'site_location_name' => $this->siteLocation->location->name,
            'date' => $date,
            'work_type_id' => $this->work_type_id,
            'work_type_code' => $this->workType->code,
            'work_type_name' => $this->workType->name,
            'work_id' => $this->workType->work_id,
            'work_code' => $this->workType->work->code,
            'work_name' => $this->workType->work->name,
            'unit' => $this->workType->work->unit,
            'stat_work' => $this->stat_work,
            'original_stat_work' => $this->original_stat_work !== null
                ? $this->original_stat_work
                : $this->stat_work,
            'quantity_completed' => $this->quantity_completed,
            'total_workers' => $totalWorkers,
            'total_normal_hours' => $totalNormalHours,
            'total_overtime_hours' => $totalOvertimeHours,
            'hours_worked' => $hoursWorked,
            'unit_time' => $unitTime,
            't_u' => $this->workType?->t_u,
            'performance' => $performance,
            'daily_worker_performance' => $this->daily_worker_performance,
            'is_reported' => $this->is_reported,
            'is_reinstated' => $this->is_reinstated,
            'original_report_date' => $this->original_report_date,
            'observations' => $this->observations,

        ];
    }
}
