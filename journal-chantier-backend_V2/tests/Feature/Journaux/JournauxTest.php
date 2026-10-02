<?php

namespace Tests\Feature\Journaux;

use App\Models\Report;
use App\Models\ReportWorkType;
use App\Models\SiteLocation;
use App\Models\User;
use App\Models\Worker;
use App\Models\WorkType;
use Tests\JcdTestCase;

/**
 * FEATURE — Journaux de chantier : création, tâches, ouvriers par tâche,
 * report automatique des tâches non terminées, validation, PDF et Excel.
 */
class JournauxTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    private function lastReport(string $site): Report
    {
        return Report::where('site_id', $this->siteId($site))->orderByDesc('date')->first();
    }

    public function test_un_nouveau_journal_recoit_un_code_automatique(): void
    {
        $this->api($this->admin())->postJson('/api/reports', [
            'site_id' => $this->siteId('hiba'),
            'date' => '2026-09-29',
        ])->assertStatus(201);

        $this->assertStringStartsWith('RPT', Report::whereDate('date', '2026-09-29')->value('code'));
    }

    public function test_un_seul_journal_par_chantier_et_par_jour(): void
    {
        $this->api($this->admin())->postJson('/api/reports', [
            'site_id' => $this->siteId('hiba'),
            'date' => '2026-09-28',
        ])->assertStatus(409);
    }

    public function test_les_taches_non_terminees_sont_reportees_au_journal_suivant(): void
    {
        $previous = $this->lastReport('hiba');
        $unfinished = ReportWorkType::where('report_id', $previous->id)->where('stat_work', '<', 100)->count();
        $this->assertGreaterThan(0, $unfinished);

        $this->api($this->admin())->postJson('/api/reports', [
            'site_id' => $this->siteId('hiba'),
            'date' => '2026-09-29',
        ])->assertStatus(201);

        $new = Report::whereDate('date', '2026-09-29')->where('site_id', $this->siteId('hiba'))->first();
        $this->assertEquals($unfinished, ReportWorkType::where('report_id', $new->id)->where('is_reported', true)->count());
    }

    public function test_on_peut_ajouter_une_tache_et_un_ouvrier_a_un_journal(): void
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
            'worker_id' => Worker::where('registration_number', 'T001')->value('id'),
            'normal_hours' => 8,
            'overtime_hours' => 1,
        ])->assertStatus(201);

        $this->api($this->admin())->getJson('/api/report-work-type-worker/' . $task)->assertOk()->assertJsonCount(1);
    }

    public function test_on_peut_consulter_un_journal_avec_ses_taches(): void
    {
        $report = $this->lastReport('hiba');

        $this->api($this->admin())->getJson('/api/reports/' . $report->id)
            ->assertOk()
            ->assertJsonPath('is_last', true)
            ->assertJsonStructure(['report', 'is_last', 'reportedTasks', 'today_tasks']);
    }

    public function test_on_ne_peut_pas_valider_un_journal_sans_ouvriers(): void
    {
        $report = Report::create(['site_id' => $this->siteId('hiba'), 'date' => '2026-09-29']);

        $this->api($this->admin())->patchJson('/api/reports/' . $report->id . '/validate')->assertStatus(400);
    }

    public function test_valider_puis_devalider_un_journal(): void
    {
        $report = $this->lastReport('hiba');

        $this->api($this->admin())->patchJson('/api/reports/' . $report->id . '/validate')->assertOk();
        $this->assertTrue((bool) $report->fresh()->validated);

        $this->api($this->admin())->patchJson('/api/reports/' . $report->id . '/invalidate')->assertOk();
        $this->assertFalse((bool) $report->fresh()->validated);
    }

    public function test_on_peut_telecharger_le_journal_en_pdf_et_en_excel(): void
    {
        $report = $this->lastReport('hiba');

        $pdf = $this->api($this->admin())->get('/api/reports/' . $report->id . '/download');
        $pdf->assertOk();
        $this->assertStringStartsWith('%PDF', $pdf->getContent());

        $this->api($this->admin())->get('/api/reports/' . $report->id . '/download-excel')
            ->assertOk()
            ->assertDownload('journal_chantier_' . $report->code . '.xlsx');
    }

    public function test_on_sait_si_un_journal_est_le_dernier_du_chantier(): void
    {
        $reports = Report::where('site_id', $this->siteId('hiba'))->orderBy('date')->get();

        $this->api($this->admin())->getJson('/api/reports/' . $reports->first()->id . '/is-last')->assertJson(['is_last' => false]);
        $this->api($this->admin())->getJson('/api/reports/' . $reports->last()->id . '/is-last')->assertJson(['is_last' => true]);
    }

    public function test_on_peut_supprimer_un_journal(): void
    {
        $report = Report::create(['site_id' => $this->siteId('hiba'), 'date' => '2026-09-29']);

        $this->api($this->admin())->deleteJson('/api/reports/' . $report->id)->assertOk();
        $this->assertSoftDeleted('reports', ['id' => $report->id]);
    }
}
