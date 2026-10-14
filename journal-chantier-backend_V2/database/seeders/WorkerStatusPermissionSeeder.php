<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Permission "Situation Actuelle" des ouvriers (cahier des charges V3 — § 3.3).
 *
 * Réservée aux profils RH (Administrateur et Responsable RH) :
 *  - voir la liste complète des ouvriers, y compris les INACTIF ;
 *  - passer un ouvrier en ACTIF / INACTIF (icône crayon).
 *
 * Peut être lancé plusieurs fois sans risque :
 *   php artisan db:seed --class=WorkerStatusPermissionSeeder
 */
class WorkerStatusPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Dans le groupe "Ouvriers" de l'écran des permissions
        Permission::updateOrCreate(['name' => 'manage worker status'], [
            'abbreviation' => 'Gérer la situation actuelle des ouvriers (ACTIF / INACTIF)',
            'module_name' => 'workers',
            'module_abbreviation' => 'Ouvriers',
        ]);

        Role::whereIn('name', ['admin', 'human_resources_responsible'])
            ->get()
            ->each(fn($role) => $role->givePermissionTo('manage worker status'));

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
