<?php

namespace Tests\Security\Authentification;

use Illuminate\Support\Facades\Route;
use Tests\JcdTestCase;

/**
 * SECURITY — Connexion / déconnexion, et TOUTES les adresses de l'API protégées par la connexion.
 */
class ConnexionEtRoutesTest extends JcdTestCase
{
    public function test_toutes_les_adresses_de_l_api_demandent_une_connexion(): void
    {
        $checked = 0;

        foreach (Route::getRoutes() as $route) {
            $uri = $route->uri();

            // Seule la page de connexion est publique
            if (!str_starts_with($uri, 'api/') || $uri === 'api/login') {
                continue;
            }

            // Remplace {id}, {site_id}… par 1
            $url = '/' . preg_replace('/\{[^}]+\}/', '1', $uri);

            foreach (array_diff($route->methods(), ['HEAD']) as $method) {
                $this->json($method, $url)->assertStatus(401);
                $checked++;
            }
        }

        // Plus de 90 adresses vérifiées
        $this->assertGreaterThan(90, $checked);
    }

    public function test_connexion_avec_le_bon_mot_de_passe(): void
    {
        $this->makeUser('ahmed');

        $this->postJson('/api/login', ['login' => 'ahmed', 'password' => 'secret'])
            ->assertOk()
            ->assertJsonStructure(['user', 'token']);
    }

    public function test_connexion_possible_avec_l_email(): void
    {
        $this->makeUser('ahmed');

        $this->postJson('/api/login', ['login' => 'ahmed@test.local', 'password' => 'secret'])->assertOk();
    }

    public function test_un_mauvais_mot_de_passe_est_refuse(): void
    {
        $this->makeUser('ahmed');

        $this->postJson('/api/login', ['login' => 'ahmed', 'password' => 'mauvais'])
            ->assertStatus(422)
            ->assertJsonMissingPath('token');
    }

    public function test_un_utilisateur_inconnu_est_refuse(): void
    {
        $this->postJson('/api/login', ['login' => 'inconnu', 'password' => 'secret'])->assertStatus(422);
    }

    public function test_apres_deconnexion_le_jeton_ne_marche_plus(): void
    {
        $this->makeUser('ahmed');
        $token = $this->postJson('/api/login', ['login' => 'ahmed', 'password' => 'secret'])->json('token');

        $this->withHeaders(['Authorization' => 'Bearer ' . $token])->postJson('/api/logout')->assertOk();

        $this->app['auth']->forgetGuards();
        $this->withHeaders(['Authorization' => 'Bearer ' . $token])->getJson('/api/user')->assertStatus(401);
    }

    public function test_le_mot_de_passe_n_est_jamais_renvoye_par_l_api(): void
    {
        $user = $this->makeUser('ahmed', ['admin']);

        $this->api($user)->getJson('/api/users')->assertOk()->assertJsonMissingPath('0.password');
        $this->assertStringNotContainsString('"password"', $this->api($user)->getJson('/api/user')->getContent());
    }
}
