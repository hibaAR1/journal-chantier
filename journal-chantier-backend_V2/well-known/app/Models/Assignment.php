<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assignment extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'site_id',
        'code',
    ];

    public function site() {
        return $this->belongsTo(Site::class);
    }

    public static function booted(): void {
        static::creating(function(Assignment $assignment) {
            $assignment->code = $assignment->codeGenerator([
                "prefix" => "ASG",
                "model" => "Assignment",
                "length" => 5,
            ]);
        });
    }
}
