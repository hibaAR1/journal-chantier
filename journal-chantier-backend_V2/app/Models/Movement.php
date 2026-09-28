<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Movement extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'site_id',
        'product_id',
        'supplier_id',
        'date',
        'type',
        'quantity',
        'coefficient',
        'delivery_num',
        'receipt_num',
        'exit_num',
        'transfer_num',
        'observation',
    ];

    public function site() {
        return $this->belongsTo(Site::class);
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function supplier() {
        return $this->belongsTo(Supplier::class);
    }

    public static function booted(): void {
        static::creating(function(Movement $movement) {
            $movement->code = $movement->codeGenerator([
                "prefix" => "MVT",
                "model" => "Movement",
                "length" => 5,
            ]);
        });
    }

}
