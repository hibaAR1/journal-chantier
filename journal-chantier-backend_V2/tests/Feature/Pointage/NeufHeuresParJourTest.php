<?php

namespace Tests\Feature\Pointage;

use App\Models\Punch;
use App\Models\PunchWorker;
use App\Models\User;
use App\Models\Worker;
use Tests\JcdTestCase;

/**
 * FEATURE — Maximum 9 h normales (HN) par ouvrier et par jour, tous chantiers confondus (CDC V3 § 3.4.2).
 * Données de test : Ali (T001) a 8 h HN à « hiba » le 28/09.
 */
class NeufHeuresParJourTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    private function ali(): Worker
    {
        return Worker::where('registration_number', 'T001')->first();
    }

    private function symphonie28(): Punch
    {
        return Punch::where('site_id', $this->siteId('Symphonie'))->whereDate('date', '2026-09-28')->first();
    }

    private function pointer(Punch $punch, int $hn, int $hs = 0)
    {
        return $this->api($this->admin())->postJson('/api/punch-worker', [
            'worker_id' => $this->ali()->id,
            'punch_id' => $punch->id,
            'type' => $hs > 0 ? 2 : 1,
            'natural_hours' => $hn,
            'overtime_hours' => $hs,
        ]);
    }

    public function test_un_ouvrier_peut_travailler_sur_deux_chantiers_le_meme_jour_jusqu_a_9_heures(): void
    {
        // 8 h à hiba + 1 h à Symphonie = 9 h : accepté
        $this->pointer($this->symphonie28(), 1)->assertStatus(201);
    }

    public function test_au_dela_de_9_heures_le_pointage_est_bloque_avec_une_alerte(): void
    {
        // 8 h à hiba + 2 h à Symphonie = 10 h : refusé
        $response = $this->pointer($this->symphonie28(), 2)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['natural_hours']);

        $message = $response->json('errors.natural_hours.0');
        $this->assertStringContainsString('a déjà 8 h normales le 28/09/2026 (hiba)', $message);
        $this->assertStringContainsString('maximum 1 h possibles ici', $message);
    }

    public function test_les_heures_supplementaires_ne_comptent_pas_dans_la_limite(): void
    {
        // 8 h HN à hiba + 1 h HN et 5 h HS à Symphonie : seules les HN comptent (9 h)
        $this->pointer($this->symphonie28(), 1, 5)->assertStatus(201);
    }

    public function test_un_autre_jour_n_est_pas_compte(): void
    {
        $punch = Punch::create(['site_id' => $this->siteId('Symphonie'), 'date' => '2026-09-29']);

        $this->pointer($punch, 8)->assertStatus(201);
    }

    public function test_modifier_une_ligne_ne_compte_pas_ses_anciennes_heures(): void
    {
        $line = PunchWorker::where('worker_id', $this->ali()->id)
            ->whereHas('punch', fn($q) => $q->whereDate('date', '2026-09-28'))
            ->first();

        $payload = fn($hn) => [
            'worker_id' => $line->worker_id,
            'punch_id' => $line->punch_id,
            'type' => 1,
            'natural_hours' => $hn,
            'overtime_hours' => 0,
        ];

        // 8 h → 9 h : accepté (les 8 h d'avant ne s'ajoutent pas)
        $this->api($this->admin())->putJson('/api/punch-worker/' . $line->id, $payload(9))->assertOk();

        // 9 h → 10 h : refusé
        $this->api($this->admin())->putJson('/api/punch-worker/' . $line->id, $payload(10))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['natural_hours']);
    }

    public function test_un_ouvrier_ne_peut_pas_etre_deux_fois_dans_le_meme_dossier(): void
    {
        $hiba28 = Punch::where('site_id', $this->siteId('hiba'))->whereDate('date', '2026-09-28')->first();

        $this->pointer($hiba28, 1)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['worker_id']);
    }
}
