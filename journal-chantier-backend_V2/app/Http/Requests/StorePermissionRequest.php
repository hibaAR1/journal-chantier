<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
            'abbreviation' => ['required', 'string', 'max:255'],
            'guard_name' => ['required', 'string', 'max:255'],
            'module_name' => 'required|string|max:255',
            'module_abbreviation' => 'required|string|max:255'
        ];
    }
}
