<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'registered_name',
        'code_system',
    ];

    public function sites() {
        return $this->hasMany(Site::class);
    }

    public static function booted(): void {
        static::creating(function(Client $client) {
            $client->code = $client->codeGenerator([
                "prefix" => "CLT",
                "model" => "Client",
                "length" => 5,
            ]);
        });
    }

}
