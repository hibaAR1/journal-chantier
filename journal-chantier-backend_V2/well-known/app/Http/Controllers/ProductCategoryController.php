<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductCategoryRequest;
use App\Http\Requests\UpdateProductCategoryRequest;
use App\Http\Resources\ProductCategoryResource;
use App\Models\ProductCategory;

class ProductCategoryController extends Controller
{
    private $moduleName = 'ProductCategory';

    /**
     * Display a listing of the resource.
     */
    public function index() {
        // Return all product categories
        return ProductCategoryResource::collection(ProductCategory::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductCategoryRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the product category
        $productCategory = ProductCategory::create($fields);

        // Return new product category
        return response()->json([
            "productCategory" => new ProductCategoryResource($productCategory)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find product category by ID using checkProductCategory method
        $productCategory = $this->checkProductCategory($id);

        if ($productCategory) {
            // Return product category
            return new ProductCategoryResource($productCategory);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductCategoryRequest $request, $id) {
        // Find product category by ID using checkProductCategory method
        $productCategory = $this->checkProductCategory($id);

        if ($productCategory) {
            // Validate the request
            $fields = $request->validated();

            // Update the product category
            $productCategory->update($fields);

            // Return updated product category
            return response()->json(["productCategory" => new ProductCategoryResource($productCategory)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find product category by ID using checkProductCategory method
        $productCategory = $this->checkProductCategory($id);

        if ($productCategory) {
            // Delete the product category
            $productCategory->delete();

            // Return success message
            return response()->json(['message' => 'Product category deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkProductCategory($id) {
        // Find product category by ID
        $productCategory = ProductCategory::find($id);

        // Return product category if found, otherwise return null
        return $productCategory ?? null;
    }
}
