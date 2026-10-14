<?php

namespace Tests\Security\Permissions;

use App\Models\Worker;
use Tests\JcdTestCase;

/**
 * SECURITY — Situation Actuelle des ouvriers (CDC V3 § 3.3) : réservée aux profils RH
 * (Administrateur et Responsable RH, permission "manage worker status").
 */
class SituationOuvrierAccesTest extends JcdTestCase
{
    public function test_le_responsable_rh_a_la_permission(): void
    {
        $this->assertTrue($this->makeUser('rh', ['human_resources_responsible'])->can('manage worker status'));
        $this->assertTrue($this->makeUser('adm', ['admin'])->can('manage worker status'));
    }

    public function test_les_autres_profils_n_ont_pas_la_permission(): void
    {
        foreach (['conductor', 'data_entry', 'project_responsible', 'worker'] as $role) {
            $this->assertFalse($this->makeUser('u_' . $role, [$role])->can('manage worker status'), $role);
        }
    }

    public function test_un_profil_non_rh_ne_voit_pas_les_ouvriers_inactifs(): void
    {
        Worker::where('registration_number', 'T003')->update(['is_active' => false]);

        $response = $this->api($this->makeUser('cond', ['conductor']))->getJson('/api/workers')->assertOk();

        $this->assertNotContains('T003', collect($response->json())->pluck('registration_number'));
    }

    public function test_un_profil_non_rh_ne_peut_pas_changer_la_situation(): void
    {
        $worker = Worker::where('registration_number', 'T002')->first();
        $user = $this->makeUser('autre', [], ['view workers', 'update workers']);

        $this->api($user)->putJson('/api/workers/' . $worker->id, [
            'resource_id' => $worker->resource_id,
            'name' => $worker->name,
            'contract_type' => $worker->contract_type,
            'registration_number' => $worker->registration_number,
            'is_active' => false,
        ])->assertStatus(403);

        $this->assertTrue($worker->fresh()->is_active);
    }
}
