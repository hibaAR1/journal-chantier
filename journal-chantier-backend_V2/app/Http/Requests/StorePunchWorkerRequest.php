<?php

namespace App\Http\Requests;

use App\Models\Punch;
use App\Models\PunchWorker;
use Illuminate\Foundation\Http\FormRequest;

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

            $punchId = $this->punch_id;
            $workerId = $this->worker_id;

            $punch = Punch::find($punchId);

            if (!$punch || !$workerId) return;

            $exists = PunchWorker::where('worker_id', $workerId)
                ->where('punch_id', '!=', $punchId)
                ->whereHas('punch', function ($q) use ($punch) {
                    $q->whereDate('date', $punch->date);
                })
                ->exists();

            if ($exists) {
                $validator->errors()->add(
                    'worker_id',
                    "Cet ouvrier est déjà pointé dans un autre chantier à cette date."
                );
            }
        });
    }
}
