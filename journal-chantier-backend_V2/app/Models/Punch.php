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

    /**
     * Ouvriers réellement actifs ce jour-là (CDC V3 § 3.4.1) :
     * lignes du dossier avec des heures pointées (HN + HS > 0).
     * Un ouvrier pointé à 0 heure reste dans le dossier, mais n'est pas compté dans « Nb Ouvriers ».
     */
    public function activePunchWorkers()
    {
        return $this->hasMany(PunchWorker::class)
            ->whereRaw('COALESCE(natural_hours, 0) + COALESCE(overtime_hours, 0) > 0');
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
