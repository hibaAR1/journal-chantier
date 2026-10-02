<?php

namespace Tests\Security\TableauDeBord;

use App\Models\Site;
use Tests\JcdTestCase;

/**
 * SECURITY — Accès au tableau de bord : permission par onglet, chantiers du responsable,
 * paramètres invalides ou malveillants (CDC V3 § 2.2 à 2.5 + demande du superviseur).
 */
class AccesTableauDeBordTest extends JcdTestCase
{
    public function test_chaque_onglet_exige_sa_propre_permission(): void
    {
        $tabs = [
            'view dashboard daily' => '/api/dashboard/daily?site_id=' . $this->siteId('hiba') . '&date=2026-09-26',
            'view dashboard history' => '/api/dashboard/history?site_id=' . $this->siteId('hiba'),
            'view dashboard comparison' => '/api/dashboard/comparison',
            'view dashboard prices' => '/api/dashboard/prices',
        ];

        foreach ($tabs as $permission => $url) {
            // Avec la permission de CET onglet : accès OK
            $allowed = $this->makeUser('ok-' . md5($permission), [], ['view dashboard', $permission, 'view all reports']);
            $this->api($allowed)->getJson($url)->assertOk();

            // Avec toutes les AUTRES permissions d'onglet : refusé
            $others = array_diff(array_keys($tabs), [$permission]);
            $denied = $this->makeUser('ko-' . md5($permission), [], array_merge(['view dashboard', 'view all reports'], $others));
            $this->api($denied)->getJson($url)->assertStatus(403);
        }
    }

    public function test_un_responsable_ne_voit_que_ses_chantiers(): void
    {
        $chef = $this->makeUser('chefvilla', [], ['view dashboard', 'view dashboard daily', 'view dashboard comparison', 'view some reports']);
        Site::where('name', 'Villa Test')->update(['project_responsible_id' => $chef->id]);

        // Son chantier : OK — le chantier d'un autre : refusé
        $this->api($chef)->getJson('/api/dashboard/daily?site_id=' . $this->siteId('Villa Test') . '&date=2026-09-28')->assertOk();
        $this->api($chef)->getJson('/api/dashboard/daily?site_id=' . $this->siteId('hiba') . '&date=2026-09-28')->assertStatus(403);

        // Comparatif : seulement son chantier, même s'il demande les autres
        $sites = collect($this->api($chef)
            ->getJson('/api/dashboard/comparison?from=2026-09-28&to=2026-09-28&site_ids[]=' . $this->siteId('hiba'))
            ->json('active_sites'))->pluck('name')->all();
        $this->assertEquals(['Villa Test'], $sites);
    }

    public function test_periode_inversee_refusee_422(): void
    {
        $this->api($this->makeUser('direction', ['admin']))
            ->getJson('/api/dashboard/history?site_id=' . $this->siteId('hiba') . '&from=2026-09-28&to=2026-09-26')
            ->assertStatus(422);
    }

    public function test_chantier_obligatoire_pour_l_historique_422(): void
    {
        $this->api($this->makeUser('direction', ['admin']))->getJson('/api/dashboard/history')->assertStatus(422);
    }

    public function test_parametres_malveillants_rejetes_422(): void
    {
        $admin = $this->makeUser('direction', ['admin']);

        $this->api($admin)->getJson("/api/dashboard/daily?site_id=1' OR '1'='1")->assertStatus(422);   // injection SQL
        $this->api($admin)->getJson('/api/dashboard/comparison?from=pas-une-date')->assertStatus(422);
        $this->api($admin)->getJson('/api/dashboard/prices?work_id=99999')->assertStatus(422);
    }
}
