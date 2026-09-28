<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReportWorkTypeRequest extends FormRequest
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
            'report_id' => ['required', 'exists:reports,id'],
            'work_type_id' => ['required', 'exists:work_types,id'],
            'site_location_id' => ['required', 'exists:site_location,id'],
            'stat_work' => ['nullable', 'numeric'],
            'quantity_completed' => ['nullable', 'numeric'],
            'observations' => ['nullable', 'string'],
//            'number_qualified' => ['nullable', 'integer'],
//            'number_workers' => ['nullable', 'integer'],
//            'number_hours_natural_qualified' => ['nullable', 'integer'],
//            'number_hours_natural_workers' => ['nullable', 'integer'],
//            'number_hours_overtime_qualified' => ['nullable', 'integer'],
//            'number_hours_overtime_workers' => ['nullable', 'integer'],
        ];
    }
}
