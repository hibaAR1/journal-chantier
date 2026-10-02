<?php

namespace Tests\Feature\Pointage;

use App\Models\Punch;
use App\Models\User;
use App\Models\Worker;
use Illuminate\Http\UploadedFile;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Tests\JcdTestCase;

/**
 * FEATURE — Pointages : dossier de pointage par chantier et par jour, lignes ouvriers,
 * validation / dévalidation, import / export Excel.
 */
class PointagesTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    private function worker(string $registration): Worker
    {
        return Worker::where('registration_number', $registration)->first();
    }

    private function newPunch(string $site = 'hiba', string $date = '2026-09-29'): Punch
    {
        return Punch::create(['site_id' => $this->siteId($site), 'date' => $date]);
    }

    public function test_un_nouveau_pointage_recoit_un_code_automatique(): void
    {
        $this->api($this->admin())->postJson('/api/punches', [
            'site_id' => $this->siteId('hiba'),
            'date' => '2026-09-29',
        ])->assertStatus(201);

        $this->assertStringStartsWith('POI', Punch::whereDate('date', '2026-09-29')->value('code'));
    }

    public function test_un_seul_pointage_par_chantier_et_par_jour(): void
    {
        $this->api($this->admin())->postJson('/api/punches', [
            'site_id' => $this->siteId('hiba'),
            'date' => '2026-09-28',
        ])->assertStatus(409);
    }

    public function test_on_peut_pointer_un_ouvrier_present(): void
    {
        $punch = $this->newPunch();

        $this->api($this->admin())->postJson('/api/punch-worker', [
            'worker_id' => $this->worker('T001')->id,
            'punch_id' => $punch->id,
            'type' => 2,
            'natural_hours' => 8,
            'overtime_hours' => 2,
        ])->assertStatus(201);

        $this->api($this->admin())->getJson('/api/punch-worker/' . $punch->id)->assertOk()->assertJsonCount(1);
    }

    public function test_les_heures_sont_obligatoires_pour_un_ouvrier_present(): void
    {
        $this->api($this->admin())->postJson('/api/punch-worker', [
            'worker_id' => $this->worker('T001')->id,
            'punch_id' => $this->newPunch()->id,
            'type' => 2,
        ])->assertStatus(422)->assertJsonValidationErrors(['natural_hours', 'overtime_hours']);
    }

    public function test_un_absent_peut_etre_pointe_sans_heures(): void
    {
        $this->api($this->admin())->postJson('/api/punch-worker', [
            'worker_id' => $this->worker('T001')->id,
            'punch_id' => $this->newPunch()->id,
            'type' => 5,
        ])->assertStatus(201);
    }

    public function test_le_type_de_pointage_doit_etre_entre_1_et_7(): void
    {
        $this->api($this->admin())->postJson('/api/punch-worker', [
            'worker_id' => $this->worker('T001')->id,
            'punch_id' => $this->newPunch()->id,
            'type' => 8,
        ])->assertStatus(422)->assertJsonValidationErrors(['type']);
    }

    public function test_un_ouvrier_ne_peut_pas_etre_pointe_sur_deux_chantiers_le_meme_jour(): void
    {
        // Ali est déjà pointé sur "hiba" le 28/09
        $symphonie = Punch::where('site_id', $this->siteId('Symphonie'))->whereDate('date', '2026-09-28')->first();

        $this->api($this->admin())->postJson('/api/punch-worker', [
            'worker_id' => $this->worker('T001')->id,
            'punch_id' => $symphonie->id,
            'type' => 1,
            'natural_hours' => 8,
        ])->assertStatus(422)->assertJsonValidationErrors(['worker_id']);
    }

    public function test_on_ne_peut_pas_valider_un_pointage_vide(): void
    {
        $this->api($this->admin())->patchJson('/api/punches/' . $this->newPunch()->id . '/validate')->assertStatus(400);
    }

    public function test_valider_puis_devalider_un_pointage(): void
    {
        $punch = Punch::whereDate('date', '2026-09-28')->first();

        $this->api($this->admin())->patchJson('/api/punches/' . $punch->id . '/validate')->assertOk();
        $this->assertTrue((bool) $punch->fresh()->validated);

        $this->api($this->admin())->patchJson('/api/punches/' . $punch->id . '/invalidate')->assertOk();
        $this->assertFalse((bool) $punch->fresh()->validated);
    }

    public function test_un_pointage_valide_ne_peut_etre_ni_modifie_ni_supprime(): void
    {
        $punch = Punch::whereDate('date', '2026-09-28')->first();
        $punch->update(['validated' => true]);

        $this->api($this->admin())->putJson('/api/punches/' . $punch->id, [
            'site_id' => $punch->site_id,
            'date' => '2026-09-27',
        ])->assertStatus(403);

        $this->api($this->admin())->deleteJson('/api/punches/' . $punch->id)->assertStatus(403);
        $this->assertNotSoftDeleted('punches', ['id' => $punch->id]);
    }

    public function test_on_peut_supprimer_un_pointage_non_valide(): void
    {
        $punch = $this->newPunch();

        $this->api($this->admin())->deleteJson('/api/punches/' . $punch->id)->assertOk();
        $this->assertSoftDeleted('punches', ['id' => $punch->id]);
    }

    public function test_on_peut_telecharger_le_modele_excel_du_pointage(): void
    {
        $this->api($this->admin())->get('/api/punch-workers/export/' . Punch::first()->id)
            ->assertOk()
            ->assertDownload('Pointage.xlsx');
    }

    public function test_on_peut_importer_un_pointage_depuis_excel(): void
    {
        $punch = $this->newPunch('Symphonie', '2026-09-29');

        $this->api($this->admin())->post('/api/punch-workers/import', [
            'file' => $this->excelFile([
                ['dossier_pointage', 'matricule', 'type_service', 'heures_normales', 'heures_supplementaires'],
                [$punch->code, 'T007', 2, 8, 3],
            ]),
        ])->assertStatus(201);

        $this->assertDatabaseHas('punch_worker', [
            'punch_id' => $punch->id,
            'worker_id' => $this->worker('T007')->id,
            'natural_hours' => 8,
            'overtime_hours' => 3,
        ]);
    }

    private function excelFile(array $rows): UploadedFile
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->getActiveSheet()->fromArray($rows);

        $path = tempnam(sys_get_temp_dir(), 'poi') . '.xlsx';
        (new Xlsx($spreadsheet))->save($path);

        return new UploadedFile($path, 'pointage.xlsx', null, null, true);
    }
}
