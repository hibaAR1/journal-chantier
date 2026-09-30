<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>État Récapitulatif Journalier de Pointage</title>

    <style>
        @page { margin: 20px 20px 30px 20px; }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 9px;
            color: #333;
        }

        h2 { text-align: center; margin: 4px 0 2px 0; font-size: 16px; color: #C94D25; }
        .subtitle { text-align: center; margin: 0 0 12px 0; font-size: 11px; }

        table.summary { width: 100%; border-collapse: collapse; }
        table.summary th, table.summary td { border: 1px solid #bfbfbf; padding: 3px 2px; text-align: center; }

        table.summary th {
            background: #C94D25;
            color: #fff;
            font-weight: bold;
            font-size: 8px;
        }

        /* En-têtes de groupe "Main d'oeuvre directe / indirecte" */
        table.summary th.group { background: #6c2c22; font-size: 9px; }
        table.summary th.trade { font-size: 7px; width: 32px; }

        td.left { text-align: left; }
        tr.total td { background: #f9e8db; font-weight: bold; }
    </style>
</head>

<body>

<!-- EN-TÊTE -->
<table style="width:100%; border-bottom:2px solid #C94D25; margin-bottom:10px;">
    <tr>
        <td style="border:none;">
            <img src="{{ base_path('public/logo.svg') }}" style="height:40px;" alt="Logo">
        </td>
        <td style="border:none; text-align:right; font-size:10px; font-weight:bold;">
            Généré le {{ $generatedAt }}
        </td>
    </tr>
</table>

<h2>État Récapitulatif Journalier de Pointage</h2>
<p class="subtitle">Journée du {{ \Carbon\Carbon::parse($summary['date'])->format('d/m/Y') }}</p>

@if (count($summary['rows']) === 0)
    <p style="text-align:center;">Aucun pointage saisi pour cette date.</p>
@else
    <table class="summary">
        <thead>
        <tr>
            <th rowspan="2">Chantier</th>
            <th rowspan="2">Date</th>
            <th rowspan="2">Chef Chantier</th>
            <th rowspan="2">Heures normales (HN)</th>
            <th rowspan="2">Heures sup. (HS)</th>
            <th rowspan="2">Total heures (HT)</th>
            <th rowspan="2">Taux HS / HT</th>
            <th rowspan="2">Effectif total</th>
            <th rowspan="2">MOD</th>
            <th rowspan="2">MOI</th>
            <th rowspan="2">Taux MOI / Effectif</th>
            <th class="group" colspan="{{ count($summary['trades']['mod']) }}">Main d'oeuvre directe</th>
            <th class="group" colspan="{{ count($summary['trades']['moi']) }}">Main d'oeuvre indirecte</th>
        </tr>
        <tr>
            @foreach ($summary['trades']['mod'] as $trade)
                <th class="trade">{{ $trade }}</th>
            @endforeach
            @foreach ($summary['trades']['moi'] as $trade)
                <th class="trade">{{ $trade }}</th>
            @endforeach
        </tr>
        </thead>

        <tbody>
        @foreach ($summary['rows'] as $row)
            <tr>
                <td class="left"><strong>{{ $row['site'] }}</strong></td>
                <td>{{ \Carbon\Carbon::parse($row['date'])->locale('fr')->isoFormat('dddd') }}-{{ \Carbon\Carbon::parse($row['date'])->format('d/m/Y') }}</td>
                <td class="left">{{ $row['site_manager'] ?? '–' }}</td>
                @include('punch-summary.cells', ['line' => $row, 'trades' => $summary['trades']])
            </tr>
        @endforeach

        <!-- Ligne TOTAL de consolidation -->
        <tr class="total">
            <td colspan="3">TOTAL</td>
            @include('punch-summary.cells', ['line' => $summary['total'], 'trades' => $summary['trades']])
        </tr>
        </tbody>
    </table>
@endif

</body>
</html>
