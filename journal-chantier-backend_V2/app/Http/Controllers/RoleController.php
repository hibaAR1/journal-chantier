<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index() {
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }

    public function store(StoreRoleRequest $request) {
        // Créer un rôle avec guard_name
        $role = Role::create([
            'name' => $request->name,
            'abbreviation' => $request->abbreviation,
            'guard_name' => $request->guard_name ?? 'web',
        ]);

        // Sync permissions uniquement si elles existent et correspondent au guard
        if ($request->has('permissions') && !empty($request->permissions)) {
            $permissions = Permission::whereIn('id', $request->permissions)
                ->where('guard_name', $role->guard_name) // <- important !
                ->get();

            $role->syncPermissions($permissions);
        }

        return response()->json(new RoleResource($role), 201);
    }

    public function update(UpdateRoleRequest $request, $id) {
        $request->merge(['roleId' => $id]);

        $role = Role::find($id);

        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        $role->update($request->validated());

        // Sync permissions si nécessaire (optionnel)
        if ($request->has('permissions') && !empty($request->permissions)) {
            $permissions = Permission::whereIn('id', $request->permissions)
                ->where('guard_name', $role->guard_name)
                ->get();

            $role->syncPermissions($permissions);
        }

        return response()->json(new RoleResource($role), 200);
    }
}
