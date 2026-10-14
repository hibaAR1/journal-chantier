<?php

namespace Tests\Feature\Pointage;

use App\Models\Punch;
use App\Models\PunchWorker;
use App\Models\User;
use App\Models\Worker;
use Tests\JcdTestCase;

/**
 * FEATURE — « Nb Ouvriers » du Dossier de Pointage (CDC V3 § 3.4.1) :
 * seuls les ouvriers réellement actifs (heures pointées > 0) sont comptés.
 */
class NbOuvriersActifsTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    /**
     * Crée un dossier de pointage avec des lignes [matricule, HN, HS].
     */
    private function punchWith(array $lines, string $site = 'hiba', string $date = '2026-09-29'): Punch
    {
        $punch = Punch::create(['site_id' => $this->siteId($site), 'date' => $date]);

        foreach ($lines as [$registration, $natural, $overtime]) {
            PunchWorker::create([
                'punch_id' => $punch->id,
                'worker_id' => Worker::where('registration_number', $registration)->value('id'),
                'type' => 1,
                'natural_hours' => $natural,
                'overtime_hours' => $overtime,
            ]);
        }

        return $punch;
    }

    /**
     * « Nb Ouvriers » affiché pour ce dossier dans la liste des pointages.
     */
    private function nbOuvriers(Punch $punch): int
    {
        $rows = collect($this->api($this->admin())->getJson('/api/punches')->assertOk()->json('data'));

        return $rows->firstWhere('id', $punch->id)['punch_workers_count'];
    }

    public function test_un_ouvrier_pointe_a_0_heure_n_est_pas_compte(): void
    {
        $punch = $this->punchWith([
            ['T001', 8, 0],   // actif
            ['T002', 0, 0],   // pointé à 0 heure : pas compté
        ]);

        $this->assertEquals(1, $this->nbOuvriers($punch));
    }

    public function test_un_ouvrier_avec_seulement_des_heures_sup_est_compte(): void
    {
        $punch = $this->punchWith([
            ['T001', 0, 2],   // 0 HN mais 2 HS : actif
            ['T002', 0, 0],
        ]);

        $this->assertEquals(1, $this->nbOuvriers($punch));
    }

    public function test_aucun_ouvrier_actif_affiche_0(): void
    {
        // Exemple du cahier des charges : CLUB HOUSE affiche 0
        $punch = $this->punchWith([
            ['T001', 0, 0],
            ['T002', 0, 0],
            ['T003', 0, 0],
        ]);

        $this->assertEquals(0, $this->nbOuvriers($punch));
    }

    public function test_les_ouvriers_a_0_heure_restent_dans_le_dossier(): void
    {
        $punch = $this->punchWith([
            ['T001', 8, 0],
            ['T002', 0, 0],
        ]);

        // Le compteur ignore T002, mais la ligne existe toujours dans le dossier
        $this->api($this->admin())->getJson('/api/punch-worker/' . $punch->id)
            ->assertOk()
            ->assertJsonCount(2);
    }
}
