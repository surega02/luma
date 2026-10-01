<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\KnowledgeController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('/knowledge', [KnowledgeController::class, 'index'])
        ->name('knowledge.index');

    Route::post('/knowledge', [KnowledgeController::class, 'store'])
        ->name('knowledge.store');

    Route::get('/knowledge/{knowledge}', [KnowledgeController::class, 'show'])
        ->name('knowledge.show');

    Route::patch('/knowledge/{knowledge}', [KnowledgeController::class, 'update'])
        ->name('knowledge.update');

    Route::delete('/knowledge/{knowledge}', [KnowledgeController::class, 'destroy'])
        ->name('knowledge.destroy');

    Route::post('/categories', [CategoryController::class, 'store'])
        ->name('categories.store');
});

require __DIR__.'/settings.php';
