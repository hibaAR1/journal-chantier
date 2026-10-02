<?php

namespace Tests\Feature\Ressources;

use App\Models\Resource;
use App\Models\User;
use Tests\JcdTestCase;

/**
 * FEATURE — Ressources (métiers : Maçon, Boiseur… et matériel).
 */
class RessourcesTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    public function test_on_peut_lister_les_ressources(): void
    {
        $this->api($this->admin())->getJson('/api/resources')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Maçon']);
    }

    public function test_on_peut_ajouter_une_ressource(): void
    {
        $this->api($this->admin())->postJson('/api/resources', ['name' => 'Chef ferrailleur', 'type' => 1])->assertStatus(201);

        $this->assertDatabaseHas('resources', ['name' => 'Chef ferrailleur', 'type' => 1]);
    }

    public function test_le_type_de_ressource_doit_etre_1_ou_2(): void
    {
        $this->api($this->admin())->postJson('/api/resources', ['name' => 'Test', 'type' => 9])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    public function test_on_peut_modifier_et_supprimer_une_ressource(): void
    {
        $resource = Resource::create(['name' => 'Grutier', 'type' => 1]);

        $this->api($this->admin())->putJson('/api/resources/' . $resource->id, ['name' => 'Conducteur grue', 'type' => 1])->assertOk();
        $this->assertEquals('Conducteur grue', $resource->fresh()->name);

        $this->api($this->admin())->deleteJson('/api/resources/' . $resource->id)->assertOk();
        $this->assertSoftDeleted('resources', ['id' => $resource->id]);
    }
}
