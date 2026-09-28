<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    private $moduleName = 'Client';

    /**
     * Display a listing of the resource.
     */
    public function index() {
        // Return all clients
        return ClientResource::collection(Client::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request) {
        // Validate the request
        $fields = $request->validated();

        // Store the client
        $client = Client::create($fields);

        // Return new client
        return response()->json([
            "client" => new ClientResource($client)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        // Find client by ID using checkClient method
        $client = $this->checkClient($id);

        if ($client) {
            // Return client
            return new ClientResource($client);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, $id) {
        // Find client by ID using checkClient method
        $client = $this->checkClient($id);

        if ($client) {

            // Verifir si le client est lié à un ou plusieurs sites:
            if ($client->sites->count() > 0) {
                return response()->json([
                    'error ' => 'Impossible de modifier ce client car il est lié à un ou plusieurs sites.'
                ], 403);
            }
            // Validate the request
            $fields = $request->validated();

            // Update the client
            $client->update($fields);

            // Return updated client
            return response()->json(["client" => new ClientResource($client)], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        // Find client by ID using checkClient method
        $client = $this->checkClient($id);

        if ($client) {

            //empecher la supprission si le client est affecté a un ou plusieurs sites
            if ($client->sites->count() > 0) {
                return response()->json([
                    'error' => 'Impossible de supprimer ce client car il est lié à un ou plusieurs sites '
                ], 403);
            }
            // Delete the client
            $client->delete();

            // Return success message
            return response()->json(['message' => 'Client deleted'], 200);
        } else {
            // Return error message
            return $this->errorMessage($this->moduleName);
        }
    }

    private function checkClient($id) {
        // Find client by ID
        $client = Client::find($id);

        // Return client if found, otherwise return null
        return $client ?? null;
    }
}
