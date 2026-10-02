<?php

namespace Tests\Unit\EtatRecapitulatif;

use App\Models\PunchWorker;
use App\Models\Worker;
use App\Services\PunchSummaryService;
use Tests\JcdTestCase;

/**
 * UNIT — Calculs de l'État Récapitulatif Journalier de Pointage (CDC V3 § 3.1.2 à 3.1.4).
 * On teste directement le service PunchSummaryService, sans passer par l'API.
 * Pointages de test du 28/09/2026 : hiba (6 lignes dont 1 absent), Villa Test (3), Symphonie (1).
 */
class CalculEtatRecapitulatifTest extends JcdTestCase
{
    private function summary(): array
    {
        return app(PunchSummaryService::class)->build('2026-09-28');
    }

    private function hiba(): array
    {
        return collect($this->summary()['rows'])->firstWhere('site', 'hiba');
    }

    public function test_heures_hn_hs_ht_et_taux_hs_ht(): void
    {
        $hiba = $this->hiba();

        $this->assertEquals(40, $hiba['normal_hours']);
        $this->assertEquals(4, $hiba['overtime_hours']);
        $this->assertEquals(44, $hiba['total_hours']);            // HT = HN + HS
        $this->assertEquals(9.09, $hiba['overtime_rate']);        // HS / HT x 100
    }

    public function test_mod_moi_effectif_et_taux_moi(): void
    {
        $hiba = $this->hiba();

        $this->assertEquals(3, $hiba['mod']);                     // Maçon + Boiseur + Ouvrier travaux
        $this->assertEquals(2, $hiba['moi']);                     // Chef chantier + Magasinier
        $this->assertEquals(5, $hiba['workforce']);               // Effectif = MOD + MOI
        $this->assertEquals(40, $hiba['moi_rate']);               // MOI / Effectif x 100
    }

    public function test_absents_malades_et_licencies_ne_sont_pas_comptes(): void
    {
        // Youssef est "Absent autorisé" (type 5) : effectif 5 et non 6
        $this->assertEquals(5, $this->hiba()['workforce']);

        // Absent non autorisé (6), Malade (7), Licencié (4) : toujours pas compté
        foreach ([6, 7, 4] as $type) {
            PunchWorker::where('worker_id', Worker::where('registration_number', 'T004')->value('id'))->update(['type' => $type]);
            $this->assertEquals(5, $this->hiba()['workforce']);
        }
    }

    public function test_detail_par_metier_et_chef_de_chantier(): void
    {
        $hiba = $this->hiba();

        $this->assertEquals(1, $hiba['mod_detail']['Maçon']);
        $this->assertEquals(1, $hiba['mod_detail']['Boiseur']);
        $this->assertEquals(1, $hiba['mod_detail']['Ouvrier travaux']);
        $this->assertEquals(1, $hiba['moi_detail']['Chef chantier']);
        $this->assertEquals(1, $hiba['moi_detail']['Magasinier']);
        $this->assertEquals('Rachid', $hiba['site_manager']);
    }

    public function test_colonnes_metiers_du_cahier_des_charges(): void
    {
        $trades = $this->summary()['trades'];

        $this->assertEquals(['Ouvrier travaux', 'Boiseur', 'Maçon', 'Ferrailleur', 'Poseur', 'Traceur', 'Plâtrier', 'Grutier'], $trades['mod']);
        $this->assertEquals([
            'Chef chantier', "Chef d'équipe travaux", 'Magasinier', 'Chef ferrailleur', 'Caporal',
            'Conducteur BOBCAT', 'Conducteur MANITOU', 'Conducteur JCB', 'Chauffeur chargeuse',
        ], $trades['moi']);
    }

    public function test_ligne_total_de_consolidation(): void
    {
        $total = $this->summary()['total'];

        $this->assertEquals(72, $total['normal_hours']);
        $this->assertEquals(5, $total['overtime_hours']);
        $this->assertEquals(77, $total['total_hours']);
        $this->assertEquals(6.49, $total['overtime_rate']);       // recalculé sur les totaux
        $this->assertEquals(9, $total['workforce']);
        $this->assertEquals(33.33, $total['moi_rate']);
        $this->assertEquals(3, $total['mod_detail']['Boiseur']);
    }

    public function test_journee_sans_pointage_pas_de_division_par_zero(): void
    {
        $summary = app(PunchSummaryService::class)->build('2026-09-01');

        $this->assertCount(0, $summary['rows']);
        $this->assertEquals(0, $summary['total']['total_hours']);
        $this->assertEquals(0, $summary['total']['overtime_rate']);
        $this->assertEquals(0, $summary['total']['moi_rate']);
    }
}
