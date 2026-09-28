<?php

namespace App\Models;

use Spatie\Permission\Guard;

class Role extends  \Spatie\Permission\Models\Role
{

    protected $fillable = [
        'name',
        'abbreviation',
        'guard_name'
    ];
}


