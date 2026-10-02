<?php

namespace Tests\Unit\EnvoiEmail;

use App\Mail\PunchSummaryMail;
use App\Services\PunchSummaryService;
use Tests\JcdTestCase;

/**
 * UNIT — PDF et e-mail de l'état récapitulatif (CDC V3 § 3.1.5).
 * On teste directement le PDF et l'e-mail, sans rien envoyer.
 */
class EmailEtatRecapitulatifTest extends JcdTestCase
{
    public function test_le_pdf_est_genere(): void
    {
        $pdf = app(PunchSummaryService::class)->pdf('2026-09-28')->output();

        $this->assertStringStartsWith('%PDF', $pdf);
        $this->assertGreaterThan(1000, strlen($pdf));
    }

    public function test_le_modele_pdf_contient_le_tableau_et_le_total(): void
    {
        $html = view('punch-summary.template', [
            'summary' => app(PunchSummaryService::class)->build('2026-09-28'),
            'generatedAt' => '28/09/2026 11:00',
        ])->render();

        $this->assertStringContainsString('État Récapitulatif Journalier de Pointage', $html);
        $this->assertStringContainsString('Journée du 28/09/2026', $html);
        $this->assertStringContainsString("Main d'oeuvre directe", $html);
        $this->assertStringContainsString('TOTAL', $html);
        $this->assertStringContainsString('<td>77</td>', $html);
    }

    public function test_objet_de_l_email_conforme_au_cahier_des_charges(): void
    {
        $this->assertEquals(
            '[ Journal Chantier ] — État Récapitulatif Journalier de Pointage du 28/09/2026',
            (new PunchSummaryMail('2026-09-28'))->envelope()->subject
        );
    }

    public function test_piece_jointe_pdf(): void
    {
        $attachments = (new PunchSummaryMail('2026-09-28'))->attachments();

        $this->assertCount(1, $attachments);
        $this->assertEquals('Etat-recapitulatif-pointage-28-09-2026.pdf', $attachments[0]->as);
        $this->assertEquals('application/pdf', $attachments[0]->mime);
    }

    public function test_texte_de_l_email_avec_le_resume(): void
    {
        $html = (new PunchSummaryMail('2026-09-28'))->render();

        $this->assertStringContainsString('28/09/2026', $html);
        $this->assertStringContainsString('77 h', $html);
    }
}
