<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Http\Resources\SupplierResource;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;

class SupplierController extends Controller
{
    private $moduleName = 'Supplier';

    /**
     * Display a listing of the resource.
     */
    public function index() {
        // Return all suppliers
        return SupplierResource::collection(Supplier::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the supplier
        $supplier = Supplier::create($fields);

        // Return new supplier
        return response()->json([
            "supplier" => new SupplierResource($supplier)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find supplier by ID using checkSupplier method
        $supplier = $this->checkSupplier($id);

        if ($supplier) {
            // Return supplier
            return new SupplierResource($supplier);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplierRequest $request, $id) {
        // Find supplier by ID using checkSupplier method
        $supplier = $this->checkSupplier($id);

        if ($supplier) {
            // Validate the request
            $fields = $request->validated();

            // Update the supplier
            $supplier->update($fields);

            // Return updated supplier
            return response()->json(["supplier" => new SupplierResource($supplier)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find supplier by ID using checkSupplier method
        $supplier = $this->checkSupplier($id);

        if ($supplier) {
            // Delete the supplier
            $supplier->delete();

            // Return success message
            return response()->json(['message' => 'Supplier deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkSupplier($id) {
        // Find supplier by ID
        $supplier = Supplier::find($id);

        // Return supplier if found, otherwise return null
        return $supplier ?? null;

    }
}
