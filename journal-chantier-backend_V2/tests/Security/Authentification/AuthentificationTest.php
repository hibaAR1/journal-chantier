<?php

namespace Tests\Security\Authentification;

use Carbon\Carbon;
use Tests\JcdTestCase;

/**
 * SECURITY — Authentification : aucune donnée sans connexion valide.
 */
class AuthentificationTest extends JcdTestCase
{
    /** Toutes les adresses ajoutées pour le cahier des charges V3. */
    private function endpoints(): array
    {
        return [
            '/api/dashboard/daily?site_id=1',
            '/api/dashboard/history?site_id=1',
            '/api/dashboard/comparison',
            '/api/dashboard/prices',
            '/api/punch-summary?date=2026-09-28',
            '/api/punch-details/export?from=2026-09-26&to=2026-09-28',
        ];
    }

    public function test_sans_connexion_toutes_les_adresses_repondent_401(): void
    {
        foreach ($this->endpoints() as $url) {
            $this->getJson($url)->assertStatus(401);
        }
    }

    public function test_un_faux_jeton_est_refuse_401(): void
    {
        foreach ($this->endpoints() as $url) {
            $this->withHeaders(['Accept' => 'application/json', 'Authorization' => 'Bearer 999|faux-jeton'])
                ->getJson($url)
                ->assertStatus(401);
        }
    }

    public function test_un_jeton_expire_est_refuse_401(): void
    {
        $user = $this->makeUser('expire', ['admin']);
        $token = $user->createToken('test');
        $user->tokens()->update(['expires_at' => Carbon::now()->subMinute()]);

        $this->withHeaders(['Accept' => 'application/json', 'Authorization' => 'Bearer ' . $token->plainTextToken])
            ->getJson('/api/punch-summary?date=2026-09-28')
            ->assertStatus(401);
    }

    public function test_un_utilisateur_sans_aucune_permission_recoit_403_partout(): void
    {
        $user = $this->makeUser('sansdroit');

        foreach ($this->endpoints() as $url) {
            $this->api($user)->getJson($url)->assertStatus(403);
        }
    }
}
