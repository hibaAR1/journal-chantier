<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'name' => 'required|string',
            'email' => 'nullable|email|unique:users,email,' . $this->user,
            'registration_number' => 'nullable|string|unique:users,registration_number,' . $this->user,
            'phone' => 'nullable|string',
            'username' => 'required|string|unique:users,username,' . $this->user,
            'job' => 'required|string',
            'role' => 'required|string|exists:roles,name',
            'is_active' => 'required|boolean',
        ];
    }
}
