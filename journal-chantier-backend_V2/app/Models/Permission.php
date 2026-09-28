<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    protected $fillable = [
        'name',
        'abbreviation',
        'guard_name',
        'module_name',
        'module_abbreviation',
    ];
}
