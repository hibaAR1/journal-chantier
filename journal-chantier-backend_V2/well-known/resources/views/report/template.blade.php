<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Journal Chantier</title>
    <style>
        @font-face {
            font-family: 'Dax-Regular';
            src: url('{{ public_path("fonts/Dax-Regular.ttf") }}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        body {
            font-family: 'Dax-Regular', DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #333;
        }

        /* Header style */
        .header-table {
            width: 100%;
            border-bottom: 2px solid #C94D25;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .header-table td {
            vertical-align: middle;
        }
        .logo {
            height: 45px;
        }
        .date-download {
            font-size: 11px;
            font-weight: bold;
            color: #333;
        }

        /* Title */
        h2 {
            text-align: center;
            margin: 10px 0;
            font-size: 18px;
            color: #333;
        }
        p {
            text-align: center;
            margin: 5px 0;
            font-size: 11px;
            color: #555;
        }

        /* Table base */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
            border-radius: 0;
            overflow: hidden;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th {
            background-color: #e8ae89;
            color: #ffffff;
            font-weight: bold;
            padding: 8px;
            text-align: center;
        }
        td {
            padding: 6px;
            text-align: center;
        }
        tr:nth-child(even) {
            background-color: #f9fafb;
        }

        /* Footer table */
        .footer-table {
            margin: 0 0 25px 0;
            border: 1px solid #ddd;
        }
    </style>
</head>
<body>

<table class="header-table">
    <tr>
        <td style="text-align:left;">
            <img src="{{ public_path('logo.svg') }}" alt="Logo" class="logo">
        </td>
        <td style="text-align:right;" class="date-download">
            {{ $dateDownload }}
        </td>
    </tr>
</table>

<h2>Journal Chantier</h2>
<p style="margin-bottom: 20px;">{{ $report->code }} - {{  $report->date}}</p>

@foreach($report->reportWorkTypes as $tache)
    {{-- Titre de la tâche --}}
    <table>
        <thead>
        <tr>
            <th colspan="4" style="text-align: left; background: #f9e8db; color: #000; padding: 8px; font-size: 12px;">
                Tâche : {{ $tache->workType->name }} - {{ $tache->siteLocation->name }}
            </th>
        </tr>
        </thead>
    </table>

    {{-- Tableau des ouvriers --}}
    @if($tache->reportWorkTypeWorkers->count() > 0)
        <table>
            <thead>
            <tr style="background: #ddd;">
                <th style="border: 1px solid #999; padding: 6px;">Ouvrier</th>
                <th style="border: 1px solid #999; padding: 6px;">Matricule</th>
                <th style="border: 1px solid #999; padding: 6px;">Heures normales</th>
                <th style="border: 1px solid #999; padding: 6px;">Heures supplémentaires</th>
            </tr>
            </thead>
            <tbody>
            @foreach($tache->reportWorkTypeWorkers as $worker)
                <tr>
                    <td style="border: 1px solid #ccc; padding: 6px;">{{ $worker->worker->name }}</td>
                    <td style="border: 1px solid #ccc; padding: 6px;">{{ $worker->worker->registration_number }}</td>
                    <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">{{ $worker->normal_hours }}</td>
                    <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">{{ $worker->overtime_hours }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @endif

    {{-- Pied de tableau --}}
    <table class="footer-table">
        <thead>
        <tr>
            <th>État du travail</th>
            <th>Quantité réalisée</th>
            <th>Temps unitaire</th>
            <th>Rendement</th>
            <th>Nombre ouvriers</th>
            <th>Total heures normales</th>
            <th>Total heures supplémentaires</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>{{ $tache->stat_work }}</td>
            <td>{{ $tache->quantity_completed }}</td>
            <td>{{ $tache->unitTime() ?? '--' }}</td>
            <td>{{ $tache->rendement() ?? '--' }}</td>
            <td>{{ $tache->reportWorkTypeWorkers->count() }}</td>
            <td>{{ $tache->reportWorkTypeWorkers->sum('normal_hours') }}</td>
            <td>{{ $tache->reportWorkTypeWorkers->sum('overtime_hours') }}</td>
        </tr>
        </tbody>
    </table>
@endforeach

</body>
</html>
