<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API router for your application. These
| router are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'store']);

Route::middleware(['check.token.expiration', 'auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return new \App\Http\Resources\UserResource($request->user());
    });

    Route::post('/logout', [\App\Http\Controllers\Auth\LogoutController::class, 'store']);

    Route::post('/change-password', [\App\Http\Controllers\Auth\ChangePasswordController::class, 'store']);

    Route::apiResource('users', \App\Http\Controllers\UserController::class)->except(['show', 'destroy']);
    Route::post('users/{user}/reset-password', [\App\Http\Controllers\UserController::class, 'resetPassword']);
    Route::post('users/{user}/set-is-active', [\App\Http\Controllers\UserController::class, 'setIsActive']);
    Route::post('users/{user}/set-is-admin', [\App\Http\Controllers\UserController::class, 'setIsAdmin']);


    Route::apiResource('permissions', \App\Http\Controllers\PermissionController::class)->except(['show', 'destroy']);
    Route::apiResource('roles', \App\Http\Controllers\RoleController::class)->except(['show', 'destroy']);

    Route::apiResource('/clients', \App\Http\Controllers\ClientController::class);

    Route::apiResource('/suppliers', \App\Http\Controllers\SupplierController::class);

    Route::apiResource('/product-categories', \App\Http\Controllers\ProductCategoryController::class);

    Route::apiResource('/products', \App\Http\Controllers\ProductController::class);

    Route::apiResource('/sites', \App\Http\Controllers\SiteController::class);

    Route::apiResource('/works', \App\Http\Controllers\WorkController::class);

    Route::apiResource('/work-types', \App\Http\Controllers\WorkTypeController::class);

    Route::apiResource('/resources', \App\Http\Controllers\ResourceController::class);

    Route::apiResource('/locations', \App\Http\Controllers\LocationController::class);

    Route::apiResource('/site-locations', \App\Http\Controllers\SiteLocationController::class)->only(['store', 'update', 'destroy']);
    Route::get('/site-locations/{site_id}', [\App\Http\Controllers\SiteLocationController::class, 'index']);
    Route::get('/site-locations/show/{site_id}', [\App\Http\Controllers\SiteLocationController::class, 'show']);

    Route::apiResource('/movements', \App\Http\Controllers\MovementController::class);

    Route::apiResource('/workers', \App\Http\Controllers\WorkerController::class);
    Route::get('/worker/export', [\App\Http\Controllers\WorkerController::class, 'export']);
    Route::post('/worker/import', [\App\Http\Controllers\WorkerController::class, 'import']);
    Route::get('/worker/export/all', [\App\Http\Controllers\WorkerController::class, 'exportAll']);

    Route::apiResource('/punches', \App\Http\Controllers\PunchController::class);
    Route::patch('/punches/{id}/validate', [\App\Http\Controllers\PunchController::class, 'validatePunch']);
    Route::patch('/punches/{id}/invalidate', [\App\Http\Controllers\PunchController::class, 'invalidatePunch']);

    Route::apiResource('/punch-worker', \App\Http\Controllers\PunchWorkerController::class)->only(["store", "update", "destroy"]);
    Route::get('/punch-worker/{punch_id}', [\App\Http\Controllers\PunchWorkerController::class, 'index']);
    Route::get('/punch-workers/export/{punch_id}', [\App\Http\Controllers\PunchWorkerController::class, 'export']);
    Route::post('/punch-workers/import', [\App\Http\Controllers\PunchWorkerController::class, 'import']);

    Route::apiResource('/assignments', \App\Http\Controllers\AssignmentController::class);

    Route::apiResource('/assignment-worker', \App\Http\Controllers\AssignmentWorkerController::class)->only(["store", "update", "destroy"]);
    Route::get('/assignment-worker/{assignment_id}', [\App\Http\Controllers\AssignmentWorkerController::class, 'index']);
    Route::get('/assignment-workers/export/{assignment_id}', [\App\Http\Controllers\AssignmentWorkerController::class, 'export']);
    Route::post('/assignment-workers/import', [\App\Http\Controllers\AssignmentWorkerController::class, 'import']);

    Route::apiResource('/reports', \App\Http\Controllers\ReportController::class);
    Route::patch('/reports/{id}/validate', [\App\Http\Controllers\ReportController::class, 'validateReport']);
    Route::patch('/reports/{id}/invalidate', [\App\Http\Controllers\ReportController::class, 'invalidateReport']);
    Route::apiResource('/report-work-type', \App\Http\Controllers\ReportWorkTypeController::class)->only(['store', 'update', 'destroy']);
    Route::get('/report-work-type/{report_id}', [\App\Http\Controllers\ReportWorkTypeController::class, 'index']);
    Route::get('/report-work-type/show/{report_id}', [\App\Http\Controllers\ReportWorkTypeController::class, 'show']);
    Route::get('/reports/{id}/download', [\App\Http\Controllers\ReportController::class, 'downloadReport']);
    Route::get('/reports/{id}/download-excel', [\App\Http\Controllers\ReportController::class, 'downloadReportExcel'])
        ->name('reports.download.excel');

    Route::apiResource('/report-work-type-worker', \App\Http\Controllers\ReportWorkTypeWorkerController::class)->only(['store', 'update', 'destroy']);
    Route::get('/report-work-type-worker/{report_work_type_id}', [\App\Http\Controllers\ReportWorkTypeWorkerController::class, 'index']);

    Route::patch('/report-work-type/{id}/reinstate', [\App\Http\Controllers\ReportWorkTypeController::class, 'reinstate']);
    Route::get('/reports/{id}/is-last', [\App\Http\Controllers\ReportController::class, 'isLast']);
        Route::post('/change-password', [\App\Http\Controllers\Auth\ChangePasswordController::class, 'store']);

    // Tableau de bord journalier (cahier des charges V3 — § 2.2)
    Route::get('/dashboard/daily', [\App\Http\Controllers\DashboardController::class, 'daily']);
    Route::get('/dashboard/history', [\App\Http\Controllers\DashboardController::class, 'history']);
        Route::get('/dashboard/comparison', [\App\Http\Controllers\DashboardController::class, 'comparison']);
       Route::get('/dashboard/prices', [\App\Http\Controllers\DashboardController::class, 'prices']);
        });

