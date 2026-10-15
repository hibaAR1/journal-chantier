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
 * FEATURE — Mise à jour en masse de la liste du personnel par import Excel (CDC V3 § 3.3.3) :
 * modèle (Matricule, Nom, Qualification, Type de contrat, Situation Actuelle), rapprochement par matricule,
 * ACTIF / INACTIF seulement, rapport d'import (lignes mises à jour + détail des erreurs), réservé RH.
 */
class ImportExportSituationTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
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
        return ['Matricule', 'Nom', 'Qualification', 'Type de contrat', 'Situation Actuelle'];
    }

    private function import(User $user, array $rows)
    {
        return $this->api($user)->post('/api/worker/import', [
            'file' => $this->excelFile(array_merge([$this->header()], $rows)),
        ], ['Accept' => 'application/json']);
    }

    public function test_le_modele_a_les_colonnes_du_cahier_des_charges_et_les_listes_deroulantes(): void
    {
        $sheet = $this->readExcel($this->api($this->admin())->get('/api/worker/export')->assertOk());

        $this->assertEquals($this->header(), $sheet->rangeToArray('A1:E1')[0]);
        $this->assertEquals(DataValidation::TYPE_LIST, $sheet->getCell('E2')->getDataValidation()->getType());
        $this->assertEquals('"ACTIF,INACTIF"', $sheet->getCell('E2')->getDataValidation()->getFormula1());
        $this->assertEquals('"CDC,TECTRA,ANAPEC,CDI"', $sheet->getCell('D2')->getDataValidation()->getFormula1());
    }

    public function test_tous_les_ouvriers_est_le_modele_rempli_avec_la_liste_actuelle(): void
    {
        Worker::where('registration_number', 'T003')->update(['is_active' => false]);

        $sheet = $this->readExcel($this->api($this->admin())->get('/api/worker/export/all')->assertOk());

        $this->assertEquals($this->header(), array_slice($sheet->rangeToArray('A1:F1')[0], 0, 5));

        $rows = collect($sheet->toArray())->slice(1)->keyBy(0);
        $this->assertEquals(Worker::where('registration_number', 'T001')->first()->resourceRel->name, $rows['T001'][2]);
        $this->assertEquals('ACTIF', $rows['T001'][4]);
        $this->assertEquals('INACTIF', $rows['T003'][4]);
        $this->assertEquals('"ACTIF,INACTIF"', $sheet->getCell('E3')->getDataValidation()->getFormula1());
    }

    public function test_reimporter_corrige_les_ouvriers_par_matricule_sans_doublon(): void
    {
        $count = Worker::count();

        $this->import($this->admin(), [
            ['T003', 'Omar Corrigé', 'Boiseur', 'anapec', 'INACTIF'],
            ['T001', 'Ali', 'Maçon', 'CDI', 'actif'],          // inchangé : pas compté
        ])->assertStatus(201)->assertJsonPath('created', 0)->assertJsonPath('updated', 1);

        $this->assertEquals($count, Worker::count()); // aucun doublon

        $t003 = Worker::where('registration_number', 'T003')->first();
        $this->assertEquals('Omar Corrigé', $t003->name);
        $this->assertEquals('Boiseur', $t003->resourceRel->name);
        $this->assertEquals('ANAPEC', $t003->contract_type);
        $this->assertFalse($t003->is_active);
    }

    public function test_un_nouvel_ouvrier_est_cree_et_vide_veut_dire_actif(): void
    {
        $this->import($this->admin(), [
            ['T400', 'Nouveau Inactif', 'Maçon', 'ANAPEC', 'INACTIF'],
            ['T401', 'Nouveau Actif', 'Maçon', 'CDI', ''],
        ])->assertStatus(201)->assertJsonPath('created', 2);

        $this->assertFalse(Worker::where('registration_number', 'T400')->first()->is_active);
        $this->assertTrue(Worker::where('registration_number', 'T401')->first()->is_active);
    }

    public function test_les_bonnes_lignes_sont_enregistrees_et_toutes_les_erreurs_listees(): void
    {
        $response = $this->import($this->admin(), [
            ['T002', 'Karim', 'Maçon', 'CDI', 'INACTIF'],     // ligne 2 : OK
            ['T402', 'Test', 'Maçon', 'CDI', 'EN CONGE'],     // ligne 3 : situation invalide
            ['T403', 'Test', 'Astronaute', 'CDI', 'ACTIF'],   // ligne 4 : qualification inconnue
            ['T404', 'Test', 'Maçon', 'STAGE', 'ACTIF'],      // ligne 5 : contrat invalide
            ['T002', 'Karim', 'Maçon', 'CDI', 'ACTIF'],       // ligne 6 : matricule en double
        ])->assertStatus(201)->assertJsonPath('updated', 1);

        $errors = collect($response->json('errors'));
        $this->assertEquals([3, 4, 5, 6], $errors->pluck('line')->all());
        $this->assertStringContainsString('ACTIF ou INACTIF', $errors[0]['message']);
        $this->assertStringContainsString('Qualification inconnue', $errors[1]['message']);

        $this->assertFalse(Worker::where('registration_number', 'T002')->first()->is_active); // ligne 2 appliquée
        $this->assertDatabaseMissing('workers', ['registration_number' => 'T402']);
    }

    public function test_un_fichier_sans_aucune_ligne_correcte_est_refuse(): void
    {
        $this->import($this->admin(), [
            ['T405', 'Test', 'Maçon', 'CDI', 'EN CONGE'],
        ])->assertStatus(422)->assertJsonPath('errors.0.line', 2);

        $this->assertDatabaseMissing('workers', ['registration_number' => 'T405']);
    }

    public function test_un_profil_non_rh_ne_peut_pas_mettre_a_jour_en_masse(): void
    {
        $user = $this->makeUser('importeur', [], ['view workers', 'import workers']);

        $this->import($user, [
            ['T002', 'Karim Modifié', 'Maçon', 'CDI', 'INACTIF'],
            ['T406', 'Nouveau', 'Maçon', 'CDI', 'INACTIF'],
        ])->assertStatus(201)->assertJsonPath('updated', 0)->assertJsonPath('created', 1);

        $t002 = Worker::where('registration_number', 'T002')->first();
        $this->assertTrue($t002->is_active);
        $this->assertNotEquals('Karim Modifié', $t002->name);
        $this->assertTrue(Worker::where('registration_number', 'T406')->first()->is_active); // situation ignorée
    }
}
