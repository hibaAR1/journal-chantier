<?php

namespace Tests\Feature\EtatRecapitulatif;

use App\Models\PunchWorker;
use App\Models\Worker;
use Tests\JcdTestCase;

/**
 * FEATURE — Consultation de l'état récapitulatif dans la plateforme (CDC V3 § 3.1.6).
 */
class ConsultationEtatRecapitulatifTest extends JcdTestCase
{
    public function test_consultation_par_date_tous_les_chantiers(): void
    {
        $response = $this->api($this->makeUser('rh', ['admin']))
            ->getJson('/api/punch-summary?date=2026-09-28')
            ->assertOk();

        $this->assertEquals(['hiba', 'Symphonie', 'Villa Test'], collect($response->json('rows'))->pluck('site')->all());
        $this->assertEquals(77, $response->json('total.total_hours'));
    }

    public function test_consultation_pour_un_chantier_donne(): void
    {
        $response = $this->api($this->makeUser('rh', ['admin']))
            ->getJson('/api/punch-summary?date=2026-09-28&site_id=' . $this->siteId('Villa Test'))
            ->assertOk();

        $this->assertEquals(['Villa Test'], collect($response->json('rows'))->pluck('site')->all());
        $this->assertEquals(25, $response->json('total.total_hours'));
    }

    public function test_mise_a_jour_automatique_apres_modification_d_un_pointage(): void
    {
        $user = $this->makeUser('rh', ['admin']);
        $ali = PunchWorker::whereHas('punch', fn($q) => $q->whereDate('date', '2026-09-28'))
            ->where('worker_id', Worker::where('registration_number', 'T001')->value('id'))
            ->first();

        $this->api($user)->putJson('/api/punch-worker/' . $ali->id, [
            'worker_id' => $ali->worker_id,
            'punch_id' => $ali->punch_id,
            'type' => 1,
            'natural_hours' => 8,
            'overtime_hours' => 5,
        ])->assertOk();

        // Sans aucune autre action : HS hiba 4 → 7, HT 44 → 47
        $this->api($user)
            ->getJson('/api/punch-summary?date=2026-09-28&site_id=' . $this->siteId('hiba'))
            ->assertJsonPath('rows.0.overtime_hours', 7)
            ->assertJsonPath('rows.0.total_hours', 47);
    }
}
