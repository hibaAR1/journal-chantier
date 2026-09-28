<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportWorkTypeWorker extends Model
{
    use ModelCounterTrait, SoftDeletes;

    protected $table = 'report_work_type_worker';

    protected $fillable = [
        'report_work_type_id',
        'worker_id',
        'normal_hours',
        'overtime_hours',
    ];

    public function reportWorkType()
    {
        return $this->belongsTo(ReportWorkType::class);
    }

    public function worker()
    {
        return $this->belongsTo(Worker::class);
    }

    public function punchWorkers()
    {
        return $this->belongsTo(PunchWorker::class, 'worker_id', 'worker_id');
    }

    public static function booted(): void
    {
        static::creating(function (ReportWorkTypeWorker $reportWorkTypeWorker) {
            $reportWorkTypeWorker->code = $reportWorkTypeWorker->codeGenerator([
                "prefix" => "RWW",
                "model" => "ReportWorkTypeWorker",
                "length" => 5,
            ]);
        });
    }
}
