<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resource extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'name',
        'type',
    ];

    public static function booted(): void {
        static::creating(function(Resource $resource) {
            $resource->code = $resource->codeGenerator([
                "prefix" => "RSR",
                "model" => "Resource",
                "length" => 5,
            ]);
        });
    }

}
