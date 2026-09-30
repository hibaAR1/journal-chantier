<?php

/*
|--------------------------------------------------------------------------
| État Récapitulatif Journalier de Pointage — envoi par e-mail (CDC V3 § 3.1.5)
|--------------------------------------------------------------------------
|
| Paramètres modifiables dans le fichier .env (sans toucher au code) :
|
|   PUNCH_SUMMARY_RECIPIENTS="direction@tcgm.ma,rh@tcgm.ma"   ← destinataires, séparés par des virgules
|   PUNCH_SUMMARY_SEND_TIME="11:00"                           ← heure d'envoi automatique (HH:MM)
|   PUNCH_SUMMARY_DAY="yesterday"                             ← journée envoyée : "yesterday" (veille) ou "today"
|
| Après une modification du .env : php artisan config:clear
*/

return [

    // Direction d'Exploitation et Service RH
    'recipients' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('PUNCH_SUMMARY_RECIPIENTS', ''))
    ))),

    'send_time' => env('PUNCH_SUMMARY_SEND_TIME', '11:00'),

    // Envoi à 11h00 → état de la veille (journée clôturée) ; envoi le soir → "today"
    'day' => env('PUNCH_SUMMARY_DAY', 'yesterday'),

];
