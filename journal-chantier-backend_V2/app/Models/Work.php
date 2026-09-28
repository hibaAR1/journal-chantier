<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Work extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'name',
        'unit',
        'site_id',
    ];

    public function workTypes()
    {
        return $this->hasMany(WorkType::class);
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public static function booted(): void
    {
        static::creating(function (Work $work) {
            $work->code = $work->codeGenerator([
                "prefix" => "TRV",
                "model" => "Work",
                "length" => 5,
            ]);
        });
    }
}
