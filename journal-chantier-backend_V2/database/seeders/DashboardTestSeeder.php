<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Location;
use App\Models\Report;
use App\Models\ReportWorkType;
use App\Models\ReportWorkTypeWorker;
use App\Models\Resource;
use App\Models\Site;
use App\Models\SiteLocation;
use App\Models\User;
use App\Models\Worker;
use App\Models\WorkType;
use Illuminate\Database\Seeder;

/**
 * Données de TEST pour le tableau de bord (cahier des charges V3 — § 2.2 à 2.4).
 *
 *   php artisan db:seed --class=DashboardTestSeeder
 *
 * Crée 2 chantiers (hiba, Villa Test), 6 ouvriers et 4 journaux (26 → 28/09/2026).
 * Peut être relancé sans risque : les journaux de test sont vidés puis recréés à l'identique.
 * ⚠️ À utiliser uniquement en local, jamais sur la base de production.
 */
class DashboardTestSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('username', 'llouktam')->first() ?? User::first();

        $client = Client::firstOrCreate(
            ['code_system' => 'CLI-TEST'],
            ['registered_name' => 'Client Test']
        );

        $hiba = $this->site('hiba', $client, $user);
        $villa = $this->site('Villa Test', $client, $user);

        $blocHiba = $this->blocA($hiba);
        $blocVilla = $this->blocA($villa);

        // Ouvriers : CDI / CDC = qualifiés, TECTRA = main d'oeuvre
        $w = [
            'ali' => $this->worker('Ali', 'T001', 'CDI'),
            'karim' => $this->worker('Karim', 'T002', 'CDC'),
            'omar' => $this->worker('Omar', 'T003', 'TECTRA'),
            'youssef' => $this->worker('Youssef', 'T004', 'TECTRA'),
            'samir' => $this->worker('Samir', 'T005', 'CDI'),
            'hamza' => $this->worker('Hamza', 'T006', 'TECTRA'),
        ];

        // TU de référence (Pose volontairement sans référence → "–")
        $maconnerie = $this->workType('Maçonnerie', 1);
        $coff = $this->workType('COFF', 2);
        $pose = $this->workType('Pose', null);

        // [tâche, quantité, avancement, [[ouvrier, HN, HS], ...]]
        $this->report($hiba, $blocHiba, '2026-09-26', [
            [$maconnerie, 16, 100, [[$w['ali'], 8, 2], [$w['omar'], 8, 0]]],
            [$coff, 10, 100, [[$w['karim'], 8, 0]]],
        ]);

        $this->report($hiba, $blocHiba, '2026-09-27', [
            [$maconnerie, 20, 100, [[$w['ali'], 8, 0], [$w['omar'], 8, 0]]],
            [$pose, 180, 100, [[$w['youssef'], 8, 1]]],
        ]);

        $this->report($hiba, $blocHiba, '2026-09-28', [
            [$coff, 12, 100, [[$w['karim'], 8, 2], [$w['omar'], 8, 0]]],
        ]);

        $this->report($villa, $blocVilla, '2026-09-28', [
            [$coff, 8, 100, [[$w['samir'], 8, 0]]],
            [$maconnerie, 10, 100, [[$w['hamza'], 8, 0]]],
        ]);

        $this->command?->info('Données de test du tableau de bord créées (hiba + Villa Test, du 26 au 28/09/2026).');
    }

    private function site(string $name, Client $client, User $user): Site
    {
        return Site::firstOrCreate(
            ['name' => $name],
            [
                'client_id' => $client->id,
                'project_responsible_id' => $user->id,
                'worker_id' => $user->id,
                'address' => 'Adresse de test',
            ]
        );
    }

    private function blocA(Site $site): SiteLocation
    {
        return SiteLocation::firstOrCreate(
            ['site_id' => $site->id, 'block' => 'Bloc A'],
            ['location_id' => Location::first()->id, 'element' => 'Voile']
        );
    }

    private function worker(string $name, string $registrationNumber, string $contract): Worker
    {
        // Ressource de type 1 = main d'oeuvre
        $resource = Resource::where('type', 1)->first() ?? Resource::first();

        return Worker::firstOrCreate(
            ['registration_number' => $registrationNumber],
            ['name' => $name, 'contract_type' => $contract, 'resource_id' => $resource->id]
        );
    }

    private function workType(string $name, ?float $referenceUnitTime): WorkType
    {
        $workType = WorkType::where('name', $name)->firstOrFail();
        $workType->t_u = $referenceUnitTime;
        $workType->save();

        return $workType;
    }

    private function report(Site $site, SiteLocation $location, string $date, array $tasks): void
    {
        $report = Report::where('site_id', $site->id)->whereDate('date', $date)->first()
            ?? Report::create(['site_id' => $site->id, 'date' => $date]);

        // On repart d'un journal vide pour obtenir toujours les mêmes chiffres
        foreach ($report->reportWorkTypes()->get() as $existing) {
            $existing->reportWorkTypeWorkers()->forceDelete();
            $existing->forceDelete();
        }

        foreach ($tasks as [$workType, $quantity, $progress, $workers]) {
            $task = ReportWorkType::create([
                'report_id' => $report->id,
                'work_type_id' => $workType->id,
                'site_location_id' => $location->id,
                'stat_work' => $progress,
                'quantity_completed' => $quantity,
            ]);

            foreach ($workers as [$worker, $normalHours, $overtimeHours]) {
                ReportWorkTypeWorker::create([
                    'report_work_type_id' => $task->id,
                    'worker_id' => $worker->id,
                    'normal_hours' => $normalHours,
                    'overtime_hours' => $overtimeHours,
                ]);
            }
        }
    }
}
