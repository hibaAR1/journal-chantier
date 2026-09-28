<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
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
            'site_id' => ['required', 'exists:sites,id'],
            'date' => ['required', 'date'],
            'problems' => ['nullable', 'string'],
            'delays' => ['nullable', 'string'],
            'security' => ['nullable', 'string'],
            'validated' => ['nullable', 'boolean'],
        ];
    }
}
