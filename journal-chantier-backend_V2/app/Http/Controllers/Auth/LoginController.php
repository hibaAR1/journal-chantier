<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        $login = strtolower($request->login);
        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->orWhere('registration_number', $login)
            ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Ces identifiants ne correspondent pas à nos enregistrements.'],
            ]);
        } else if (! $user->is_active) {
            throw ValidationException::withMessages([
                'login' => ['Votre compte a été désactivé.'],
            ]);
        }

        $tokenResult = $user->createToken($request->login);
        $token = $tokenResult->plainTextToken;

        // Set the expires_at attribute to 30 minutes from now
        $expiresAt = Carbon::now()->addMinutes(30);
        $user->tokens()->where('id', $tokenResult->accessToken->id)->update(['expires_at' => $expiresAt]);

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token
        ], 200);
    }
}
