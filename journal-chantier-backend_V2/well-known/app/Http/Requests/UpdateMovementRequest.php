<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMovementRequest extends FormRequest
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
            'product_id' => ['required', 'exists:products,id'],
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'date' => ['required', 'date'],
            'type' => ['required', 'integer', 'in:1,2'],
            'quantity' => ['required', 'numeric', 'min:0'],
            'delivery_num' => ['nullable', 'string', 'max:150'],
            'receipt_num' => ['nullable', 'string', 'max:150'],
            'exit_num' => ['nullable', 'string', 'max:150'],
            'transfer_num' => ['nullable', 'string', 'max:150'],
            'observation' => ['nullable', 'string'],
        ];
    }
}
