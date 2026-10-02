<?php

namespace Tests\Feature\EnvoiEmail;

use App\Mail\PunchSummaryMail;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Mail;
use Tests\JcdTestCase;

/**
 * FEATURE — Envoi automatique par e-mail de l'état récapitulatif (CDC V3 § 3.1.5).
 * Aucun vrai e-mail n'est envoyé : Mail::fake() intercepte l'envoi.
 */
class EnvoiAutomatiqueTest extends JcdTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Mail::fake();
        config(['punch_summary.recipients' => ['direction@tcgm.test', 'rh@tcgm.test']]);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_la_commande_envoie_l_email_aux_destinataires(): void
    {
        $this->artisan('punch-summary:send', ['--date' => '2026-09-28'])->assertExitCode(0);

        Mail::assertSent(PunchSummaryMail::class, fn(PunchSummaryMail $mail) =>
            $mail->hasTo('direction@tcgm.test') && $mail->hasTo('rh@tcgm.test'));
    }

    public function test_sans_destinataire_la_commande_s_arrete_proprement(): void
    {
        config(['punch_summary.recipients' => []]);

        $this->artisan('punch-summary:send', ['--date' => '2026-09-28'])->assertExitCode(1);
        Mail::assertNothingSent();
    }

    public function test_journee_envoyee_par_defaut_la_veille(): void
    {
        Carbon::setTestNow('2026-09-29 11:00:00');
        config(['punch_summary.day' => 'yesterday']);

        $this->artisan('punch-summary:send')->assertExitCode(0);

        Mail::assertSent(PunchSummaryMail::class, fn($mail) => str_ends_with($mail->envelope()->subject, '28/09/2026'));
    }

    public function test_journee_envoyee_le_jour_meme_si_configure(): void
    {
        Carbon::setTestNow('2026-09-28 20:00:00');
        config(['punch_summary.day' => 'today']);

        $this->artisan('punch-summary:send')->assertExitCode(0);

        Mail::assertSent(PunchSummaryMail::class, fn($mail) => str_ends_with($mail->envelope()->subject, '28/09/2026'));
    }

    public function test_envoi_planifie_chaque_jour_a_l_heure_configuree(): void
    {
        $event = collect(app(Schedule::class)->events())
            ->first(fn($event) => str_contains($event->command, 'punch-summary:send'));

        $this->assertNotNull($event, 'La commande punch-summary:send doit être planifiée');
        $this->assertEquals('0 11 * * *', $event->expression);   // chaque jour à 11:00
    }
}
