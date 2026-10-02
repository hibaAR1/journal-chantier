<?php

namespace Tests\Feature\Emplacements;

use App\Models\Location;
use App\Models\SiteLocation;
use App\Models\User;
use Tests\JcdTestCase;

/**
 * FEATURE — Emplacements : liste des emplacements et emplacements d'un chantier (bloc / élément).
 */
class EmplacementsTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    public function test_on_peut_lister_et_ajouter_un_emplacement(): void
    {
        $this->api($this->admin())->getJson('/api/locations')->assertOk();

        $this->api($this->admin())->postJson('/api/locations', ['name' => 'Sous-sol'])->assertStatus(201);
        $this->assertDatabaseHas('locations', ['name' => 'Sous-sol']);
    }

    public function test_le_nom_de_l_emplacement_est_obligatoire(): void
    {
        $this->api($this->admin())->postJson('/api/locations', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_on_peut_modifier_et_supprimer_un_emplacement(): void
    {
        $location = Location::create(['name' => 'Terrasse']);

        $this->api($this->admin())->putJson('/api/locations/' . $location->id, ['name' => 'Toiture'])->assertOk();
        $this->assertEquals('Toiture', $location->fresh()->name);

        $this->api($this->admin())->deleteJson('/api/locations/' . $location->id)->assertOk();
        $this->assertSoftDeleted('locations', ['id' => $location->id]);
    }

    public function test_on_peut_ajouter_un_emplacement_a_un_chantier(): void
    {
        $this->api($this->admin())->postJson('/api/site-locations', [
            'site_id' => $this->siteId('hiba'),
            'location_id' => Location::first()->id,
            'block' => 'Bloc B',
            'element' => 'Dalle',
        ])->assertStatus(201);

        $this->api($this->admin())->getJson('/api/site-locations/' . $this->siteId('hiba'))
            ->assertOk()
            ->assertJsonFragment(['block' => 'Bloc B']);
    }

    public function test_un_emplacement_de_chantier_demande_un_chantier_et_un_emplacement_existants(): void
    {
        $this->api($this->admin())->postJson('/api/site-locations', ['site_id' => 999999, 'location_id' => 999999])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['site_id', 'location_id']);
    }

    public function test_on_peut_modifier_et_supprimer_un_emplacement_de_chantier(): void
    {
        $siteLocation = SiteLocation::create([
            'site_id' => $this->siteId('hiba'),
            'location_id' => Location::first()->id,
            'block' => 'Bloc C',
            'element' => 'Poteau',
        ]);

        $this->api($this->admin())->putJson('/api/site-locations/' . $siteLocation->id, [
            'site_id' => $this->siteId('hiba'),
            'location_id' => Location::first()->id,
            'block' => 'Bloc D',
            'element' => 'Poteau',
        ])->assertOk();
        $this->assertEquals('Bloc D', $siteLocation->fresh()->block);

        $this->api($this->admin())->deleteJson('/api/site-locations/' . $siteLocation->id)->assertOk();
        $this->assertSoftDeleted('site_location', ['id' => $siteLocation->id]);
    }
}
