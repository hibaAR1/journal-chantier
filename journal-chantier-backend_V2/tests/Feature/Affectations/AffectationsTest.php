<?php

namespace Tests\Feature\Affectations;

use App\Models\Assignment;
use App\Models\AssignmentWorker;
use App\Models\User;
use App\Models\Worker;
use Tests\JcdTestCase;

/**
 * FEATURE — Affectations des ouvriers aux chantiers.
 * Quand un ouvrier est affecté, il est rattaché au chantier (workers.site_id).
 */
class AffectationsTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    public function test_une_nouvelle_affectation_recoit_un_code_automatique(): void
    {
        $this->api($this->admin())->postJson('/api/assignments', ['site_id' => $this->siteId('hiba')])->assertStatus(201);

        $this->assertStringStartsWith('ASG', Assignment::first()->code);
    }

    public function test_une_affectation_demande_un_chantier_existant(): void
    {
        $this->api($this->admin())->postJson('/api/assignments', ['site_id' => 999999])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['site_id']);
    }

    public function test_affecter_un_ouvrier_le_rattache_au_chantier(): void
    {
        $assignment = Assignment::create(['site_id' => $this->siteId('Villa Test')]);
        $worker = Worker::where('registration_number', 'T001')->first();

        $this->api($this->admin())->postJson('/api/assignment-worker', [
            'worker_id' => $worker->id,
            'assignment_id' => $assignment->id,
        ])->assertStatus(201);

        $this->assertEquals($this->siteId('Villa Test'), $worker->fresh()->site_id);

        $this->api($this->admin())->getJson('/api/assignment-worker/' . $assignment->id)
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_retirer_l_affectation_detache_l_ouvrier_du_chantier(): void
    {
        $assignment = Assignment::create(['site_id' => $this->siteId('Villa Test')]);
        $worker = Worker::where('registration_number', 'T002')->first();
        $line = AssignmentWorker::create(['worker_id' => $worker->id, 'assignment_id' => $assignment->id]);

        $this->api($this->admin())->deleteJson('/api/assignment-worker/' . $line->id)->assertOk();

        $this->assertNull($worker->fresh()->site_id);
    }

    public function test_changer_d_affectation_change_le_chantier_de_l_ouvrier(): void
    {
        $villa = Assignment::create(['site_id' => $this->siteId('Villa Test')]);
        $symphonie = Assignment::create(['site_id' => $this->siteId('Symphonie')]);
        $worker = Worker::where('registration_number', 'T003')->first();
        $line = AssignmentWorker::create(['worker_id' => $worker->id, 'assignment_id' => $villa->id]);

        $this->api($this->admin())->putJson('/api/assignment-worker/' . $line->id, [
            'worker_id' => $worker->id,
            'assignment_id' => $symphonie->id,
        ])->assertOk();

        $this->assertEquals($this->siteId('Symphonie'), $worker->fresh()->site_id);
    }

    public function test_on_peut_telecharger_le_modele_excel_d_affectation(): void
    {
        $assignment = Assignment::create(['site_id' => $this->siteId('hiba')]);

        $this->api($this->admin())->get('/api/assignment-workers/export/' . $assignment->id)
            ->assertOk()
            ->assertDownload('Assignments.xlsx');
    }

    public function test_on_peut_supprimer_une_affectation(): void
    {
        $assignment = Assignment::create(['site_id' => $this->siteId('hiba')]);

        $this->api($this->admin())->deleteJson('/api/assignments/' . $assignment->id)->assertOk();
        $this->assertSoftDeleted('assignments', ['id' => $assignment->id]);
    }
}
