<?php

namespace App\Console\Commands;

use App\Mail\PunchSummaryMail;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

/**
 * Envoi de l'État Récapitulatif Journalier de Pointage par e-mail (cahier des charges V3 — § 3.1.5).
 *
 *   php artisan punch-summary:send                    → journée configurée (veille par défaut)
 *   php artisan punch-summary:send --date=2026-09-28  → une journée précise (test / renvoi)
 *
 * Destinataires, heure et journée : config/punch_summary.php (fichier .env).
 */
class SendPunchSummary extends Command
{
    protected $signature = 'punch-summary:send {--date= : journée à envoyer (AAAA-MM-JJ)}';

    protected $description = "Envoie par e-mail l'État Récapitulatif Journalier de Pointage (PDF en pièce jointe)";

    public function handle(): int
    {
        $recipients = config('punch_summary.recipients');

        if (empty($recipients)) {
            $this->error('Aucun destinataire : renseignez PUNCH_SUMMARY_RECIPIENTS dans le fichier .env');
            return self::FAILURE;
        }

        $date = $this->option('date')
            ? Carbon::parse($this->option('date'))
            : (config('punch_summary.day') === 'today' ? today() : today()->subDay());

        Mail::to($recipients)->send(new PunchSummaryMail($date->format('Y-m-d')));

        $this->info('État du ' . $date->format('d/m/Y') . ' envoyé à : ' . implode(', ', $recipients));

        return self::SUCCESS;
    }
}
