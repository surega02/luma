<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InsightController;
use App\Http\Controllers\KnowledgeController;
use App\Http\Controllers\TrashController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/knowledge', [KnowledgeController::class, 'index'])
        ->name('knowledge.index');

    Route::post('/knowledge', [KnowledgeController::class, 'store'])
        ->name('knowledge.store');

    Route::get('/knowledge/{knowledge}', [KnowledgeController::class, 'show'])
        ->name('knowledge.show');

    Route::get('/knowledge/{knowledge}/definition-history', [KnowledgeController::class, 'definitionHistory'])
        ->name('knowledge.definition-history');

    Route::get('/knowledge/{knowledge}/understanding-history', [KnowledgeController::class, 'understandingHistory'])
        ->name('knowledge.understanding-history');

    Route::post('/knowledge/{knowledge}/insights', [InsightController::class, 'store'])
        ->name('knowledge.insights.store');

    Route::patch('/insights/{insight}', [InsightController::class, 'update'])
        ->name('insights.update');

    Route::delete('/insights/{insight}', [InsightController::class, 'destroy'])
        ->name('insights.destroy');

    Route::patch('/knowledge/{knowledge}', [KnowledgeController::class, 'update'])
        ->name('knowledge.update');

    Route::delete('/knowledge/{knowledge}', [KnowledgeController::class, 'destroy'])
        ->name('knowledge.destroy');

    Route::get('/trash', [TrashController::class, 'index'])
        ->name('trash.index');

    Route::post('/knowledge/{knowledge}/restore', [TrashController::class, 'restore'])
        ->withTrashed()
        ->name('knowledge.restore');

    Route::delete('/knowledge/{knowledge}/force', [TrashController::class, 'forceDelete'])
        ->withTrashed()
        ->name('knowledge.force-delete');

    Route::get('/categories', [CategoryController::class, 'index'])
        ->name('categories.index');

    Route::post('/categories', [CategoryController::class, 'store'])
        ->name('categories.store');

    Route::patch('/categories/{category}', [CategoryController::class, 'update'])
        ->name('categories.update');

    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
        ->name('categories.destroy');
});

require __DIR__.'/settings.php';
