<?php

namespace App\Http\Requests;

use App\Models\PunchWorker;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePunchWorkerRequest extends FormRequest
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
            'worker_id' => ['required', Rule::exists('workers', 'id')->where('is_active', true)],
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

            // Le même ouvrier ne peut pas apparaître deux fois dans le même dossier de pointage
            $sameFolder = PunchWorker::where('worker_id', $this->worker_id)
                ->where('punch_id', $this->punch_id)
                ->exists();

            if ($sameFolder) {
                $validator->errors()->add('worker_id', "Cet ouvrier est déjà pointé dans ce dossier.");
                return;
            }

            // CDC § 3.4.2 : un ouvrier peut travailler sur plusieurs chantiers le même jour,
            // mais le total de ses heures normales ne doit pas dépasser 9 h
            $error = PunchWorker::dailyNaturalHoursError($this->worker_id, $this->punch_id, $this->natural_hours ?? 0);

            if ($error) {
                $validator->errors()->add('natural_hours', $error);
            }
        });
    }

    /**
     * Situation Actuelle (CDC § 3.3) : un ouvrier INACTIF ne peut plus être sélectionné.
     */
    public function messages(): array
    {
        return [
            'worker_id.exists' => "Cet ouvrier est INACTIF : il ne peut plus être sélectionné.",
        ];
    }
}
