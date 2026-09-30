<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Database\Seeder;

/**
 * Permission "Exporter le pointage détaillé" (cahier des charges V3 — § 3.2.3 :
 * accès réservé au Service RH et au Directeur d'Exploitation).
 *
 * Peut être lancé plusieurs fois sans risque :
 *   php artisan db:seed --class=PunchDetailPermissionSeeder
 *
 * Donnée aux rôles Administrateur et Responsable RH ; pour le Directeur d'Exploitation,
 * cocher la permission sur son rôle dans l'écran "Permissions".
 */
class PunchDetailPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Dans le groupe "Pointages" de l'écran des permissions
        Permission::updateOrCreate(['name' => 'export punch details'], [
            'abbreviation' => 'Exporter le pointage détaillé (Excel)',
            'module_name' => 'punches',
            'module_abbreviation' => 'Pointages',
        ]);

        Role::whereIn('name', ['admin', 'human_resources_responsible'])
            ->get()
            ->each(fn($role) => $role->givePermissionTo('export punch details'));

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
