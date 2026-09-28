<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;

class ProductController extends Controller
{
    private $moduleName = 'Product';

    /**
 * Display a listing of the resource.
 */
    public function index() {
        // Return all product categories
        return ProductResource::collection(Product::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the product
        $product = Product::create($fields);

        // Return new product
        return response()->json([
            "product" => new ProductResource($product)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find product by ID using checkProduct method
        $product = $this->checkProduct($id);

        if ($product) {
            // Return product
            return new ProductResource($product);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, $id) {
        // Find product by ID using checkProduct method
        $product = $this->checkProduct($id);

        if ($product) {
            // Validate the request
            $fields = $request->validated();

            // Update the product
            $product->update($fields);

            // Return updated product
            return response()->json(["product" => new ProductResource($product)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find product by ID using checkProduct method
        $product = $this->checkProduct($id);

        if ($product) {
            // Delete the product
            $product->delete();

            // Return success message
            return response()->json(['message' => 'Product deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkProduct($id) {
        // Find product by ID
        $product = Product::find($id);

        // Return product if found, otherwise return null
        return $product ?? null;
    }
}
