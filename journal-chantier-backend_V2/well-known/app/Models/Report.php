<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    public bool $skipObserver = false;


    protected $fillable = [
        'site_id',
        'date',
        'problems',
        'delays',
        'security',
        'validated',
    ];

    public function site() {
        return $this->belongsTo(Site::class);
    }

    public function reportWorkTypes() {
        return $this->hasMany(ReportWorkType::class);
    }

    public function reportWorkTypeWorkers()
    {
        return $this->hasManyThrough(
            \App\Models\ReportWorkTypeWorker::class,
            \App\Models\ReportWorkType::class,
            'report_id',                 // Foreign key on ReportWorkType
            'report_work_type_id',    // Foreign key on ReportWorkTypeWorker
            'id',                      // Local key on Report
            'id'                 // Local key on ReportWorkType
        );
    }

    public static function booted(): void {
        static::creating(function(Report $report) {
            $report->code = $report->codeGenerator([
                "prefix" => "RPT",
                "model" => "Report",
                "length" => 5,
            ]);
        });
    }

    public function previousDayReportedTasks()
    {
        return $this->hasMany(ReportWorkType::class)
            ->where('is_reported', true);
    }



}
