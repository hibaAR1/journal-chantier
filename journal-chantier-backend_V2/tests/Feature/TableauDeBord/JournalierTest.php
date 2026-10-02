<?php

namespace Tests\Feature\TableauDeBord;

use Tests\JcdTestCase;

/**
 * FEATURE — Onglet Journalier du tableau de bord (CDC V3 § 2.2).
 */
class JournalierTest extends JcdTestCase
{
    private function daily(string $query)
    {
        return $this->api($this->makeUser('direction', ['admin']))
            ->getJson('/api/dashboard/daily?site_id=' . $this->siteId('hiba') . $query)
            ->assertOk();
    }

    public function test_indicateurs_du_26_09_sur_hiba(): void
    {
        $this->daily('&date=2026-09-26')
            ->assertJsonPath('indicators.normal_hours', 24)
            ->assertJsonPath('indicators.overtime_hours', 2)
            ->assertJsonPath('indicators.workforce', 3)
            ->assertJsonPath('indicators.tasks_completed', 2)
            ->assertJsonPath('indicators.tasks_total', 2);
    }

    public function test_temps_unitaire_rendement_et_statut_par_tache(): void
    {
        $tasks = collect($this->daily('&date=2026-09-26')->json('tasks'))->keyBy('task');

        // Maçonnerie : 18 h / 16 M2 = 1,13 > TU réf 1 → "Au-dessus de la réf."
        $this->assertEquals(1.13, $tasks['Maçonnerie']['unit_time']);
        $this->assertEquals('above', $tasks['Maçonnerie']['status']);
        // COFF : 8 h / 10 M2 = 0,80 ≤ TU réf 2 → "Conforme" ; rendement = 10 / 8 = 1,25
        $this->assertEquals(0.8, $tasks['COFF']['unit_time']);
        $this->assertEquals('ok', $tasks['COFF']['status']);
        $this->assertEquals(1.25, $tasks['COFF']['performance']);
    }

    public function test_effectif_qualifies_et_main_d_oeuvre_selon_la_qualification(): void
    {
        $categories = collect($this->daily('&date=2026-09-26')->json('workforce_by_category'))->keyBy('category');

        // Ali (Maçon) = qualifié, Omar (Ouvrier travaux) = main d'oeuvre — § 2.6.2
        $this->assertEquals(1, $categories['Travaux de maconnerie et enduit']['qualified']);
        $this->assertEquals(1, $categories['Travaux de maconnerie et enduit']['labour']);
    }

    public function test_sans_date_ouvre_le_dernier_journal_avec_du_travail(): void
    {
        // Le journal du 28/09 contient une tâche reportée sans ouvrier : elle est ignorée
        $this->daily('')
            ->assertJsonPath('date', '2026-09-28')
            ->assertJsonPath('indicators.normal_hours', 16);
    }
}
