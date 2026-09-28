<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Punch extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    public bool $skipObserver = false;


    protected $fillable = [
        'site_id',
        'date',
        'validated',
    ];

    protected $casts = [
        'validated' => 'boolean',
    ];

    public function site() {
        return $this->belongsTo(Site::class);
    }

    public function punchWorkers()
    {
        return $this->hasMany(PunchWorker::class);
    }


    public static function booted(): void {
        static::creating(function(Punch $punch) {
            $punch->code = $punch->codeGenerator([
                "prefix" => "POI",
                "model" => "Punch",
                "length" => 5,
            ]);
        });
    }

}
