<?php

namespace Tests\Feature\Utilisateurs;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\JcdTestCase;

/**
 * FEATURE — Gestion des utilisateurs, des rôles et des mots de passe (fait par l'administrateur).
 */
class UtilisateursTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    public function test_l_administrateur_peut_lister_les_utilisateurs(): void
    {
        $this->api($this->admin())->getJson('/api/users')
            ->assertOk()
            ->assertJsonFragment(['username' => 'llouktam']);
    }

    public function test_l_administrateur_peut_creer_un_utilisateur_avec_un_role(): void
    {
        $this->api($this->admin())->postJson('/api/users', [
            'name' => 'Salma RH',
            'username' => 'salma',
            'email' => 'salma@test.local',
            'job' => 'Responsable RH',
            'role' => 'human_resources_responsible',
            'is_active' => true,
        ])->assertStatus(201)->assertJsonPath('role', 'human_resources_responsible');

        $this->assertTrue(User::where('username', 'salma')->first()->hasRole('human_resources_responsible'));
    }

    public function test_le_nom_d_utilisateur_est_unique_et_le_role_doit_exister(): void
    {
        $this->api($this->admin())->postJson('/api/users', [
            'name' => 'Doublon',
            'username' => 'llouktam',
            'job' => 'Test',
            'role' => 'role-inexistant',
            'is_active' => true,
        ])->assertStatus(422)->assertJsonValidationErrors(['username', 'role']);
    }

    public function test_l_administrateur_peut_changer_le_role_d_un_utilisateur(): void
    {
        $user = $this->makeUser('karima', ['conductor']);

        $this->api($this->admin())->putJson('/api/users/' . $user->id, [
            'name' => 'Karima',
            'username' => 'karima',
            'job' => 'Conductrice',
            'role' => 'project_responsible',
            'is_active' => true,
        ])->assertOk();

        $this->assertEquals(['project_responsible'], $user->fresh()->getRoleNames()->all());
    }

    public function test_un_compte_desactive_ne_peut_plus_se_connecter(): void
    {
        $user = $this->makeUser('ancien');

        $this->api($this->admin())->postJson('/api/users/' . $user->id . '/set-is-active')->assertOk();
        $this->assertFalse((bool) $user->fresh()->is_active);

        $this->app['auth']->forgetGuards();
        $this->withHeaders(['Authorization' => ''])->postJson('/api/login', ['login' => 'ancien', 'password' => 'secret'])
            ->assertStatus(422)
            ->assertJsonFragment(['Votre compte a été désactivé.']);
    }

    public function test_la_reinitialisation_donne_un_nouveau_mot_de_passe_qui_fonctionne(): void
    {
        $user = $this->makeUser('oubli');

        $password = $this->api($this->admin())->postJson('/api/users/' . $user->id . '/reset-password')
            ->assertOk()
            ->json('password');

        $this->assertTrue(Hash::check($password, $user->fresh()->password));
        $this->assertFalse(Hash::check('secret', $user->fresh()->password));
    }

    public function test_l_administrateur_peut_creer_un_role_avec_des_permissions(): void
    {
        $this->api($this->admin())->postJson('/api/roles', [
            'name' => 'directeur_exploitation',
            'abbreviation' => "Directeur d'Exploitation",
            'permissions' => Permission::whereIn('name', ['view punches', 'export punch details'])->pluck('id')->all(),
        ])->assertStatus(201);

        $this->assertTrue(Role::findByName('directeur_exploitation', 'web')->hasPermissionTo('export punch details'));
    }

    public function test_un_role_doit_avoir_au_moins_une_permission(): void
    {
        $this->api($this->admin())->postJson('/api/roles', [
            'name' => 'vide',
            'abbreviation' => 'Vide',
            'permissions' => [],
        ])->assertStatus(422)->assertJsonValidationErrors(['permissions']);
    }

    public function test_l_utilisateur_peut_changer_son_mot_de_passe(): void
    {
        $user = $this->makeUser('mdp');

        $this->api($user)->postJson('/api/change-password', [
            'current_password' => 'secret',
            'new_password' => 'Nouveau2026!',
            'new_password_confirmation' => 'Nouveau2026!',
        ])->assertOk();

        $this->assertTrue(Hash::check('Nouveau2026!', $user->fresh()->password));
    }

    public function test_changer_de_mot_de_passe_demande_l_ancien_mot_de_passe(): void
    {
        $this->api($this->makeUser('mdp2'))->postJson('/api/change-password', [
            'current_password' => 'faux',
            'new_password' => 'Nouveau2026!',
            'new_password_confirmation' => 'Nouveau2026!',
        ])->assertStatus(401);
    }
}
