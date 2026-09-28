<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int)$this->id,
            'product_category_id' => (int)$this->product_category_id,
            'product_category_code' => $this->productCategory->code,
            'product_category_name' => $this->productCategory->name,
            'name' => $this->name,
            'unit' => $this->unit,
            'code' => $this->code,
        ];
    }
}
