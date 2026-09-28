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

        Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter à votre compte en utilisant les informations suivantes: <br /><br />

        <strong>Identifiant:</strong> {{ $user->username }} <br />
        <strong>Mot de passe:</strong> {{ $password }} <br /><br />

        Pour vous connecter, veuillez cliquer sur le lien ci-dessous: <br /><br />

        <a
            href="http://127.0.0.1:3030"
            style="
                color: #D76A3E;
                text-decoration: none;
                background-color: transparent;
            "
            target="_blank"
        >
            Se connecter
        </a> <br /><br />

        <strong style="color: #cb2323;">NB:</strong> Veuillez changer votre mot de passe après votre première connexion. <br /><br />

        Cordialement,
    </p>
@endsection

