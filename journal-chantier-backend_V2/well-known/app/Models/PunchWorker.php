<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PunchWorker extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'punch_worker';

    protected $fillable = [
        'punch_id',
        'worker_id',
        'type',
        'natural_hours',
        'overtime_hours',
    ];

    public function worker() {
        return $this->belongsTo(Worker::class);
    }

    public function punch() {
        return $this->belongsTo(Punch::class);
    }

}
