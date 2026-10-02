<?php

namespace Tests\Feature\Historique;

use App\Models\ActivityLog;
use App\Models\Client;
use App\Models\Punch;
use App\Models\User;
use Tests\JcdTestCase;

/**
 * FEATURE — Historique des actions (table activity_logs) : qui a fait quoi, et quand.
 */
class JournalActiviteTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    public function test_une_creation_est_enregistree_avec_son_auteur(): void
    {
        $this->api($this->admin())->postJson('/api/clients', [
            'registered_name' => 'Client historique',
            'code_system' => 'CLI-HIST',
        ])->assertStatus(201);

        $client = Client::where('code_system', 'CLI-HIST')->first();

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'created',
            'model_type' => Client::class,
            'model_id' => $client->id,
            'user_id' => $this->admin()->id,
        ]);
    }

    public function test_une_modification_et_une_suppression_sont_enregistrees(): void
    {
        $client = Client::create(['registered_name' => 'Avant', 'code_system' => 'CLI-H2']);

        $this->api($this->admin())->putJson('/api/clients/' . $client->id, ['registered_name' => 'Après', 'code_system' => 'CLI-H2'])->assertOk();
        $this->api($this->admin())->deleteJson('/api/clients/' . $client->id)->assertOk();

        $actions = ActivityLog::where('model_type', Client::class)->where('model_id', $client->id)->pluck('action')->all();
        $this->assertContains('updated', $actions);
        $this->assertContains('deleted', $actions);
    }

    public function test_la_validation_d_un_pointage_est_enregistree(): void
    {
        $punch = Punch::whereDate('date', '2026-09-28')->first();

        $this->api($this->admin())->patchJson('/api/punches/' . $punch->id . '/validate')->assertOk();

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'validated',
            'model_type' => Punch::class,
            'model_id' => $punch->id,
            'user_id' => $this->admin()->id,
        ]);
    }
}
