<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Punch;
use App\Models\Report;
use App\Observers\ModelActivityObserver;
use Carbon\Carbon;

class AutoValidate extends Command
{ protected $signature = 'autovalidate:punch-report';
    protected $description = 'Auto-validate Punches and Reports older than 7 days if not validated';

    public function handle()
    {
        $this->info("== Début de la validation automatique ==");
        $limitDate = now()->subDays(7);   
        

        // Traitement  Punches
        $punches = Punch::where('validated', false)
            ->where('date', '<=', $limitDate->toDateString())
            ->get();

        foreach ($punches as $punch) {
            $this->info("→ Punch ID #{$punch->id} créé le {$punch->date} sera validé.");

            $punch->validated = true;
            $punch->skipObserver = true; // ne pas logger comme "updated"
            $punch->save();

            ModelActivityObserver::logSystem('validated', $punch); // trace
        }

        //  Traitement  Reports
        $reports = Report::where('validated', false)
            ->where('date', '<=', $limitDate->toDateString())
            ->get();

        foreach ($reports as $report) {
            $this->info("→ Report ID #{$report->id} créé le {$report->date} sera validé.");

            $report->validated = true;
            $report->skipObserver = true;
            $report->save();

            ModelActivityObserver::logSystem('validated', $report);
        }

        $this->info("Validation automatique effectuée avec succès.");
    }
}
