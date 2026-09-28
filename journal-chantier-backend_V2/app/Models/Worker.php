<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use PhpParser\Builder\Function_;

class Worker extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'resource_id',
        'site_id',
        'name',
        'registration_number',
        'contract_type',
    ];

    public function resourceRel()
    {
        return $this->belongsTo(Resource::class, 'resource_id', 'id');
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function punches()
    {
        return $this->hasMany(Punch::class);
    }

    public function punchWorkers()
    {
        return $this->hasMany(PunchWorker::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public static function booted(): void
    {
        static::creating(function (Worker $worker) {
            $worker->code = $worker->codeGenerator([
                "prefix" => "OUV",
                "model" => "Worker",
                "length" => 5,
            ]);
        });
    }
}
