<?php

namespace Tests\Feature\ExportExcel;

use Tests\JcdTestCase;

/**
 * FEATURE — Téléchargement de l'Export Pointage Détaillé (CDC V3 § 3.2.3 et 3.2.4),
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

    public function test_total_calcule_dans_le_fichier(): void
    {
        $sheet = $this->readExcel($this->download('from=2026-09-26&to=2026-09-28'));

        // Ligne 2 = Ali, hiba, HN : 8 + 0 + 8 ; ligne 3 = HS : 2 + 0 + 2
        $this->assertEquals('=SUM(F2:H2)', $sheet->getCell('I2')->getValue());
        $this->assertEquals(16, $sheet->getCell('I2')->getCalculatedValue());
        $this->assertEquals(4, $sheet->getCell('I3')->getCalculatedValue());
    }

    public function test_nom_de_feuille_et_en_tetes_en_couleur(): void
    {
        $sheet = $this->readExcel($this->download('from=2026-09-26&to=2026-09-28'));

        $this->assertEquals('Pointage_26-sept_au_28-sept', $sheet->getTitle());
        $this->assertEquals('C94D25', substr($sheet->getStyle('A1')->getFill()->getStartColor()->getRGB(), -6));
        $this->assertTrue($sheet->getStyle('A1')->getFont()->getBold());
    }

    public function test_export_par_jour(): void
    {
        $sheet = $this->readExcel($this->download('from=2026-09-28&to=2026-09-28'));

        $this->assertEquals('Pointage_28-sept', $sheet->getTitle());
        $this->assertEquals('28-sept', $sheet->getCell('F1')->getValue());
        $this->assertEquals('TOTAL', $sheet->getCell('G1')->getValue());
    }

    public function test_export_de_plusieurs_chantiers(): void
    {
        $sheet = $this->readExcel($this->download('from=2026-09-26&to=2026-09-28&site_ids[]='
            . $this->siteId('Villa Test') . '&site_ids[]=' . $this->siteId('Symphonie')));

        $sites = collect($sheet->toArray())->slice(1)->pluck(0)->unique()->sort()->values()->all();
        $this->assertEquals(['Symphonie', 'Villa Test'], $sites);
    }
}
