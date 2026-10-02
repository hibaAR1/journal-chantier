<?php

namespace Tests\Security\Permissions;

use Database\Seeders\DashboardPermissionSeeder;
use Database\Seeders\PunchDetailPermissionSeeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\JcdTestCase;

/**
 * SECURITY — Permissions ajoutées (onglets du tableau de bord, export Excel).
 */
class PermissionsAjouteesTest extends JcdTestCase
{
    public function test_les_4_permissions_d_onglet_existent_dans_le_groupe_tableau_de_bord(): void
    {
        $names = Permission::where('module_name', 'dashboard')->pluck('name')->sort()->values()->all();

        $this->assertEquals([
            'view dashboard',
            'view dashboard comparison',
            'view dashboard daily',
            'view dashboard history',
            'view dashboard prices',
        ], $names);
    }

    public function test_les_roles_qui_voyaient_le_tableau_de_bord_gardent_les_4_onglets(): void
    {
        foreach (Role::whereHas('permissions', fn($q) => $q->where('name', 'view dashboard'))->get() as $role) {
            $this->assertTrue(
                $role->hasAllPermissions(['view dashboard daily', 'view dashboard history', 'view dashboard comparison', 'view dashboard prices']),
                "Le rôle {$role->name} doit garder les 4 onglets"
            );
        }
    }

    public function test_la_permission_d_export_est_dans_le_groupe_pointages(): void
    {
        $permission = Permission::where('name', 'export punch details')->first();

        $this->assertEquals('punches', $permission->module_name);
        $this->assertEquals('Exporter le pointage détaillé (Excel)', $permission->abbreviation);
    }

    public function test_les_seeders_peuvent_etre_relances_sans_doublon(): void
    {
        $before = Permission::count();

        $this->seed([DashboardPermissionSeeder::class, PunchDetailPermissionSeeder::class]);
        $this->seed([DashboardPermissionSeeder::class, PunchDetailPermissionSeeder::class]);

        $this->assertEquals($before, Permission::count());
    }

    public function test_le_menu_et_les_onglets_suivent_les_permissions_de_l_utilisateur(): void
    {
        $user = $this->makeUser('rh-limite', [], ['view dashboard', 'view dashboard daily', 'view punches', 'view all punches']);

        $permissions = $this->api($user)->getJson('/api/user')->assertOk()->json('permissions');

        $this->assertContains('view dashboard daily', $permissions);
        $this->assertNotContains('view dashboard prices', $permissions);
        $this->assertNotContains('export punch details', $permissions);
    }
}
