<?php

namespace App\Http\Requests;

use App\Models\PunchWorker;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePunchWorkerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'worker_id' => 'required|exists:workers,id',
            'punch_id' => 'required|exists:punches,id',
            'type' => 'required|integer|in:1,2,3,4,5,6,7',
            // natural_hours required if type is 1, 2 or 3
            'natural_hours' => 'required_if:type,1,2,3|integer',
            // overtime_hours required if type is 2 or 3
            'overtime_hours' => 'required_if:type,2,3|integer',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) return;

            // Id de la ligne modifiée : la route est /punch-worker/{punch_worker}
            $currentId = $this->route('punch_worker');

            // Le même ouvrier ne peut pas apparaître deux fois dans le même dossier de pointage
            $sameFolder = PunchWorker::where('worker_id', $this->worker_id)
                ->where('punch_id', $this->punch_id)
                ->where('id', '!=', $currentId)
                ->exists();

            if ($sameFolder) {
                $validator->errors()->add('worker_id', "Cet ouvrier est déjà pointé dans ce dossier.");
                return;
            }

            // CDC § 3.4.2 : maximum 9 h normales par jour, tous chantiers confondus
            // (les anciennes heures de la ligne modifiée ne comptent pas)
            $error = PunchWorker::dailyNaturalHoursError($this->worker_id, $this->punch_id, $this->natural_hours ?? 0, $currentId);

            if ($error) {
                $validator->errors()->add('natural_hours', $error);
            }
        });
    }
}
