<?php

namespace App\Http\Controllers;

use App\Models\Movement;
use App\Http\Resources\MovementResource;
use App\Http\Requests\StoreMovementRequest;
use App\Http\Requests\UpdateMovementRequest;
use Carbon\Carbon;

class MovementController extends Controller
{
    private $moduleName = 'Movement';

    /**
     * Display a listing of the resource.
     */
    public function index() {
        // Return all movements
        return MovementResource::collection(Movement::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMovementRequest $request) {
        // Validate the request
        $fields = $request->validated();

        $fields['date'] = Carbon::parse($fields['date'])->format('Y-m-d');

        $fields['coefficient'] = match ($fields['type']) {
            1 => 1,  // entry
            2 => -1, // exit
            3 => -1, // transfer (treated as exit)
            default => 1,
        };

        // Store the movement
        $movement = Movement::create($fields);

        // Return new movement
        return response()->json([
            "movement" => new MovementResource($movement)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find movement by ID using checkMovement method
        $movement = $this->checkMovement($id);

        if ($movement) {
            // Return movement
            return new MovementResource($movement);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMovementRequest $request, $id) {
        // Find movement by ID using checkMovement method
        $movement = $this->checkMovement($id);

        if ($movement) {
            // Validate the request
            $fields = $request->validated();

            $fields['date'] = Carbon::parse($fields['date'])->format('Y-m-d');

            $fields['coefficient'] = $fields["type"] == 1 ? 1 : -1;

            // Update the movement
            $movement->update($fields);

            // Return updated movement
            return response()->json(["movement" => new MovementResource($movement)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find movement by ID using checkMovement method
        $movement = $this->checkMovement($id);

        if ($movement) {
            // Delete the movement
            $movement->delete();

            // Return success message
            return response()->json(['message' => 'Movement deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkMovement($id) {
        // Find movement by ID
        $movement = Movement::find($id);

        // Return movement if found, otherwise return null
        return $movement ?? null;

    }
}
