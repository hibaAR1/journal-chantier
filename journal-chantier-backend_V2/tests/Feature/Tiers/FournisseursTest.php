<?php

namespace Tests\Feature\Tiers;

use App\Models\Supplier;
use App\Models\User;
use Tests\JcdTestCase;

/**
 * FEATURE — Tiers : Fournisseurs (liste, ajout, modification, suppression).
 */
class FournisseursTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    public function test_on_peut_ajouter_et_lister_les_fournisseurs(): void
    {
        $this->api($this->admin())->postJson('/api/suppliers', [
            'registered_name' => 'Lafarge',
            'code_system' => 'FRS-001',
        ])->assertStatus(201);

        $this->api($this->admin())->getJson('/api/suppliers')
            ->assertOk()
            ->assertJsonFragment(['registered_name' => 'Lafarge']);
    }

    public function test_les_champs_obligatoires_sont_verifies(): void
    {
        $this->api($this->admin())->postJson('/api/suppliers', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['registered_name', 'code_system']);
    }

    public function test_on_peut_modifier_un_fournisseur(): void
    {
        $supplier = Supplier::create(['registered_name' => 'Sonasid', 'code_system' => 'FRS-002']);

        $this->api($this->admin())->putJson('/api/suppliers/' . $supplier->id, [
            'registered_name' => 'Sonasid SA',
            'code_system' => 'FRS-002',
        ])->assertOk();

        $this->assertEquals('Sonasid SA', $supplier->fresh()->registered_name);
    }

    public function test_on_peut_supprimer_un_fournisseur(): void
    {
        $supplier = Supplier::create(['registered_name' => 'Holcim', 'code_system' => 'FRS-003']);

        $this->api($this->admin())->deleteJson('/api/suppliers/' . $supplier->id)->assertOk();
        $this->assertSoftDeleted('suppliers', ['id' => $supplier->id]);
    }
}
