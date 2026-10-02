<?php

namespace Tests\Unit\CodesAutomatiques;

use App\Models\Client;
use App\Models\Location;
use App\Models\Punch;
use App\Models\Report;
use App\Models\Site;
use App\Models\Worker;
use Carbon\Carbon;
use Tests\JcdTestCase;

/**
 * UNIT — Codes automatiques : PRÉFIXE + AAMM + "-" + numéro sur 5 chiffres
 * (ex. POI2610-00001). Le numéro repart à 1 chaque mois.
 */
class CodesAutomatiquesTest extends JcdTestCase
{
    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    public function test_le_code_a_le_bon_format(): void
    {
        Carbon::setTestNow('2026-10-05');

        $location = Location::create(['name' => 'Test']);

        $this->assertMatchesRegularExpression('/^LOC2610-\d{5}$/', $location->code);
    }

    public function test_le_numero_augmente_de_1_a_chaque_creation(): void
    {
        Carbon::setTestNow('2026-10-05');

        $first = Location::create(['name' => 'Un'])->code;
        $second = Location::create(['name' => 'Deux'])->code;

        $this->assertEquals((int) substr($first, -5) + 1, (int) substr($second, -5));
    }

    public function test_le_numero_repart_a_1_le_mois_suivant(): void
    {
        Carbon::setTestNow('2026-10-05');
        Location::create(['name' => 'Octobre 1']);
        Location::create(['name' => 'Octobre 2']);

        Carbon::setTestNow('2026-11-02');
        $this->assertEquals('LOC2611-00001', Location::create(['name' => 'Novembre'])->code);
    }

    public function test_chaque_module_a_son_propre_prefixe_et_son_propre_compteur(): void
    {
        Carbon::setTestNow('2026-12-01');

        $site = Site::create([
            'client_id' => Client::first()->id,
            'project_responsible_id' => 1,
            'worker_id' => 1,
            'name' => 'Nouveau',
            'address' => 'Test',
        ]);

        $this->assertEquals('SIT2612-00001', $site->code);
        $this->assertEquals('POI2612-00001', Punch::create(['site_id' => $site->id, 'date' => '2026-12-01'])->code);
        $this->assertEquals('RPT2612-00001', Report::create(['site_id' => $site->id, 'date' => '2026-12-01'])->code);
        $this->assertEquals('OUV2612-00001', Worker::create([
            'resource_id' => 1, 'name' => 'X', 'contract_type' => 'CDI', 'registration_number' => 'Z1',
        ])->code);
    }
}
