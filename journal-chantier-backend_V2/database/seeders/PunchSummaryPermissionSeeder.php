<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Permission "État récapitulatif" : bouton dans la page Journaux.
 *
 * L'État Récapitulatif Journalier de Pointage n'est plus dans le menu de gauche :
 * il s'ouvre depuis un bouton de la page Journaux, visible seulement avec cette permission.
 * Donnée uniquement à l'Administrateur ; pour un autre rôle, cocher la permission
 * sur son rôle dans l'écran "Permissions" (groupe Rapports).
 *
 * Peut être lancé plusieurs fois sans risque :
 *   php artisan db:seed --class=PunchSummaryPermissionSeeder
 */
class PunchSummaryPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Dans le groupe "Rapports" (= Journaux) de l'écran des permissions
        Permission::updateOrCreate(['name' => 'view punch summary'], [
            'abbreviation' => 'Voir l\'état récapitulatif journalier de pointage',
            'module_name' => 'reports',
            'module_abbreviation' => 'Rapports',
        ]);

        Role::where('name', 'admin')
            ->get()
            ->each(fn($role) => $role->givePermissionTo('view punch summary'));

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
