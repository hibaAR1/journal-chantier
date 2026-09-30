<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Location;
use App\Models\Punch;
use App\Models\PunchWorker;
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
 * Données de TEST pour le tableau de bord (cahier des charges V3 — § 2.2 à 2.5).
 *
 *   php artisan db:seed --class=DashboardTestSeeder
 *
 * Crée 3 chantiers (hiba, Villa Test, Symphonie), 7 ouvriers et 5 journaux (26 → 28/09/2026).
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
        $symphonie = $this->site('Symphonie', $client, $user);

        $blocHiba = $this->blocA($hiba);
        $blocVilla = $this->blocA($villa);
        $blocSymphonie = $this->blocA($symphonie);

        // Qualifiés / main d'oeuvre selon la QUALIFICATION (et non le contrat) :
        // Karim est en TECTRA mais Boiseur → qualifié ; Omar est en CDI mais Ouvrier travaux → main d'oeuvre.
        $w = [
            'ali' => $this->worker('Ali', 'T001', 'CDI', 'Maçon'),
            'karim' => $this->worker('Karim', 'T002', 'TECTRA', 'Boiseur'),
            'omar' => $this->worker('Omar', 'T003', 'CDI', 'Ouvrier travaux'),
            'youssef' => $this->worker('Youssef', 'T004', 'TECTRA', 'Ouvrier travaux'),
            'samir' => $this->worker('Samir', 'T005', 'CDI', 'Boiseur'),
            'hamza' => $this->worker('Hamza', 'T006', 'TECTRA', 'Ouvrier travaux'),
            'nabil' => $this->worker('Nabil', 'T007', 'CDI', 'Boiseur'),
        ];

        // TU de référence (Pose volontairement sans référence → "–")
        $maconnerie = $this->workType('Maçonnerie', 1);
        $coff = $this->workType('COFF', 2);
        $pose = $this->workType('Pose', null);
        $enduit = $this->workType('Enduit', null);

        // [tâche, quantité, avancement, [[ouvrier, HN, HS], ...], reportée automatiquement ?]
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
            // Copie automatique d'une tâche inachevée, SANS ouvrier : doit être ignorée par le tableau de bord
            [$enduit, 5, 50, [], true],
        ]);

        $this->report($villa, $blocVilla, '2026-09-28', [
            [$coff, 8, 100, [[$w['samir'], 8, 0]]],
            [$maconnerie, 10, 100, [[$w['hamza'], 8, 0]]],
        ]);

        // Symphonie ne fait que du coffrage → "–" dans la colonne Symphonie pour Maçonnerie
        $this->report($symphonie, $blocSymphonie, '2026-09-28', [
            [$coff, 4, 100, [[$w['nabil'], 8, 0]]],
        ]);

              // Pointages du 28/09 pour l'État Récapitulatif Journalier (§ 3.1) : MOD + MOI (encadrement)
        $w['rachid'] = $this->worker('Rachid', 'T008', 'CDI', 'Chef chantier');
        $w['hassan'] = $this->worker('Hassan', 'T009', 'CDI', 'Magasinier');
        $w['driss'] = $this->worker('Driss', 'T010', 'CDI', 'Caporal');

        // [ouvrier, type, HN, HS] — type 1 = Service normal, 5 = Absent autorisé (non compté)
        $this->punch($hiba, '2026-09-28', [
            [$w['rachid'], 1, 8, 0],
            [$w['ali'], 1, 8, 2],
            [$w['karim'], 1, 8, 2],
            [$w['omar'], 1, 8, 0],
            [$w['hassan'], 1, 8, 0],
            [$w['youssef'], 5, 0, 0],
        ]);

        $this->punch($villa, '2026-09-28', [
            [$w['samir'], 1, 8, 0],
            [$w['hamza'], 1, 8, 1],
            [$w['driss'], 1, 8, 0],
        ]);

        $this->punch($symphonie, '2026-09-28', [
            [$w['nabil'], 1, 8, 0],
        ]);

        // Jours précédents pour l'Export Pointage Détaillé (§ 3.2) :
        // Ali change de chantier (hiba le 26, Villa Test le 27, hiba le 28) → 2 blocs dans l'Excel
        $this->punch($hiba, '2026-09-26', [
            [$w['ali'], 1, 8, 2],
            [$w['karim'], 1, 8, 0],
        ]);

        $this->punch($villa, '2026-09-27', [
            [$w['ali'], 1, 8, 1],
            [$w['samir'], 1, 8, 0],
        ]);

        $this->command?->info('Données de test du tableau de bord créées (hiba, Villa Test, Symphonie — du 26 au 28/09/2026, + pointages du 28/09).');
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

    private function worker(string $name, string $registrationNumber, string $contract, string $qualification): Worker
    {
        // Qualification = ressource de type 1 (main d'oeuvre) : Maçon, Boiseur, Ouvrier travaux…
        $resource = Resource::where('type', 1)->where('name', $qualification)->first()
            ?? Resource::where('type', 1)->first();

        // updateOrCreate : les ouvriers de test retrouvent toujours la bonne qualification
        return Worker::updateOrCreate(
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

        foreach ($tasks as $item) {
            [$workType, $quantity, $progress, $workers] = $item;
            $isReported = $item[4] ?? false;

            $task = ReportWorkType::create([
                'report_id' => $report->id,
                'work_type_id' => $workType->id,
                'site_location_id' => $location->id,
                'stat_work' => $progress,
                'quantity_completed' => $quantity,
                'is_reported' => $isReported,
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

    private function punch(Site $site, string $date, array $workers): void
    {
        $punch = Punch::where('site_id', $site->id)->whereDate('date', $date)->first()
            ?? Punch::create(['site_id' => $site->id, 'date' => $date]);

        // On repart d'un pointage vide pour obtenir toujours les mêmes chiffres
        $punch->punchWorkers()->forceDelete();

        foreach ($workers as [$worker, $type, $normalHours, $overtimeHours]) {
            PunchWorker::create([
                'punch_id' => $punch->id,
                'worker_id' => $worker->id,
                'type' => $type,
                'natural_hours' => $normalHours,
                'overtime_hours' => $overtimeHours,
            ]);
        }
    }
}
