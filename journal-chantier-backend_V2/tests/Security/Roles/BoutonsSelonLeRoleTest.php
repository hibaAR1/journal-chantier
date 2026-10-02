<?php

namespace Tests\Security\Roles;

use Tests\JcdTestCase;

/**
 * SECURITY — Après la connexion, l'API envoie à l'application la liste des permissions de l'utilisateur.
 * L'application s'en sert pour afficher ou cacher les menus et les boutons.
 */
class BoutonsSelonLeRoleTest extends JcdTestCase
{
    private function permissionsOf(string $role): array
    {
        return $this->api($this->makeUser('u-' . $role, [$role]))->getJson('/api/user')->assertOk()->json('permissions');
    }

    public function test_le_role_ouvrier_voit_les_boutons_du_pointage_mais_pas_la_gestion_des_comptes(): void
    {
        $permissions = $this->permissionsOf('worker');

        $this->assertContains('store punches', $permissions);    // bouton "Ajouter"
        $this->assertContains('validate punches', $permissions); // bouton "Valider"
        $this->assertNotContains('store users', $permissions);   // pas de bouton "Ajouter un utilisateur"
        $this->assertNotContains('view users', $permissions);    // pas de menu "Utilisateurs"
    }

    public function test_le_conducteur_voit_les_pointages_sans_boutons_de_modification(): void
    {
        $permissions = $this->permissionsOf('conductor');

        $this->assertContains('view punches', $permissions);
        $this->assertNotContains('store punches', $permissions);
        $this->assertNotContains('update punches', $permissions);
        $this->assertNotContains('delete punches', $permissions);
    }

    public function test_le_manager_n_a_aucun_bouton_d_ajout(): void
    {
        $permissions = $this->permissionsOf('manager');

        $this->assertEmpty(array_filter($permissions, fn($p) => str_starts_with($p, 'store ')));
    }

    public function test_l_administrateur_voit_la_gestion_des_comptes(): void
    {
        $permissions = $this->permissionsOf('admin');

        foreach (['view users', 'store users', 'toggle users', 'reset password users', 'store roles'] as $permission) {
            $this->assertContains($permission, $permissions);
        }
    }
}
