<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkType extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'work_id',
        'name',
        't_u',
        'scope',
        'site_id',
    ];

    protected $casts = [
        't_u' => 'float',
    ];

    public function work()
    {
        return $this->belongsTo(Work::class);
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }


    public static function booted(): void
    {
        static::creating(function (WorkType $workType) {
            $workType->code = $workType->codeGenerator([
                "prefix" => "TYP",
                "model" => "WorkType",
                "length" => 5,
            ]);

            if (empty($workType->scope)) {
                $workType->scope = 'G';
            }
        });
    }
}
