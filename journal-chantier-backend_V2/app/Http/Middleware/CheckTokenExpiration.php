<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckTokenExpiration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        $token = $user->currentAccessToken();

        if ($token) {
            $now = Carbon::now();
            $expiresAt = Carbon::parse($token->expires_at);

            if ($now->greaterThan($expiresAt)) {
                $token->delete();
                return response()->json(['message' => 'Token has expired'], 401);
            }

            // Update the expires_at to 30 minutes from now
            $token->expires_at = $now->addMinutes(30);
            $token->save();
        }

        return $next($request);

//        if ($token) {
//
//            if ($token->last_used_at && $now->diffInMinutes($token->last_used_at) > 30) {
//                $token->delete();
//                return response()->json(['message' => 'Token has expired due to inactivity'], 401);
//            }
//        }
//
//        return $next($request);
    }
}
