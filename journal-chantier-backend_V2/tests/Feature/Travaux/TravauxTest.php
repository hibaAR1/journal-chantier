<?php

namespace Tests\Feature\Travaux;

use App\Models\User;
use App\Models\Work;
use App\Models\WorkType;
use Tests\JcdTestCase;

/**
 * FEATURE — Travaux (lots) et types de travaux (tâches avec leur T.U de référence).
 */
class TravauxTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    public function test_on_peut_lister_et_ajouter_un_travail(): void
    {
        $this->api($this->admin())->getJson('/api/works')->assertOk();

        $this->api($this->admin())->postJson('/api/works', ['name' => 'Étanchéité', 'unit' => 'M2'])->assertStatus(201);
        $this->assertDatabaseHas('works', ['name' => 'Étanchéité', 'unit' => 'M2']);
    }

    public function test_un_travail_demande_un_nom_et_une_unite(): void
    {
        $this->api($this->admin())->postJson('/api/works', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'unit']);
    }

    public function test_une_tache_d_un_travail_general_est_generale(): void
    {
        $work = Work::create(['name' => 'Peinture', 'unit' => 'M2']);

        $this->api($this->admin())->postJson('/api/work-types', [
            'work_id' => $work->id,
            'name' => 'Peinture façade',
            't_u' => 0.5,
        ])->assertStatus(201);

        $task = WorkType::where('name', 'Peinture façade')->first();
        $this->assertEquals('G', $task->scope);
        $this->assertNull($task->site_id);
    }

    public function test_une_tache_d_un_travail_de_chantier_est_liee_a_ce_chantier(): void
    {
        $work = Work::create(['name' => 'Travaux spécifiques', 'unit' => 'U', 'site_id' => $this->siteId('hiba')]);

        $this->api($this->admin())->postJson('/api/work-types', [
            'work_id' => $work->id,
            'name' => 'Pose portail',
        ])->assertStatus(201);

        $task = WorkType::where('name', 'Pose portail')->first();
        $this->assertEquals('C', $task->scope);
        $this->assertEquals($this->siteId('hiba'), $task->site_id);
    }

    public function test_le_tu_de_reference_ne_peut_pas_etre_negatif(): void
    {
        $this->api($this->admin())->postJson('/api/work-types', [
            'work_id' => Work::first()->id,
            'name' => 'Tâche',
            't_u' => -1,
        ])->assertStatus(422)->assertJsonValidationErrors(['t_u']);
    }

    public function test_on_peut_modifier_et_supprimer_une_tache(): void
    {
        $work = Work::create(['name' => 'Carrelage', 'unit' => 'M2']);
        $task = WorkType::create(['work_id' => $work->id, 'name' => 'Pose carrelage', 'scope' => 'G']);

        $this->api($this->admin())->putJson('/api/work-types/' . $task->id, [
            'work_id' => $work->id,
            'name' => 'Pose faïence',
            't_u' => 1.2,
        ])->assertOk();
        $this->assertEquals('Pose faïence', $task->fresh()->name);

        $this->api($this->admin())->deleteJson('/api/work-types/' . $task->id)->assertOk();
        $this->assertSoftDeleted('work_types', ['id' => $task->id]);
    }
}
