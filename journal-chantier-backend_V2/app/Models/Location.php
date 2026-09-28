<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Location extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'name',
    ];

    public static function booted(): void {
        static::creating(function(Location $location) {
            $location->code = $location->codeGenerator([
                "prefix" => "LOC",
                "model" => "Location",
                "length" => 5,
            ]);
        });
    }

}
