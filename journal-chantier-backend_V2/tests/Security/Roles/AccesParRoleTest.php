<?php

namespace Tests\Security\Roles;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\JcdTestCase;

/**
 * SECURITY — Accès par rôle.
 * Chaque rôle reçoit seulement les permissions de son métier.
 * L'application affiche ou cache les boutons (Ajouter, Modifier, Supprimer, Valider…) selon ces permissions.
 */
class AccesParRoleTest extends JcdTestCase
{
    private function role(string $name): Role
    {
        return Role::findByName($name, 'web');
    }

    private const WRITE = ['store', 'update', 'delete', 'validate', 'invalidate', 'toggle', 'reset password', 'import'];

    public function test_l_administrateur_a_toutes_les_permissions_de_l_application(): void
    {
        $admin = $this->role('admin');

        foreach (['store users', 'update users', 'toggle users', 'reset password users', 'store roles',
                  'store punches', 'validate punches', 'invalidate punches',
                  'store reports', 'validate reports', 'invalidate reports', 'store sites', 'delete sites'] as $permission) {
            $this->assertTrue($admin->hasPermissionTo($permission), "admin : $permission");
        }
    }

    public function test_seul_l_administrateur_gere_les_utilisateurs_et_les_roles(): void
    {
        $permissions = ['view users', 'store users', 'update users', 'delete users', 'toggle users',
                        'reset password users', 'view roles', 'store roles', 'update roles', 'view permissions'];

        foreach (Role::where('name', '!=', 'admin')->whereIn('name', $this->seededRoles())->get() as $role) {
            foreach ($permissions as $permission) {
                $this->assertFalse($role->hasPermissionTo($permission), "{$role->name} ne doit pas avoir : $permission");
            }
        }
    }

    public function test_le_role_ouvrier_saisit_et_valide_les_pointages(): void
    {
        $ouvrier = $this->role('worker');

        $this->assertTrue($ouvrier->hasAllPermissions(['view punches', 'store punches', 'update punches', 'delete punches', 'validate punches', 'import punches']));
        // Dévalider un pointage est réservé à l'administrateur
        $this->assertFalse($ouvrier->hasPermissionTo('invalidate punches'));
    }

    public function test_conducteur_et_agent_de_saisie_consultent_les_pointages_sans_les_modifier(): void
    {
        foreach (['conductor', 'data_entry'] as $name) {
            $role = $this->role($name);

            $this->assertTrue($role->hasPermissionTo('view punches'), "$name : voir");
            $this->assertFalse($role->hasPermissionTo('store punches'), "$name : ajouter");
            $this->assertFalse($role->hasPermissionTo('update punches'), "$name : modifier");
            $this->assertFalse($role->hasPermissionTo('validate punches'), "$name : valider");
        }
    }

    public function test_le_conducteur_redige_et_valide_les_journaux(): void
    {
        $this->assertTrue($this->role('conductor')->hasAllPermissions(['store reports', 'update reports', 'delete reports', 'validate reports']));
        $this->assertFalse($this->role('conductor')->hasPermissionTo('invalidate reports'));
    }

    public function test_l_agent_de_saisie_cree_les_journaux_sans_les_valider_ni_les_supprimer(): void
    {
        $agent = $this->role('data_entry');

        $this->assertTrue($agent->hasPermissionTo('store reports'));
        $this->assertFalse($agent->hasPermissionTo('validate reports'));
        $this->assertFalse($agent->hasPermissionTo('delete reports'));
    }

    public function test_le_manager_consulte_tout_sans_rien_modifier(): void
    {
        $manager = $this->role('manager');

        $this->assertTrue($manager->hasAllPermissions(['view all sites', 'view all punches', 'view all reports', 'view all assignments']));

        foreach ($manager->permissions->pluck('name') as $permission) {
            foreach (self::WRITE as $word) {
                $this->assertFalse(str_starts_with($permission, $word . ' '), "manager ne doit pas avoir : $permission");
            }
        }
    }

    public function test_chaque_responsable_gere_seulement_son_domaine(): void
    {
        // Responsable chiffrage : les travaux et le T.U de référence
        $this->assertTrue($this->role('estimating_responsible')->hasAllPermissions(['store works', 'update work types']));
        $this->assertFalse($this->role('estimating_responsible')->hasPermissionTo('store workers'));

        // Responsable RH : les ouvriers
        $this->assertTrue($this->role('human_resources_responsible')->hasAllPermissions(['store workers', 'import workers', 'export workers']));
        $this->assertFalse($this->role('human_resources_responsible')->hasPermissionTo('update work types'));

        // Responsable stock : articles et fournisseurs
        $this->assertTrue($this->role('stock_responsible')->hasAllPermissions(['store products', 'store suppliers']));
        $this->assertFalse($this->role('stock_responsible')->hasPermissionTo('store sites'));
    }

    public function test_les_roles_de_chantier_voient_seulement_leurs_chantiers(): void
    {
        foreach (['project_responsible', 'conductor', 'data_entry', 'worker'] as $name) {
            $role = $this->role($name);

            $this->assertTrue($role->hasPermissionTo('view some sites'), "$name : ses chantiers");
            $this->assertFalse($role->hasPermissionTo('view all sites'), "$name : tous les chantiers");
            $this->assertFalse($role->hasPermissionTo('view all punches'), "$name : tous les pointages");
        }
    }

    public function test_toutes_les_permissions_donnees_aux_roles_existent(): void
    {
        $existing = Permission::pluck('name')->all();

        foreach (Role::whereIn('name', $this->seededRoles())->get() as $role) {
            foreach ($role->permissions->pluck('name') as $permission) {
                $this->assertContains($permission, $existing);
            }
        }
    }

    private function seededRoles(): array
    {
        return ['admin', 'manager', 'project_responsible', 'estimating_responsible', 'human_resources_responsible',
                'stock_responsible', 'conductor', 'data_entry', 'worker'];
    }
}
