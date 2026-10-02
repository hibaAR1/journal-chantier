<?php

namespace Tests\Security\EtatRecapitulatif;

use App\Models\Site;
use Tests\JcdTestCase;

/**
 * SECURITY — Accès à l'état récapitulatif : mêmes droits que les pointages (CDC V3 § 3.1.6).
 */
class AccesEtatRecapitulatifTest extends JcdTestCase
{
    public function test_voir_certains_pointages_limite_a_ses_chantiers(): void
    {
        $chef = $this->makeUser('chefvilla', [], ['view punches', 'view some punches']);
        Site::where('name', 'Villa Test')->update(['conductor_id' => $chef->id]);

        $response = $this->api($chef)->getJson('/api/punch-summary?date=2026-09-28')->assertOk();
        $this->assertEquals(['Villa Test'], collect($response->json('rows'))->pluck('site')->all());

        // Demander explicitement un autre chantier ne donne rien
        $other = $this->api($chef)->getJson('/api/punch-summary?date=2026-09-28&site_id=' . $this->siteId('hiba'))->assertOk();
        $this->assertCount(0, $other->json('rows'));
    }

    public function test_sans_droit_sur_les_pointages_403(): void
    {
        $this->api($this->makeUser('ouvrier', [], ['view punches']))
            ->getJson('/api/punch-summary?date=2026-09-28')
            ->assertStatus(403);
    }

    public function test_parametres_invalides_ou_malveillants_422(): void
    {
        $user = $this->makeUser('rh', ['admin']);

        $this->api($user)->getJson('/api/punch-summary?date=pas-une-date')->assertStatus(422);
        $this->api($user)->getJson('/api/punch-summary?date=2026-09-28&site_id=99999')->assertStatus(422);
        $this->api($user)->getJson("/api/punch-summary?date=2026-09-28' OR 1=1 --")->assertStatus(422);
    }
}
