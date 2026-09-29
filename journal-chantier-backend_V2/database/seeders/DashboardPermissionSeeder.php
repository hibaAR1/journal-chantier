<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Permissions par onglet du tableau de bord (Journalier, Historique, Multi-chantiers, Base de prix).
 *
 * Peut être lancé plusieurs fois sans risque (base existante ou nouvelle base) :
 *   php artisan db:seed --class=DashboardPermissionSeeder
 *
 * Les rôles qui voient déjà le tableau de bord ("view dashboard") reçoivent les 4 onglets,
 * pour que personne ne perde l'accès. On décoche ensuite ce qu'il faut dans "Permissions".
 */
class DashboardPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $tabs = [
            'view dashboard daily' => 'Voir l\'onglet Journalier',
            'view dashboard history' => 'Voir l\'onglet Historique',
            'view dashboard comparison' => 'Voir l\'onglet Multi-chantiers',
            'view dashboard prices' => 'Voir l\'onglet Base de prix',
        ];

        foreach ($tabs as $name => $abbreviation) {
            // Même groupe "Tableau de bord" que "Voir le tableau de bord" dans l'écran des permissions
            Permission::updateOrCreate(['name' => $name], [
                'abbreviation' => $abbreviation,
                'module_name' => 'dashboard',
                'module_abbreviation' => 'Tableau de bord',
            ]);
        }

        Role::whereHas('permissions', fn($query) => $query->where('name', 'view dashboard'))
            ->get()
            ->each(fn($role) => $role->givePermissionTo(array_keys($tabs)));

        // Vide le cache des permissions de Spatie
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
