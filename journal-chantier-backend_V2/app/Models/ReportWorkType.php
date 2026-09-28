<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportWorkType extends Model
{
    use SoftDeletes, ModelCounterTrait;

    protected $table = 'report_work_type';

    protected $fillable = [
        'report_id',
        'work_type_id',
        'site_location_id',
        'stat_work',
        'original_stat_work',
        'quantity_completed',
        'observations',
        'is_reported',
        'original_report_date',
//        'number_qualified',
//        'number_workers',
//        'number_hours_natural_qualified',
//        'number_hours_natural_workers',
//        'number_hours_overtime_qualified',
//        'number_hours_overtime_workers',
    ];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    public function workType()
    {
        return $this->belongsTo(WorkType::class);
    }

    public function siteLocation()
    {
        return $this->belongsTo(SiteLocation::class);
    }

    public function reportWorkTypeWorkers() {
        return $this->hasMany(ReportWorkTypeWorker::class);
    }

    public static function booted(): void
    {
        static::creating(function (ReportWorkType $reportWorkType) {
            $reportWorkType->code = $reportWorkType->codeGenerator([
                "prefix" => "RWT",
                "model" => "ReportWorkType",
                "length" => 5,
            ]);
        });
    }

    public function unitTime()
    {
        $totalHours = $this->reportWorkTypeWorkers->sum('normal_hours')
            + $this->reportWorkTypeWorkers->sum('overtime_hours');

        if ($this->quantity_completed > 0 && $totalHours > 0) {
            return round($totalHours / $this->quantity_completed, 2); // en heures/unité
        }

        return null; // ou 0 si tu préfères
    }

    public function rendement()
    {
        $totalHours = $this->reportWorkTypeWorkers->sum('normal_hours')
            + $this->reportWorkTypeWorkers->sum('overtime_hours');

        if ($this->quantity_completed > 0 && $totalHours > 0) {
            return round($this->quantity_completed / $totalHours, 2); // en unités/heure
        }

        return null;
    }

    public function getDailyWorkerPerformanceAttribute()
    {
        $totalWorkers = $this->reportWorkTypeWorkers()->count();

        if ($totalWorkers > 0 && $this->quantity_completed > 0) {
            return round($this->quantity_completed / $totalWorkers, 2);
        }
        return 0;
    }

    public function qualifiedWorkersCount()
    {
        return $this->reportWorkTypeWorkers
            ->filter(fn($rww) => $rww->worker && in_array($rww->worker->contract_type, ['CDI', 'CDC']))
            ->count();
    }

    public function unqualifiedWorkersCount()
    {
        return $this->reportWorkTypeWorkers
            ->filter(fn($rww) => $rww->worker && $rww->worker->contract_type === 'TECTRA')
            ->count();
    }

    public function hoursGrouped()
    {
        // On récupère tous les travailleurs liés
        $workers = $this->reportWorkTypeWorkers;

        // Heures qualifiées (CDD/CDI)
        $qualified = $workers
            ->filter(fn($rww) => $rww->worker && in_array(strtoupper($rww->worker->contract_type), ['CDI','CDC']))
            ->reduce(function($carry, $item){
                $carry['hn'] += $item->normal_hours ?? 0;
                $carry['hs'] += $item->overtime_hours ?? 0;
                return $carry;
            }, ['hn'=>0,'hs'=>0]);

        // Heures main d'oeuvre (TECTRA)
        $main_oeuvre = $workers
            ->filter(fn($rww) => $rww->worker && strtoupper($rww->worker->contract_type) === 'TECTRA')
            ->reduce(function($carry, $item){
                $carry['hn'] += $item->normal_hours ?? 0;
                $carry['hs'] += $item->overtime_hours ?? 0;
                return $carry;
            }, ['hn'=>0,'hs'=>0]);

        return collect([
            'qualified' => [$qualified],
            'main_oeuvre' => [$main_oeuvre],
        ]);
    }
}
