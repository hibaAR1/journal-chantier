<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $date = Carbon::parse($this->date)->format('Y-m-d');

        return [
            'id' => $this->id,
            'code' => $this->code,
            'site_id' => $this->site_id,
            'site_code' => $this->site->code,
            'site_name' => $this->site->name,
            'product_id' => $this->product_id,
            'product_code' => $this->product->code,
            'product_name' => $this->product->name,
            'product_unit' => $this->product->unit,
            'supplier_id' => $this->supplier_id,
            'supplier_code' => $this->supplier->code,
            'supplier_registered_name' => $this->supplier->registered_name,
            'supplier_value' => $this->supplier->code_system . ' - ' .$this->supplier->registered_name,
            'date' => $date,
            'type' => $this->type,
            'quantity' => $this->quantity,
            'coefficient' => $this->coefficient,
            'delivery_num' => $this->delivery_num,
            'receipt_num' => $this->receipt_num,
            'exit_num' => $this->exit_num,
            'transfer_num' => $this->transfer_num,
            'observation' => $this->observation,
        ];
    }
}
