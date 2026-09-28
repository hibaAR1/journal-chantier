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
        Bonjour {{ $user->name }}, <br /><br />

        Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter à votre compte en utilisant les informations suivantes: <br /><br />

        <strong>Identifiant:</strong> {{ $user->username }} <br />
        <strong>Mot de passe:</strong> {{ $password }} <br /><br />

        <strong style="color: #cb2323;">NB:</strong> Veuillez changer votre mot de passe après votre première connexion. <br /><br />

        Cordialement,
    </p>
@endsection

