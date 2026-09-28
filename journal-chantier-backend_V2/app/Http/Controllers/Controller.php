<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function errorMessage($moduleName, $code = 404)
    {
        if ($code === 404) {
            return response()->json([
                'message' => $moduleName . ' not found'
            ], 404);
        } elseif ($code === 403) {
            return response()->json([
                'message' => 'You are not authorized to access this resource'
            ], 403);
        } else {
            return response()->json([
                'message' => 'Something went wrong'
            ], 500);
        }
    }
}
