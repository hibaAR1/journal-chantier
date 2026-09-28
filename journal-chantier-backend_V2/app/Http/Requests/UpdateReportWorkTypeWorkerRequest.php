<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReportWorkTypeWorkerRequest extends FormRequest
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
            'worker_id' => ['required', 'exists:workers,id'],
            'normal_hours' => ['nullable', 'numeric'],
            'overtime_hours' => ['nullable', 'numeric'],
        ];
    }
}
