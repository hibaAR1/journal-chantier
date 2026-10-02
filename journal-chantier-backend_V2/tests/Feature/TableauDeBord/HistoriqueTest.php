<?php

namespace Tests\Feature\TableauDeBord;

use Tests\JcdTestCase;

/**
 * FEATURE — Onglet Historique du tableau de bord (CDC V3 § 2.3).
 */
class HistoriqueTest extends JcdTestCase
{
    public function test_quantites_par_unite_et_heures_par_jour(): void
    {
        $response = $this->api($this->makeUser('direction', ['admin']))
            ->getJson('/api/dashboard/history?site_id=' . $this->siteId('hiba') . '&from=2026-09-26&to=2026-09-28')
            ->assertOk();

        $this->assertEquals(['2026-09-26', '2026-09-27', '2026-09-28'], $response->json('days'));
        $this->assertEquals([26, 20, 12], collect($response->json('quantity_by_unit'))->firstWhere('unit', 'M2')['values']);
        $this->assertEquals(2, $response->json('hours_by_day.0.overtime_hours'));
    }

    public function test_quantite_totale_par_tache_sur_la_periode(): void
    {
        $tasks = collect($this->api($this->makeUser('direction', ['admin']))
            ->getJson('/api/dashboard/history?site_id=' . $this->siteId('hiba') . '&from=2026-09-26&to=2026-09-28')
            ->json('quantity_by_task'))->keyBy('task');

        $this->assertEquals(36, $tasks['Maçonnerie']['quantity']);   // 16 + 20
        $this->assertEquals(2, $tasks['Maçonnerie']['lines']);
    }
}
