<?php

namespace Tests\Unit\ExportExcel;

use App\Exports\PunchDetailExport;
use Tests\JcdTestCase;

/**
 * UNIT — Contenu du fichier Excel "Export Pointage Détaillé" (CDC V3 § 3.2.2 et 3.2.3).
 * On teste directement la classe PunchDetailExport, sans passer par l'API.
 * Pointages de test : Ali (T001) à hiba le 26, à Villa Test le 27, à hiba le 28.
 */
class FichierExcelTest extends JcdTestCase
{
    private function rows(string $from = '2026-09-26', string $to = '2026-09-28', ?array $siteIds = null)
    {
        return collect((new PunchDetailExport($from, $to, $siteIds))->array());
    }

    public function test_colonnes_et_une_colonne_par_jour(): void
    {
        $this->assertEquals(
            ['CHANTIER', 'MATRICULE', 'NOM', 'FONCTION', 'HEURES', '26-sept', '27-sept', '28-sept', 'TOTAL'],
            (new PunchDetailExport('2026-09-26', '2026-09-28'))->headings()
        );
    }

    public function test_nom_de_la_feuille_periode_et_jour(): void
    {
        $this->assertEquals('Pointage_26-sept_au_28-sept', (new PunchDetailExport('2026-09-26', '2026-09-28'))->title());
        $this->assertEquals('Pointage_28-sept', (new PunchDetailExport('2026-09-28', '2026-09-28'))->title());
    }

    public function test_deux_lignes_hn_et_hs_par_agent_et_par_chantier(): void
    {
        $karim = $this->rows()->filter(fn($row) => $row[2] === 'Karim')->values();

        $this->assertCount(2, $karim);
        $this->assertEquals(['HN', 'HS'], $karim->pluck(4)->all());
    }

    public function test_agent_qui_change_de_chantier_apparait_sur_plusieurs_blocs(): void
    {
        $ali = $this->rows()->filter(fn($row) => $row[1] === 'T001')->values();

        $this->assertCount(4, $ali);                                            // 2 lignes à hiba + 2 à Villa Test
        $this->assertEquals(['hiba', 'hiba', 'Villa Test', 'Villa Test'], $ali->pluck(0)->all());
        $this->assertEquals('Maçon', $ali[0][3]);                               // FONCTION = qualification
    }

    public function test_zero_si_agent_non_pointe_ce_jour_la_sur_ce_chantier(): void
    {
        $ali = $this->rows()->filter(fn($row) => $row[1] === 'T001')->values();

        $this->assertSame([8.0, 0.0, 8.0], array_slice($ali[0], 5, 3));        // hiba HN : 8, 0, 8
        $this->assertSame([0.0, 8.0, 0.0], array_slice($ali[2], 5, 3));        // Villa Test HN : 0, 8, 0
    }

    public function test_total_est_une_formule_excel(): void
    {
        $first = $this->rows()->first();

        $this->assertEquals('=SUM(F2:H2)', end($first));
    }

    public function test_filtre_sur_les_chantiers_choisis(): void
    {
        $villa = \App\Models\Site::where('name', 'Villa Test')->value('id');

        $this->assertEquals(['Villa Test'], $this->rows('2026-09-26', '2026-09-28', [$villa])->pluck(0)->unique()->values()->all());
    }

    public function test_tous_les_chantiers_si_aucun_filtre(): void
    {
        $this->assertEquals(['Symphonie', 'Villa Test', 'hiba'], $this->rows()->pluck(0)->unique()->sort()->values()->all());
    }
}
