<?php

namespace Tests\Feature\Ouvriers;

use App\Models\Resource;
use App\Models\User;
use App\Models\Worker;
use Illuminate\Http\UploadedFile;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Tests\JcdTestCase;

/**
 * FEATURE — Situation Actuelle dans l'export / import Excel des ouvriers (CDC V3 § 3.3.3) :
 * colonne « situation_actuelle » avec liste déroulante ACTIF / INACTIF, mise à jour en masse par matricule.
 */
class ImportExportSituationTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    private function code(): string
    {
        return Resource::where('name', 'Maçon')->value('code');
    }

    private function excelFile(array $rows): UploadedFile
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->getActiveSheet()->fromArray($rows);

        $path = tempnam(sys_get_temp_dir(), 'ouv') . '.xlsx';
        (new Xlsx($spreadsheet))->save($path);

        return new UploadedFile($path, 'ouvriers.xlsx', null, null, true);
    }

    private function header(): array
    {
        return ['matricule', 'nom_complet', 'type_contrat', 'code_fonction', 'situation_actuelle'];
    }

    public function test_le_canvas_a_la_colonne_situation_avec_liste_deroulante(): void
    {
        $sheet = $this->readExcel($this->api($this->admin())->get('/api/worker/export')->assertOk());

        $this->assertEquals('situation_actuelle', $sheet->getCell('E1')->getValue());

        $validation = $sheet->getCell('E2')->getDataValidation();
        $this->assertEquals(DataValidation::TYPE_LIST, $validation->getType());
        $this->assertEquals('"ACTIF,INACTIF"', $validation->getFormula1());
    }

    public function test_tous_les_ouvriers_contient_la_situation_avec_liste_deroulante(): void
    {
        Worker::where('registration_number', 'T003')->update(['is_active' => false]);

        $sheet = $this->readExcel($this->api($this->admin())->get('/api/worker/export/all')->assertOk());

        $this->assertEquals($this->header(), array_slice($sheet->rangeToArray('A1:G1')[0], 0, 5));

        $rows = collect($sheet->toArray())->slice(1)->keyBy(0);
        $this->assertEquals('ACTIF', $rows['T001'][4]);
        $this->assertEquals('INACTIF', $rows['T003'][4]);

        $this->assertEquals('"ACTIF,INACTIF"', $sheet->getCell('E3')->getDataValidation()->getFormula1());
    }

    public function test_reimporter_met_a_jour_la_situation_par_matricule(): void
    {
        $count = Worker::count();
        $t003 = Worker::where('registration_number', 'T003')->first();

        $this->api($this->admin())->post('/api/worker/import', [
            'file' => $this->excelFile([
                $this->header(),
                ['T003', 'Autre nom', 'CDI', $this->code(), 'INACTIF'],
                ['T001', 'Ali', 'CDI', $this->code(), 'actif'],
            ]),
        ], ['Accept' => 'application/json'])
            ->assertStatus(201)
            ->assertJsonPath('created', 0)
            ->assertJsonPath('updated', 1);

        $this->assertEquals($count, Worker::count()); // aucun doublon
        $this->assertFalse($t003->fresh()->is_active);
        $this->assertNotEquals('Autre nom', $t003->fresh()->name); // le reste n'est pas écrasé
    }

    public function test_un_nouvel_ouvrier_peut_etre_cree_inactif_et_vide_veut_dire_actif(): void
    {
        $this->api($this->admin())->post('/api/worker/import', [
            'file' => $this->excelFile([
                $this->header(),
                ['T400', 'Nouveau Inactif', 'ANAPEC', $this->code(), 'INACTIF'],
                ['T401', 'Nouveau Actif', 'CDI', $this->code(), ''],
            ]),
        ], ['Accept' => 'application/json'])->assertStatus(201)->assertJsonPath('created', 2);

        $this->assertFalse(Worker::where('registration_number', 'T400')->first()->is_active);
        $this->assertTrue(Worker::where('registration_number', 'T401')->first()->is_active);
    }

    public function test_une_situation_invalide_est_refusee(): void
    {
        $this->api($this->admin())->post('/api/worker/import', [
            'file' => $this->excelFile([
                $this->header(),
                ['T402', 'Test', 'CDI', $this->code(), 'EN CONGE'],
            ]),
        ], ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonPath('errors.0.attribute', 'situation_actuelle');

        $this->assertDatabaseMissing('workers', ['registration_number' => 'T402']);
    }

    public function test_un_profil_non_rh_ne_peut_pas_changer_la_situation_par_import(): void
    {
        $user = $this->makeUser('importeur', [], ['view workers', 'import workers']);

        $this->api($user)->post('/api/worker/import', [
            'file' => $this->excelFile([
                $this->header(),
                ['T002', 'Karim', 'CDI', $this->code(), 'INACTIF'],
                ['T403', 'Nouveau', 'CDI', $this->code(), 'INACTIF'],
            ]),
        ], ['Accept' => 'application/json'])->assertStatus(201)->assertJsonPath('updated', 0);

        $this->assertTrue(Worker::where('registration_number', 'T002')->first()->is_active);
        $this->assertTrue(Worker::where('registration_number', 'T403')->first()->is_active); // colonne ignorée
    }
}
