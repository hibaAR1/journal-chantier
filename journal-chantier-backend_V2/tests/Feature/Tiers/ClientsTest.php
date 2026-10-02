<?php

namespace Tests\Feature\Tiers;

use App\Models\Client;
use App\Models\User;
use Tests\JcdTestCase;

/**
 * FEATURE — Tiers : Clients (liste, ajout, consultation, modification, suppression).
 */
class ClientsTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    public function test_on_peut_lister_les_clients(): void
    {
        $this->api($this->admin())->getJson('/api/clients')
            ->assertOk()
            ->assertJsonFragment(['code_system' => 'CLI-TEST']);
    }

    public function test_on_peut_ajouter_un_client(): void
    {
        $this->api($this->admin())->postJson('/api/clients', [
            'registered_name' => 'TGCC',
            'code_system' => 'CLI-001',
        ])->assertStatus(201);

        $this->assertDatabaseHas('clients', ['registered_name' => 'TGCC', 'code_system' => 'CLI-001']);
    }

    public function test_les_champs_obligatoires_sont_verifies(): void
    {
        $this->api($this->admin())->postJson('/api/clients', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['registered_name', 'code_system']);
    }

    public function test_deux_clients_ne_peuvent_pas_avoir_le_meme_code(): void
    {
        $this->api($this->admin())->postJson('/api/clients', [
            'registered_name' => 'Autre client',
            'code_system' => 'CLI-TEST',
        ])->assertStatus(422)->assertJsonValidationErrors(['code_system']);
    }

    public function test_on_peut_modifier_et_supprimer_un_client_sans_chantier(): void
    {
        $client = Client::create(['registered_name' => 'Ancien nom', 'code_system' => 'CLI-002']);

        $this->api($this->admin())->putJson('/api/clients/' . $client->id, [
            'registered_name' => 'Nouveau nom',
            'code_system' => 'CLI-002',
        ])->assertOk();
        $this->assertEquals('Nouveau nom', $client->fresh()->registered_name);

        $this->api($this->admin())->deleteJson('/api/clients/' . $client->id)->assertOk();
        $this->assertSoftDeleted('clients', ['id' => $client->id]);
    }

    public function test_un_client_lie_a_un_chantier_ne_peut_pas_etre_supprime(): void
    {
        $client = Client::where('code_system', 'CLI-TEST')->first();

        $this->api($this->admin())->deleteJson('/api/clients/' . $client->id)->assertStatus(403);
        $this->assertNotSoftDeleted('clients', ['id' => $client->id]);
    }

    public function test_un_client_inexistant_renvoie_404(): void
    {
        $this->api($this->admin())->getJson('/api/clients/999999')->assertStatus(404);
    }
}
