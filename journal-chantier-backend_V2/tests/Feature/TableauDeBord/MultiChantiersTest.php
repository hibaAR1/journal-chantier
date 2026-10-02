<?php

namespace Tests\Feature\TableauDeBord;

use Tests\JcdTestCase;

/**
 * FEATURE — Onglet Multi-chantiers du tableau de bord (CDC V3 § 2.4).
 */
class MultiChantiersTest extends JcdTestCase
{
    private function comparison(string $query = '')
    {
        return $this->api($this->makeUser('direction', ['admin']))
            ->getJson('/api/dashboard/comparison?from=2026-09-28&to=2026-09-28' . $query)
            ->assertOk();
    }

    public function test_heures_par_chantier_du_28_09(): void
    {
        $rows = collect($this->comparison()->json('sites_hours'))->keyBy('site');

        $this->assertEquals(18, $rows['hiba']['total_hours']);
        $this->assertEquals(11.1, $rows['hiba']['overtime_rate']);   // 2 / 18
        $this->assertEquals(16, $rows['Villa Test']['total_hours']);
        $this->assertEquals(8, $rows['Symphonie']['total_hours']);
    }

    public function test_choix_de_plusieurs_chantiers(): void
    {
        $response = $this->comparison('&site_ids[]=' . $this->siteId('hiba') . '&site_ids[]=' . $this->siteId('Villa Test'));

        // 3 chantiers actifs proposés dans le sélecteur, 2 comparés
        $this->assertCount(3, $response->json('active_sites'));
        $this->assertEqualsCanonicalizing(['hiba', 'Villa Test'], collect($response->json('sites'))->pluck('name')->all());
    }

    public function test_comparaison_d_une_tache_avec_tu_de_reference(): void
    {
        $task = $this->comparison()->json('task_comparison');

        $this->assertEquals('COFF', $task['task']);
        $this->assertEquals(2, $task['reference_unit_time']);
        $this->assertEquals(1.5, collect($task['values'])->firstWhere('site', 'hiba')['unit_time']);   // 12 h / 8 M2
    }
}
