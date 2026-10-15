<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PunchWorker extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'punch_worker';

    protected $fillable = [
        'punch_id',
        'worker_id',
        'type',
        'natural_hours',
        'overtime_hours',
    ];

    public function worker() {
        return $this->belongsTo(Worker::class);
    }

    public function punch() {
        return $this->belongsTo(Punch::class);
    }

    /**
     * Limite des heures normales (HN) d'un ouvrier par jour, tous chantiers confondus (CDC V3 § 3.4.2).
     */
    public const MAX_DAILY_NATURAL_HOURS = 9;

    /**
     * Vérifie que l'ouvrier ne dépasse pas 9 h normales sur la journée du dossier $punchId
     * (en additionnant ses lignes de pointage sur TOUS les chantiers ce jour-là).
     *
     * $exceptId = ligne en cours de modification (ses anciennes heures ne comptent pas).
     * Retourne null si c'est bon, sinon le message d'alerte.
     */
    public static function dailyNaturalHoursError($workerId, $punchId, $naturalHours, $exceptId = null): ?string
    {
        $punch = Punch::find($punchId);
        $worker = Worker::find($workerId);

        if (!$punch || !$worker) {
            return null;
        }

        $others = self::with('punch.site:id,name')
            ->where('worker_id', $workerId)
            ->when($exceptId, fn($query) => $query->where('id', '!=', $exceptId))
            ->whereHas('punch', fn($query) => $query->whereDate('date', $punch->date))
            ->get();

        $already = (int) $others->sum('natural_hours');
        $total = $already + (int) $naturalHours;

        if ($total <= self::MAX_DAILY_NATURAL_HOURS) {
            return null;
        }

        $max = self::MAX_DAILY_NATURAL_HOURS;
        $date = \Carbon\Carbon::parse($punch->date)->format('d/m/Y');
        $sites = $others->map(fn($line) => $line->punch?->site?->name)->filter()->unique()->implode(', ');
        $left = max($max - $already, 0);

        return "{$worker->name} a déjà {$already} h normales le {$date}" . ($sites ? " ({$sites})" : '')
            . " : maximum {$left} h possibles ici (limite {$max} h par jour, tous chantiers confondus).";
    }

}
