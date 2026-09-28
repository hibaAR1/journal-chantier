<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
use App\Mail\UserCreationMail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index() {
        // List of users
        return response()->json(UserResource::collection(User::all()));
    }

    public function store(StoreUserRequest $request) {

        // Hash the password
        $validated = $request->validated();
        // Generate a random password
        $validated['password'] = bcrypt(Str::random(10));

        // Crée l'utilisateur avec $validated
        $user = User::create($validated);

        // Assign the role to the user
        $user->assignRole($request->role);

        // Send a welcome email to the user with the generated password
        //Mail::to($user->email)->send(new UserCreationMail($user, $password));

        // Return the user as a JSON response
        return response()->json(new UserResource($user), 201);
    }

    public function update(UpdateUserRequest $request, $id) {
        $request->merge(['userId' => $id]);

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Mettre à jour les champs validés
        $user->update($request->validated());

        // Mettre à jour le rôle (syncRoles remplace les anciens rôles)
        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        return response()->json(new UserResource($user), 200);
    }

    public function resetPassword($id) {
        // Generate a random password
        $password = Str::random(10);

        // Find the user by ID
        $user = User::find($id);

        // Check if the user exists
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Hash the password
        $user->password = bcrypt($password);

        // Save the user
        $user->save();

        // Send a password reset email to the user with the generated password
        //Mail::to($user->email)->send(new ResetPasswordMail($user, $password));

        // Return a success message
        return response()->json(['password' => $password], 200);
    }

    public function setIsActive($id) {
        // Find the user by ID
        $user = User::find($id);

        // Check if the user exists
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Toggle the is_active field
        $user->is_active = !$user->is_active;

        // Save the user
        $user->save();

        // Return the updated user as a JSON response
        return response()->json(new UserResource($user), 200);
    }

    public function test()
    {
        $users = User::permission('store loans email')->get();

        return response()->json(['users' =>
            $users = User::permission('store loans email')->get()]);
    }
}
