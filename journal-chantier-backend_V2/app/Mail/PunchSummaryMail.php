<?php

namespace App\Mail;

use App\Services\PunchSummaryService;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * E-mail "État Récapitulatif Journalier de Pointage" (cahier des charges V3 — § 3.1.5).
 * Objet : [ Journal Chantier ] — État Récapitulatif Journalier de Pointage du JJ/MM/AAAA
 * Pièce jointe : l'état en PDF (tous les chantiers).
 */
class PunchSummaryMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param string $date journée de l'état, au format Y-m-d
     */
    public function __construct(private string $date)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[ Journal Chantier ] — État Récapitulatif Journalier de Pointage du '
                . Carbon::parse($this->date)->format('d/m/Y'),
        );
    }

    public function content(): Content
    {
        $summary = app(PunchSummaryService::class)->build($this->date);

        return new Content(
            view: 'emails.punch-summary',
            with: [
                'date' => Carbon::parse($this->date)->format('d/m/Y'),
                'sites' => count($summary['rows']),
                'total' => $summary['total'],
            ],
        );
    }

    /**
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [
            Attachment::fromData(
                fn() => app(PunchSummaryService::class)->pdf($this->date)->output(),
                'Etat-recapitulatif-pointage-' . Carbon::parse($this->date)->format('d-m-Y') . '.pdf'
            )->withMime('application/pdf'),
        ];
    }
}
