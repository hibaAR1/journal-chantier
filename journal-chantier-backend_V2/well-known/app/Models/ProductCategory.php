<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductCategory extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'name',
    ];

    public function products() {
        return $this->hasMany(Product::class);
    }

    public static function booted(): void {
        static::creating(function(ProductCategory $productCategory) {
            $productCategory->code = $productCategory->codeGenerator([
                "prefix" => "PCT",
                "model" => "ProductCategory",
                "length" => 5,
            ]);
        });
    }

}
