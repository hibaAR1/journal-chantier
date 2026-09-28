<?php

namespace App\Models;

use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SiteLocation extends Model
{
    use SoftDeletes, ModelCounterTrait;

    protected $table = 'site_location';

    protected $fillable = [
        'site_id',
        'location_id',
        'block',
        'element',
    ];

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public static function booted(): void
    {
        static::creating(function (SiteLocation $siteLocation) {
            $siteLocation->code = $siteLocation->codeGenerator([
                "prefix" => "SLO",
                "model" => "SiteLocation",
                "length" => 5,
            ]);
        });
    }
}
