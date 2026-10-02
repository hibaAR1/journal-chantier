<?php

namespace Tests\Feature\Chantiers;

use App\Models\Client;
use App\Models\Site;
use App\Models\User;
use Tests\JcdTestCase;

/**
 * FEATURE — Chantiers : ajout (code automatique), consultation, modification, suppression.
 */
class ChantiersTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    private function data(array $extra = []): array
    {
        return array_merge([
            'client_id' => Client::first()->id,
            'project_responsible_id' => $this->admin()->id,
            'worker_id' => $this->admin()->id,
            'name' => 'Résidence Atlas',
            'address' => 'Casablanca',
        ], $extra);
    }

    public function test_un_nouveau_chantier_recoit_un_code_automatique(): void
    {
        $this->api($this->admin())->postJson('/api/sites', $this->data())->assertStatus(201);

        $this->assertStringStartsWith('SIT', Site::where('name', 'Résidence Atlas')->value('code'));
    }

    public function test_les_champs_obligatoires_sont_verifies(): void
    {
        $this->api($this->admin())->postJson('/api/sites', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['client_id', 'project_responsible_id', 'worker_id', 'name', 'address']);
    }

    public function test_l_administrateur_voit_tous_les_chantiers(): void
    {
        $this->api($this->admin())->getJson('/api/sites')
            ->assertOk()
            ->assertJsonFragment(['name' => 'hiba'])
            ->assertJsonFragment(['name' => 'Villa Test'])
            ->assertJsonFragment(['name' => 'Symphonie']);
    }

    public function test_on_peut_consulter_un_chantier(): void
    {
        $this->api($this->admin())->getJson('/api/sites/' . $this->siteId('hiba'))
            ->assertOk()
            ->assertJsonPath('site.name', 'hiba');
    }

    public function test_on_peut_modifier_un_chantier(): void
    {
        $this->api($this->admin())->putJson('/api/sites/' . $this->siteId('hiba'), $this->data(['name' => 'hiba', 'address' => 'Rabat']))
            ->assertOk();

        $this->assertEquals('Rabat', Site::find($this->siteId('hiba'))->address);
    }

    public function test_on_peut_supprimer_un_chantier(): void
    {
        $site = Site::create($this->data(['name' => 'À supprimer']));

        $this->api($this->admin())->deleteJson('/api/sites/' . $site->id)->assertOk();
        $this->assertSoftDeleted('sites', ['id' => $site->id]);
    }
}
