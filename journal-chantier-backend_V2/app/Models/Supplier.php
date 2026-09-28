<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'registered_name',
        'code_system',
    ];

    public function movements() {
        return $this->hasMany(Movement::class);
    }

    public static function booted(): void {
        static::creating(function(Supplier $supplier) {
            $supplier->code = $supplier->codeGenerator([
                "prefix" => "FRS",
                "model" => "Supplier",
                "length" => 5,
            ]);
        });
    }

}
