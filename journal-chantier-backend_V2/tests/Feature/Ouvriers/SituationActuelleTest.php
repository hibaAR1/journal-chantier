<?php

namespace Tests\Feature\Ouvriers;

use App\Models\Assignment;
use App\Models\Punch;
use App\Models\Report;
use App\Models\SiteLocation;
use App\Models\User;
use App\Models\Worker;
use App\Models\WorkType;
use Tests\JcdTestCase;

/**
 * FEATURE — Situation Actuelle des ouvriers (CDC V3 § 3.3) :
 * ACTIF / INACTIF (crayon) et masquage dans les listes de sélection.
 */
class SituationActuelleTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    private function worker(string $registration): Worker
    {
        return Worker::where('registration_number', $registration)->first();
    }

    private function deactivate(string $registration): Worker
    {
        $worker = $this->worker($registration);
        $worker->update(['is_active' => false]);

        return $worker;
    }

    // ---------- § 3.3.1 Nouvelle colonne ----------

    public function test_un_nouvel_ouvrier_est_actif_par_defaut(): void
    {
        $this->api($this->admin())->getJson('/api/workers/' . $this->worker('T001')->id)
            ->assertOk()
            ->assertJsonPath('is_active', true)
            ->assertJsonPath('situation', 'ACTIF');
    }

    public function test_le_rh_peut_passer_un_ouvrier_en_inactif_avec_le_crayon(): void
    {
        $worker = $this->worker('T002');

        $this->api($this->admin())->putJson('/api/workers/' . $worker->id, [
            'resource_id' => $worker->resource_id,
            'name' => $worker->name,
            'contract_type' => $worker->contract_type,
            'registration_number' => $worker->registration_number,
            'is_active' => false,
        ])->assertOk();

        $this->assertFalse($worker->fresh()->is_active);
    }

    // ---------- § 3.3.2 Règle de masquage ----------

    public function test_le_rh_voit_la_liste_complete_avec_les_inactifs(): void
    {
        $this->deactivate('T003');

        $this->api($this->admin())->getJson('/api/workers')
            ->assertOk()
            ->assertJsonFragment(['registration_number' => 'T003', 'situation' => 'INACTIF']);
    }

    public function test_les_listes_de_selection_ne_contiennent_que_les_actifs(): void
    {
        $this->deactivate('T003');

        // Les écrans pointage / rendement / affectation appellent /api/workers?active_only=1
        $response = $this->api($this->admin())->getJson('/api/workers?active_only=1')->assertOk();

        $this->assertNotContains('T003', collect($response->json())->pluck('registration_number'));
        $this->assertContains('T001', collect($response->json())->pluck('registration_number'));
    }

    public function test_un_ouvrier_inactif_ne_peut_plus_etre_pointe(): void
    {
        $punch = Punch::create(['site_id' => $this->siteId('hiba'), 'date' => '2026-09-29']);

        $this->api($this->admin())->postJson('/api/punch-worker', [
            'worker_id' => $this->deactivate('T001')->id,
            'punch_id' => $punch->id,
            'type' => 1,
            'natural_hours' => 8,
        ])->assertStatus(422)->assertJsonValidationErrors(['worker_id']);
    }

    public function test_un_ouvrier_inactif_ne_peut_plus_etre_saisi_dans_le_rendement(): void
    {
        $report = Report::create(['site_id' => $this->siteId('hiba'), 'date' => '2026-09-29']);

        $task = $this->api($this->admin())->postJson('/api/report-work-type', [
            'report_id' => $report->id,
            'work_type_id' => WorkType::first()->id,
            'site_location_id' => SiteLocation::where('site_id', $this->siteId('hiba'))->value('id'),
            'stat_work' => 40,
            'quantity_completed' => 12,
        ])->assertStatus(201)->json('reportWorkType.id');

        $this->api($this->admin())->postJson('/api/report-work-type-worker', [
            'report_work_type_id' => $task,
            'worker_id' => $this->deactivate('T001')->id,
            'normal_hours' => 8,
            'overtime_hours' => 0,
        ])->assertStatus(422)->assertJsonValidationErrors(['worker_id']);
    }

    public function test_un_ouvrier_inactif_ne_peut_plus_etre_affecte(): void
    {
        $assignment = Assignment::create(['site_id' => $this->siteId('Villa Test')]);

        $this->api($this->admin())->postJson('/api/assignment-worker', [
            'worker_id' => $this->deactivate('T001')->id,
            'assignment_id' => $assignment->id,
        ])->assertStatus(422)->assertJsonValidationErrors(['worker_id']);
    }

    public function test_l_historique_est_conserve_pour_un_ouvrier_inactif(): void
    {
        $worker = $this->worker('T001');
        $before = $worker->punchWorkers()->count();
        $this->assertGreaterThan(0, $before);

        $this->deactivate('T001');

        // Rien n'est supprimé : l'ouvrier et ses pointages passés restent en base
        $this->assertDatabaseHas('workers', ['registration_number' => 'T001', 'deleted_at' => null]);
        $this->assertEquals($before, $worker->fresh()->punchWorkers()->count());
    }
}
