<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Create a Category from the Knowledge category selector.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Gate::authorize('create', Category::class);

        $category = $request->user()->categories()->create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Category created successfully.',
        ]);

        // The selector pulls this back in so the new category is selected
        // without a second round trip.
        Inertia::flash('category', $category->only(['id', 'name', 'color', 'icon']));

        return back();
    }
}
