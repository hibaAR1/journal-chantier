<?php

namespace Tests\Feature\TableauDeBord;

use Tests\JcdTestCase;

/**
 * FEATURE — Onglet Base de prix du tableau de bord (CDC V3 § 2.5).
 */
class BaseDePrixTest extends JcdTestCase
{
    public function test_moyenne_min_max_et_nombre_de_releves(): void
    {
        $rows = collect($this->api($this->makeUser('direction', ['admin']))
            ->getJson('/api/dashboard/prices')->assertOk()->json('rows'))->keyBy('task');

        $this->assertEquals(1.33, $rows['COFF']['average_unit_time']);
        $this->assertEquals(0.8, $rows['COFF']['min_unit_time']);
        $this->assertEquals(2, $rows['COFF']['max_unit_time']);
        $this->assertEquals(4, $rows['COFF']['readings']);
        $this->assertEquals(0.91, $rows['Maçonnerie']['average_unit_time']);
    }

    public function test_tache_jamais_realisee_visible_avec_0_releve(): void
    {
        $rows = collect($this->api($this->makeUser('direction', ['admin']))
            ->getJson('/api/dashboard/prices')->json('rows'))->keyBy('task');

        $this->assertEquals(0, $rows['Bétonnage']['readings']);
        $this->assertNull($rows['Bétonnage']['average_unit_time']);
    }
}
