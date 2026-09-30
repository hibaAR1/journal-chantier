@extends('emails.template-mz')

@section('paragraph')
    <p
        class="v-color"
        style="
            padding: 50px;
            color: #000000;
            line-height: 140%;
            text-align: left;
            word-wrap: break-word;
            font-weight: normal;
            font-family: Helvetica, sans-serif;
            font-size: 15px;
        "
    >
        Bonjour, <br /><br />

        Veuillez trouver ci-joint l'<strong>État Récapitulatif Journalier de Pointage</strong>
        du <strong>{{ $date }}</strong> pour l'ensemble des chantiers. <br /><br />

        @if ($sites === 0)
            Aucun pointage n'a été saisi pour cette date. <br /><br />
        @else
            <strong>Chantiers pointés :</strong> {{ $sites }} <br />
            <strong>Total heures (HT) :</strong> {{ $total['total_hours'] + 0 }} h
            (HN {{ $total['normal_hours'] + 0 }} h — HS {{ $total['overtime_hours'] + 0 }} h — {{ round($total['overtime_rate']) }}% HS) <br />
            <strong>Effectif total :</strong> {{ $total['workforce'] }}
            (MOD {{ $total['mod'] }} — MOI {{ $total['moi'] }} — {{ round($total['moi_rate']) }}% MOI) <br /><br />
        @endif

        L'état est également consultable à tout moment dans la plateforme Journal Chantier,
        rubrique « État récapitulatif ». <br /><br />

        Cordialement,<br />
        Journal Chantier — envoi automatique
    </p>
@endsection
