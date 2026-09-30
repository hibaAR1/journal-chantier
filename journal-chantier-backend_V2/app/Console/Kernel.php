<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('autovalidate:punch-report')->dailyAt('00:00');

        // État Récapitulatif Journalier de Pointage envoyé par e-mail chaque jour (CDC V3 § 3.1.5)
        // Heure réglable dans le .env : PUNCH_SUMMARY_SEND_TIME="11:00"
        $schedule->command('punch-summary:send')
            ->dailyAt(config('punch_summary.send_time'));

    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
