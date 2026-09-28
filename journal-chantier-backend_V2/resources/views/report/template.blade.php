<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Journal Chantier</title>

    <style>
        @font-face {
            font-family: 'Dax-Regular';
            src: url('{{ base_path("public/fonts/Dax-Regular.ttf") }}') format('truetype');
        }

        body {
            font-family: 'Dax-Regular', DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #333;
        }

        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #bfbfbf; padding: 4px; text-align: center; }

        th {
            background: #e8ae89;
            color: #fff;
            font-weight: bold;
            font-size: 10px;
        }

        .task-title {
            background: #f9e8db;
            font-size: 13px;
            padding: 6px;
            font-weight: bold;
            text-align:left;
        }

        .check { font-size: 15px; }
    </style>
</head>

<body>

<!-- HEADER -->
<table style="width:100%; border-bottom:2px solid #C94D25; margin-bottom:20px;">
    <tr>
        <td>
            <img src="{{ base_path('public/logo.svg') }}" style="height:45px;" alt="Logo">
        </td>
        <td style="text-align:right; font-size:11px; font-weight:bold;">
            {{ $dateDownload ?? '' }}
        </td>
    </tr>
</table>

<h2 style="text-align:center; margin:5px 0;">Journal Chantier</h2>
<p style="text-align:center; margin:0 0 15px 0;">
    {{ $report->code ?? '' }} — {{ $report->site->name ?? '' }} — {{ $report->date ?? '' }}
</p>

<!-- AFFICHAGE DE CHAQUE TRAVAIL -->
@foreach($report->groupedWorkTypes() as $workName => $workItems)

    @php
        // Travail = bloc complet (ex: Terrassement)
        $work = $workItems[0]->workType->work;

        // On récupère toutes les tâches de toutes les WorkTypes de ce Travail
       $allTasks = $work->workTypes;
    @endphp

        <!-- TITRE DU TRAVAIL -->
    <div class="task-title">
        Travail : {{ strtoupper($work->name ?? '') }}
    </div>

    <!-- TABLEAU DU TRAVAIL -->
    <table>
        <thead>
        <tr>
            <th rowspan="2">Équipe</th>
            <th rowspan="2">Travaux Réalisés</th>
            <th colspan="2">Ouvriers</th>
            <th rowspan="2">Bloc / Villa</th>
            <th rowspan="2">Emplacement</th>
            <th rowspan="2">Éléments</th>
            <th rowspan="2">État</th>
            <th colspan="2">Nb Heures</th>
            <th rowspan="2">Quantité Realisé</th>
            <th rowspan="2">Temps unitaire</th>
            <th rowspan="2">Observation</th>
        </tr>
        <tr>
            <th>Qualifiés</th>
            <th>Main d’œuvre</th>

            <th>Qualifiés</th>
            <th>Main d’œuvre</th>
        </tr>
        </thead>


        <tbody>
        @foreach(
        $workItems
            ->where('is_reported', false)
        as $index => $tache
    )
            <tr>
                <td>{{ $index + 1 }}</td>

                <!-- TRAVAUX RÉALISÉS (AFFICHAGE DE TOUTES LES TÂCHES DU TRAVAIL) -->
                <td style="text-align:left;">

                    {{-- Tâche originale --}}
                    ☑ {{ $tache->workType->name ?? '' }}

                    {{-- Tâches réintégrées --}}
                    @if(isset($reintegratedTasks[$tache->work_type_id]))

                        @foreach($reintegratedTasks[$tache->work_type_id] as $reintegration)

                            <div style="
                margin-left:15px;
                margin-top:4px;
                color:#C94D25;
                font-size:10px;
            ">
                                ↳ Tache Réintégrée

                                — Qté :
                                {{ $reintegration->quantity_completed ?? 0 }}

                                — Avancement :
                                {{ $reintegration->stat_work ?? 0 }}%
                            </div>

                        @endforeach

                    @endif

                </td>
                <!-- NB OUVRIERS -->
                <td>{{ $tache->qualifiedWorkersCount() }}</td>
                <td>{{ $tache->unqualifiedWorkersCount() }}</td>

                <!-- BLOC / VILLA -->
                <td>{{ $tache->siteLocation->block ?? '' }}</td>

                <!-- EMPLACEMENTS -->
                <td>{{ $tache->siteLocation->location->name ?? '' }}</td>

                <!-- ÉLÉMENTS -->
                <td style="text-align:left;">
                    @if(!empty($tache->siteLocation->element))
                        {{ ucfirst($tache->siteLocation->element) }}
                    @endif
                </td>

                <!-- ÉTAT -->
                <td>
                    @if(($tache->stat_work ?? 0) == 100)
                        ☑ Achevé
                    @else
                        ☑ En cours
                    @endif
                </td>

                <!-- HEURES -->
                <!-- HEURES QUALIFIÉS (CDD/CDI) -->
                <td style="text-align:left;">
                    @php
                        $qualified = $tache->hoursGrouped()->get('qualified')[0] ?? ['hn'=>0,'hs'=>0];
                    @endphp

                    H.N : {{ $qualified['hn'] ?? 0 }} <br>
                    H.S : {{ $qualified['hs'] ?? 0 }}

                </td>


                <!-- HEURES MAIN D’OEUVRE (TECTRA) -->
                <td style="text-align:left;">
                    @php
                        $mo = $tache->hoursGrouped()->get('main_oeuvre')[0] ?? ['hn'=>0,'hs'=>0];
                    @endphp

                    H.N : {{ $mo['hn'] ?? 0 }} <br>
                    H.S : {{ $mo['hs'] ?? 0 }}

                </td>


                <!-- QUANTITÉ -->
                <td>{{ $tache->quantity_completed ?? 0 }}</td>

                <!-- TEMPS UNITAIRE -->
                <td>{{ $tache->unitTime() ?? 0 }}</td>

                <!-- OBSERVATION -->
                <td>{{ $tache->observation ?? '' }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

@endforeach
<!-- SIGNATURE UNIQUE -->
<!-- SIGNATURE UNIQUE ALIGNÉE -->
<table style="width:100%; margin-top:40px;">
    <tr>

        <!-- GAUCHE -->
        <td style="text-align:left; font-size:11px; font-weight:bold; white-space:nowrap;">
            Chef d'équipe principal : ____________________
        </td>

        <!-- CENTRE -->
        <td style="text-align:left; font-size:11px; white-space:nowrap;">
            Le : ...... / ...... / ........
        </td>

        <!-- DROITE -->
        <td style="text-align:right; font-size:12px; white-space:nowrap;">
        </td>

    </tr>
</table>
</body>
</html>
