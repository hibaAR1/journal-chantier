<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Site extends Model
{
    use HasFactory, SoftDeletes, ModelCounterTrait;

    protected $fillable = [
        'client_id',
        'project_responsible_id',
        'conductor_id',
        'worker_id',
        'name',
        'address',
    ];

    public function siteLocations() {
        return $this->hasMany(SiteLocation::class);
    }

    public function client() {
        return $this->belongsTo(Client::class);
    }

    public function projectResponsible() {
        return $this->belongsTo(User::class, 'project_responsible_id');
    }

    public function conductor() {
        return $this->belongsTo(User::class, 'conductor_id');
    }

    public function worker() {
        return $this->belongsTo(User::class, 'worker_id');
    }

    public function movements() {
        return $this->hasMany(Movement::class);
    }

    public function punches() {
        return $this->hasMany(Punch::class);
    }

    public function reports() {
        return $this->hasMany(Report::class);
    }

    public function workers() {
        return $this->belongsToMany(Worker::class, 'site_worker');
    }

    public static function booted(): void {
        static::creating(function(Site $site) {
            $site->code = $site->codeGenerator([
                "prefix" => "SIT",
                "model" => "Site",
                "length" => 5,
            ]);
        });
    }

}
