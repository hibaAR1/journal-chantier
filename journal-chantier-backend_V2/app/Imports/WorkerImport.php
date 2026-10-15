<?php

namespace App\Imports;

use App\Models\Resource;
use App\Models\Worker;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

/**
 * Import Excel de la liste du personnel (CDC V3 § 3.3.3).
 *
 * Colonnes : Matricule | Nom | Qualification | Type de contrat | Situation Actuelle
 * (les anciens en-têtes matricule / nom_complet / code_fonction / type_contrat restent acceptés).
 *
 *  - Matricule NOUVEAU  : l'ouvrier est créé (ACTIF si la situation est vide).
 *  - Matricule EXISTANT : mise à jour sans doublon (nom, qualification, contrat, situation)
 *                         → réservé aux profils RH ("manage worker status") ;
 *                         pour les autres, la ligne est ignorée (comme avant).
 *  - Chaque ligne est vérifiée : les lignes correctes sont enregistrées,
 *    les lignes en erreur sont listées dans le rapport (ligne, matricule, message).
 */
class WorkerImport implements ToCollection, WithHeadingRow
{
    public const CONTRACT_TYPES = ['CDC', 'TECTRA', 'ANAPEC', 'CDI'];

    public int $created = 0;
    public int $updated = 0;
    public array $errors = [];

    private bool $canManageStatus;
    private Collection $resources;

    public function __construct()
    {
        $this->canManageStatus = Gate::allows('manage worker status');
    }

    public function collection(Collection $rows)
    {
        // Qualifications : recherche par nom (« Maçon ») ou par code (« RSR… »), sans tenir compte des majuscules
        $this->resources = Resource::all();

        $seen = [];

        foreach ($rows as $index => $row) {
            $line = $index + 2; // numéro de ligne dans Excel (ligne 1 = en-têtes)

            $registration = $this->text($row, ['matricule']);
            $name = $this->text($row, ['nom', 'nom_complet']);
            $qualification = $this->text($row, ['qualification', 'code_fonction']);
            $contract = mb_strtoupper($this->text($row, ['type_de_contrat', 'type_contrat']));
            $situation = mb_strtoupper($this->text($row, ['situation_actuelle']));

            // Ligne vide : ignorée
            if ($registration === '' && $name === '' && $qualification === '' && $contract === '' && $situation === '') {
                continue;
            }

            $messages = [];

            if ($registration === '') {
                $messages[] = 'Le matricule est obligatoire.';
            } elseif (isset($seen[$registration])) {
                $messages[] = "Matricule en double dans le fichier (déjà à la ligne {$seen[$registration]}).";
            }

            if ($name === '') {
                $messages[] = 'Le nom est obligatoire.';
            }

            $resource = $this->findResource($qualification);
            if ($qualification === '') {
                $messages[] = 'La qualification est obligatoire.';
            } elseif (!$resource) {
                $messages[] = "Qualification inconnue : « {$qualification} ».";
            }

            if (!in_array($contract, self::CONTRACT_TYPES, true)) {
                $messages[] = 'Le type de contrat doit être ' . implode(', ', self::CONTRACT_TYPES) . '.';
            }

            if ($situation !== '' && !in_array($situation, ['ACTIF', 'INACTIF'], true)) {
                $messages[] = 'La situation actuelle doit être ACTIF ou INACTIF.';
            }

            if ($messages) {
                $this->errors[] = ['line' => $line, 'registration_number' => $registration, 'message' => implode(' ', $messages)];
                continue;
            }

            $seen[$registration] = $line;

            $fields = [
                'name' => mb_substr($name, 0, 150),
                'resource_id' => $resource->id,
                'contract_type' => $contract,
            ];

            $existing = Worker::where('registration_number', $registration)->first();

            if ($existing) {
                // Mise à jour en masse : réservée aux profils RH
                if (!$this->canManageStatus) {
                    continue;
                }

                if ($situation !== '') {
                    $fields['is_active'] = $situation === 'ACTIF';
                }

                $existing->fill($fields);

                if ($existing->isDirty()) {
                    $existing->save();
                    $this->updated++;
                }

                continue;
            }

            Worker::create($fields + [
                'registration_number' => $registration,
                'is_active' => !($this->canManageStatus && $situation === 'INACTIF'),
            ]);
            $this->created++;
        }
    }

    /**
     * Valeur texte d'une colonne (premier en-tête trouvé parmi les noms acceptés).
     */
    private function text($row, array $keys): string
    {
        foreach ($keys as $key) {
            if (isset($row[$key]) && trim((string) $row[$key]) !== '') {
                return trim((string) $row[$key]);
            }
        }

        return '';
    }

    private function findResource(string $value): ?Resource
    {
        if ($value === '') {
            return null;
        }

        $value = mb_strtolower($value);

        return $this->resources->first(
            fn($resource) => mb_strtolower(trim((string) $resource->name)) === $value
                || mb_strtolower(trim((string) $resource->code)) === $value
        );
    }
}
