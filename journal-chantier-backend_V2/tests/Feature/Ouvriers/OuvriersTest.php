<?php

namespace Tests\Feature\Ouvriers;

use App\Models\Resource;
use App\Models\User;
use App\Models\Worker;
use Illuminate\Http\UploadedFile;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Tests\JcdTestCase;

/**
 * FEATURE — Ouvriers : ajout, matricule unique, code automatique, modification, suppression, import / export Excel.
 */
class OuvriersTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    public function test_on_peut_lister_les_ouvriers(): void
    {
        $this->api($this->admin())->getJson('/api/workers')
            ->assertOk()
            ->assertJsonFragment(['registration_number' => 'T001']);
    }

    public function test_un_nouvel_ouvrier_recoit_un_code_automatique(): void
    {
        $this->api($this->admin())->postJson('/api/workers', [
            'resource_id' => Resource::where('name', 'Maçon')->value('id'),
            'name' => 'Mustapha',
            'contract_type' => 'CDI',
            'registration_number' => 'T100',
        ])->assertStatus(201);

        $this->assertStringStartsWith('OUV', Worker::where('registration_number', 'T100')->value('code'));
    }

    public function test_le_matricule_est_unique(): void
    {
        $this->api($this->admin())->postJson('/api/workers', [
            'resource_id' => Resource::first()->id,
            'name' => 'Doublon',
            'contract_type' => 'CDI',
            'registration_number' => 'T001',
        ])->assertStatus(422)->assertJsonValidationErrors(['registration_number']);
    }

    public function test_le_type_de_contrat_doit_etre_dans_la_liste(): void
    {
        $this->api($this->admin())->postJson('/api/workers', [
            'resource_id' => Resource::first()->id,
            'name' => 'Test',
            'contract_type' => 'STAGE',
            'registration_number' => 'T101',
        ])->assertStatus(422)->assertJsonValidationErrors(['contract_type']);
    }

    public function test_on_peut_modifier_et_supprimer_un_ouvrier(): void
    {
        $worker = Worker::where('registration_number', 'T001')->first();

        $this->api($this->admin())->putJson('/api/workers/' . $worker->id, [
            'resource_id' => $worker->resource_id,
            'name' => 'Ali Benali',
            'contract_type' => 'CDI',
            'registration_number' => 'T001',
        ])->assertOk();
        $this->assertEquals('Ali Benali', $worker->fresh()->name);

        $this->api($this->admin())->deleteJson('/api/workers/' . $worker->id)->assertOk();
        $this->assertSoftDeleted('workers', ['id' => $worker->id]);
    }

    public function test_on_peut_telecharger_le_modele_et_la_liste_des_ouvriers(): void
    {
        $this->api($this->admin())->get('/api/worker/export')->assertOk()->assertDownload('ouvriers.xlsx');
        $this->api($this->admin())->get('/api/worker/export/all')->assertOk()->assertDownload('ouvriers.xlsx');
    }

    public function test_on_peut_importer_des_ouvriers_depuis_excel(): void
    {
        // Code de la fonction "Maçon" (généré automatiquement : RSR…)
        $code = Resource::where('name', 'Maçon')->value('code');

        $this->api($this->admin())->post('/api/worker/import', [
            'file' => $this->excelFile([
                ['matricule', 'nom_complet', 'type_contrat', 'code_fonction'],
                ['T200', 'Rachid Import', 'CDI', $code],
                ['T001', 'Déjà existant', 'CDI', $code],
            ]),
        ])->assertStatus(201);

        $this->assertDatabaseHas('workers', ['registration_number' => 'T200', 'name' => 'Rachid Import']);
        // Un matricule déjà existant n'est pas écrasé
        $this->assertDatabaseMissing('workers', ['name' => 'Déjà existant']);
    }

    public function test_un_fichier_d_import_avec_une_fonction_inconnue_est_refuse(): void
    {
        $this->api($this->admin())->post('/api/worker/import', [
            'file' => $this->excelFile([
                ['matricule', 'nom_complet', 'type_contrat', 'code_fonction'],
                ['T300', 'Inconnu', 'CDI', 'XXX'],
            ]),
        ])->assertStatus(422);

        $this->assertDatabaseMissing('workers', ['registration_number' => 'T300']);
    }

    /**
     * Fabrique un vrai fichier Excel (.xlsx) à envoyer à l'API.
     */
    private function excelFile(array $rows): UploadedFile
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->getActiveSheet()->fromArray($rows);

        $path = tempnam(sys_get_temp_dir(), 'ouv') . '.xlsx';
        (new Xlsx($spreadsheet))->save($path);

        return new UploadedFile($path, 'ouvriers.xlsx', null, null, true);
    }
}
