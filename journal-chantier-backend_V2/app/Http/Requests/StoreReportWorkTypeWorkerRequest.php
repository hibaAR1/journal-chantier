<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReportWorkTypeWorkerRequest extends FormRequest
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
            'report_work_type_id' => ['required', 'exists:report_work_type,id'],
            'worker_id' => ['required', Rule::exists('workers', 'id')->where('is_active', true)],
            'normal_hours' => ['nullable', 'numeric'],
            'overtime_hours' => ['nullable', 'numeric'],
        ];
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
