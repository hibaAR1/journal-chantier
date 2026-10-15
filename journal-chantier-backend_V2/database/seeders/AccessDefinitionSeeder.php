<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Définition des accès (cahier des charges V3 — § 3.5).
 *
 * § 3.5.1 Pointage
 *   - Service RH               : consultation + modification, ensemble des chantiers
 *   - Directeur d'Exploitation : consultation seule, ensemble des chantiers (rôle Manager : déjà en place)
 *   - Magasinier               : consultation seule, ses chantiers uniquement (voir MAGASINIER ci-dessous)
 *
 * § 3.5.2 Ouvriers & Ressources
 *   - Service RH               : consultation + modification
 *   - Directeur d'Exploitation : consultation seule (déjà en place)
 *
 * Peut être lancé plusieurs fois sans risque :
 *   php artisan db:seed --class=AccessDefinitionSeeder
 */
class AccessDefinitionSeeder extends Seeder
{
    /**
     * Service RH : Pointage (tous les chantiers) + Ouvriers + Ressources, en consultation et modification.
     */
    public const RH_PERMISSIONS = [
        // Pointage — ensemble des chantiers
        'view punches',
        'view all punches',
        'store punches',
        'update punches',
        'delete punches',
        'export punches',
        'import punches',
        'validate punches',
        'invalidate punches',
        // Ouvriers
        'view workers',
        'store workers',
        'update workers',
        'delete workers',
        'export workers',
        'import workers',
        // Ressources
        'view resources',
        'store resources',
        'update resources',
        'delete resources',
    ];

    /**
     * Magasinier (rôle « worker », champ « Magasinier » du chantier) :
     * le CDC prévoit la consultation seule du pointage de ses chantiers.
     * Mettre à true UNIQUEMENT après accord de l'encadrant : le magasinier ne pourra plus saisir le pointage.
     */
    public const MAGASINIER_CONSULTATION_SEULE = false;

    public const MAGASINIER_PERMISSIONS_RETIREES = [
        'store punches',
        'update punches',
        'delete punches',
        'import punches',
        'validate punches',
    ];

    public function run(): void
    {
        Role::where('name', 'human_resources_responsible')
            ->first()
            ?->givePermissionTo(self::RH_PERMISSIONS);

        if (self::MAGASINIER_CONSULTATION_SEULE) {
            $magasinier = Role::where('name', 'worker')->first();

            if ($magasinier) {
                $magasinier->givePermissionTo(['view punches', 'view some punches']);

                foreach (self::MAGASINIER_PERMISSIONS_RETIREES as $permission) {
                    $magasinier->revokePermissionTo($permission);
                }
            }
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
