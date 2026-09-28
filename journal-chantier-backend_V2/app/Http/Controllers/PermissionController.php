<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Http\Resources\PermissionResource;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;

class PermissionController extends Controller
{
    private $moduleName = 'Permission';

    public function index()
    {
        return PermissionResource::collection(Permission::all());
    }

    public function store(StorePermissionRequest $request)
    {
        $fields = $request->validated();
        
        $permission = Permission::create($fields);

        return response()->json([
            "permission" => new PermissionResource($permission)
        ], 201);
    }

    public function show($id)
    {
        $permission = $this->checkPermission($id);

        if ($permission) {
            return new PermissionResource($permission);
        }

        return $this->errorMessage($this->moduleName);
    }

    public function update(UpdatePermissionRequest $request, $id)
    {
        $permission = $this->checkPermission($id);

        if ($permission) {
            $fields = $request->validated();
            
            $permission->update($fields);

            return response()->json([
                "permission" => new PermissionResource($permission)
            ], 200);
        }

        return $this->errorMessage($this->moduleName);
    }

    public function destroy($id)
    {
        $permission = $this->checkPermission($id);

        if ($permission) {
            $permission->delete();
            return response()->json(['message' => 'Permission deleted'], 200);
        }

        return $this->errorMessage($this->moduleName);
    }

    private function checkPermission($id)
    {
        return Permission::find($id);
    }
} 