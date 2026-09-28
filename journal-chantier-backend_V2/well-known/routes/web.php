<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web router for your application. These
| router are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', function () {
//    return ['Laravel' => app()->version()];
//});

Route::get('/{any}', function () {
    return response()->json(['status' => 'success', 'message' => 'Welcome to TCGM sites monitoring app'], 200);
})->where('any', '.*');

require __DIR__.'/auth.php';
