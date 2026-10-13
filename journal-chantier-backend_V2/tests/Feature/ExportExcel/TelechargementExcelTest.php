<?php

namespace Tests\Feature\ExportExcel;

use Tests\JcdTestCase;

/**
 * FEATURE — Téléchargement de l'Export Pointage Détaillé (CDC V3 § 3.2),
 * comme le fait le bouton "Exporter Excel" de la page Pointages.
 */
class TelechargementExcelTest extends JcdTestCase
{
    private function download(string $query)
    {
        return $this->api($this->makeUser('rh', ['human_resources_responsible']))
            ->get('/api/punch-details/export?' . $query)
            ->assertOk();
    }

    public function test_fichier_xlsx_et_nom_du_fichier(): void
    {
        $response = $this->download('from=2026-09-26&to=2026-09-28');

        $this->assertStringContainsString('Pointage_detaille_2026-09-26_au_2026-09-28.xlsx', $response->headers->get('content-disposition'));
        $this->assertStringContainsString('spreadsheetml', $response->headers->get('content-type'));
    }

    public function test_presentation_une_ligne_par_jour(): void
    {
        $sheet = $this->readExcel($this->download('from=2026-09-26&to=2026-09-28'));

        // Ligne 2 : Ali (T001) à hiba le 26/09 ; lignes 3 et 4 : les jours suivants, sans répéter l'agent
        $this->assertEquals(['MATRICULE', 'NOM', 'FONCTION', 'CHANTIER', 'HN', 'HS', 'DATE'], $sheet->rangeToArray('A1:G1')[0]);
        $this->assertEquals(['T001', 'Ali', 'Maçon', 'hiba', 8, 2, '26/09/2026'], $sheet->rangeToArray('A2:G2')[0]);
        $this->assertEquals(['', '', '', '', 0, 0, '27/09/2026'], array_map(fn($v) => $v ?? '', $sheet->rangeToArray('A3:G3')[0]));
        $this->assertEquals('28/09/2026', $sheet->getCell('G4')->getValue());
    }

    public function test_nom_de_feuille_et_en_tetes_en_couleur(): void
    {
        $sheet = $this->readExcel($this->download('from=2026-09-26&to=2026-09-28'));

        $this->assertEquals('Pointage_26-sept_au_28-sept', $sheet->getTitle());
        $this->assertEquals('C94D25', substr($sheet->getStyle('A1')->getFill()->getStartColor()->getRGB(), -6));
        $this->assertTrue($sheet->getStyle('A1')->getFont()->getBold());
        $this->assertTrue($sheet->getStyle('A2')->getFont()->getBold());   // 1re ligne de l'agent en gras
    }

    public function test_export_par_jour(): void
    {
        $sheet = $this->readExcel($this->download('from=2026-09-28&to=2026-09-28'));

        $this->assertEquals('Pointage_28-sept', $sheet->getTitle());
        // Un seul jour : une ligne par agent
        $this->assertEquals(['28/09/2026'], collect($sheet->toArray())->slice(1)->pluck(6)->unique()->values()->all());
    }

    public function test_export_de_plusieurs_chantiers(): void
    {
        $sheet = $this->readExcel($this->download('from=2026-09-26&to=2026-09-28&site_ids[]='
            . $this->siteId('Villa Test') . '&site_ids[]=' . $this->siteId('Symphonie')));

        $sites = collect($sheet->toArray())->slice(1)->pluck(3)->filter()->unique()->sort()->values()->all();
        $this->assertEquals(['Symphonie', 'Villa Test'], $sites);
    }
}
