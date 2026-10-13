<?php

namespace Tests\Unit\ExportExcel;

use App\Exports\PunchDetailExport;
use Tests\JcdTestCase;

/**
 * UNIT — Contenu du fichier Excel "Export Pointage Détaillé" (CDC V3 § 3.2).
 * Présentation : MATRICULE | NOM | FONCTION | CHANTIER | HN | HS | DATE,
 * l'agent écrit une seule fois, puis une ligne par jour de la période.
 * Pointages de test : Ali (T001) à hiba le 26, à Villa Test le 27, à hiba le 28.
 */
class FichierExcelTest extends JcdTestCase
{
    private function rows(string $from = '2026-09-26', string $to = '2026-09-28', ?array $siteIds = null)
    {
        return collect((new PunchDetailExport($from, $to, $siteIds))->array());
    }

    /**
     * Les lignes d'un bloc (agent + chantier) : la 1re ligne contient le matricule et le chantier.
     */
    private function block(string $registration, string $site)
    {
        $rows = $this->rows()->values();
        $start = $rows->search(fn($row) => $row[0] === $registration && $row[3] === $site);

        return $rows->slice($start, 3)->values();
    }

    public function test_colonnes_de_l_export(): void
    {
        $this->assertEquals(
            ['MATRICULE', 'NOM', 'FONCTION', 'CHANTIER', 'HN', 'HS', 'DATE'],
            (new PunchDetailExport('2026-09-26', '2026-09-28'))->headings()
        );
    }

    public function test_nom_de_la_feuille_periode_et_jour(): void
    {
        $this->assertEquals('Pointage_26-sept_au_28-sept', (new PunchDetailExport('2026-09-26', '2026-09-28'))->title());
        $this->assertEquals('Pointage_28-sept', (new PunchDetailExport('2026-09-28', '2026-09-28'))->title());
    }

    public function test_une_ligne_par_jour_de_la_periode_sans_en_sauter(): void
    {
        $karim = $this->block('T002', 'hiba');

        $this->assertEquals(['26/09/2026', '27/09/2026', '28/09/2026'], $karim->pluck(6)->all());
    }

    public function test_l_agent_est_ecrit_seulement_sur_la_premiere_ligne(): void
    {
        $karim = $this->block('T002', 'hiba');

        $this->assertEquals(['T002', 'Karim', 'Boiseur', 'hiba'], array_slice($karim[0], 0, 4));
        $this->assertEquals(['', '', '', ''], array_slice($karim[1], 0, 4));
        $this->assertEquals(['', '', '', ''], array_slice($karim[2], 0, 4));
    }

    public function test_agent_qui_change_de_chantier_a_un_bloc_par_chantier(): void
    {
        $chantiers = $this->rows()->filter(fn($row) => $row[0] === 'T001')->pluck(3)->all();

        $this->assertEquals(['hiba', 'Villa Test'], $chantiers);
    }

    public function test_hn_et_hs_sur_la_meme_ligne_et_zero_si_non_pointe(): void
    {
        // Ali à hiba : le 26 (8 + 2), le 27 non pointé, le 28 (8 + 2)
        $hiba = $this->block('T001', 'hiba');
        $this->assertSame([8.0, 2.0], array_slice($hiba[0], 4, 2));
        $this->assertSame([0.0, 0.0], array_slice($hiba[1], 4, 2));
        $this->assertSame([8.0, 2.0], array_slice($hiba[2], 4, 2));

        // Ali à Villa Test : seulement le 27
        $villa = $this->block('T001', 'Villa Test');
        $this->assertSame([0.0, 8.0, 0.0], $villa->pluck(4)->all());
    }

    public function test_filtre_sur_les_chantiers_choisis(): void
    {
        $villa = \App\Models\Site::where('name', 'Villa Test')->value('id');

        $sites = $this->rows('2026-09-26', '2026-09-28', [$villa])->pluck(3)->filter()->unique()->values()->all();
        $this->assertEquals(['Villa Test'], $sites);
    }

    public function test_tous_les_chantiers_si_aucun_filtre(): void
    {
        $this->assertEquals(['Symphonie', 'Villa Test', 'hiba'], $this->rows()->pluck(3)->filter()->unique()->sort()->values()->all());
    }
}
