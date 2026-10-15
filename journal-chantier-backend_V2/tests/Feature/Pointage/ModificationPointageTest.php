<?php

namespace Tests\Feature\Pointage;

use App\Models\PunchWorker;
use App\Models\Worker;
use Tests\JcdTestCase;

/**
 * FEATURE — Correction du bug de modification d'une ligne de pointage.
 * Avant : "Cet ouvrier est déjà affecté à un autre chantier à cette date." s'affichait TOUJOURS
 * (la ligne modifiée se trouvait elle-même). Après : seul le vrai doublon est bloqué.
 */
class ModificationPointageTest extends JcdTestCase
{
    private function line(string $registration, string $date): PunchWorker
    {
        return PunchWorker::whereHas('punch', fn($q) => $q->whereDate('date', $date))
            ->where('worker_id', Worker::where('registration_number', $registration)->value('id'))
            ->firstOrFail();
    }

    public function test_on_peut_modifier_les_heures_d_une_ligne_de_pointage(): void
    {
        $ali = $this->line('T001', '2026-09-28');

        $this->api($this->makeUser('magasinier', ['admin']))
            ->putJson('/api/punch-worker/' . $ali->id, [
                'worker_id' => $ali->worker_id,
                'punch_id' => $ali->punch_id,
                'type' => 1,
                'natural_hours' => 8,
                'overtime_hours' => 5,
            ])
            ->assertOk();

        $this->assertEquals(5, $ali->fresh()->overtime_hours);
    }

        public function test_un_ouvrier_deja_pointe_ailleurs_ne_peut_pas_depasser_9_heures(): void
    {
        // Ligne d'Ali à hiba le 28 ; on y met Samir, déjà pointé 8 h à Villa Test le 28 → 8 + 8 = 16 h > 9 h
        $ali = $this->line('T001', '2026-09-28');

        $this->api($this->makeUser('magasinier', ['admin']))
            ->putJson('/api/punch-worker/' . $ali->id, [
                'worker_id' => Worker::where('registration_number', 'T005')->value('id'),
                'punch_id' => $ali->punch_id,
                'type' => 1,
                'natural_hours' => 8,
                'overtime_hours' => 0,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['natural_hours']);
    }
}
