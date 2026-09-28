<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'product_category_id',
        'name',
        'unit',
    ];

    public function productCategory() {
        return $this->belongsTo(ProductCategory::class);
    }

    public function movements() {
        return $this->hasMany(Movement::class);
    }

    public static function booted(): void {
        static::creating(function(Product $product) {
            $product->code = $product->codeGenerator([
                "prefix" => "PRD",
                "model" => "Product",
                "length" => 5,
            ]);
        });
    }

}
