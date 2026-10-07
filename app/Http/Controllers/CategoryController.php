<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Allow-listed sort keys for the Categories list (PRD 16.1).
     *
     * @var list<string>
     */
    private const SORTS = ['az', 'newest', 'most_knowledge'];

    /**
     * Category list with the knowledge count each row needs for display
     * and for the delete confirmation copy.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        abort_if($user === null, 401);

        $sort = $this->sort($request->query('sort'));

        $categories = Category::query()
            ->ownedBy($user->id)
            ->withCount([
                'knowledge as knowledge_count' => fn ($query) => $query
                    ->where('knowledges.user_id', $user->id)
                    ->whereNull('knowledges.deleted_at'),
            ])
            ->when($sort === 'newest', fn ($query) => $query->orderBy('created_at', 'desc')->orderBy('id', 'desc'))
            ->when($sort === 'most_knowledge', fn ($query) => $query->orderBy('knowledge_count', 'desc')->orderBy('name'))
            ->when($sort === 'az', fn ($query) => $query->orderBy('name'))
            ->get(['id', 'name', 'color', 'icon', 'created_at']);

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'sorting' => ['current' => $sort],
        ]);
    }

    /**
     * Create a Category from the Categories page or the Knowledge selector.
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

    /**
     * Rename a Category and swap its colour or icon.
     */
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        Gate::authorize('update', $category);

        $category->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Category updated successfully.',
        ]);

        return redirect()->route('categories.index');
    }

    /**
     * Remove a Category. The Knowledge it was attached to is untouched,
     * it simply falls back to Uncategorized (PRD 16.2).
     */
    public function destroy(Category $category): RedirectResponse
    {
        Gate::authorize('delete', $category);

        DB::transaction(function () use ($category) {
            $category->knowledge()->detach();
            $category->delete();
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Category deleted successfully.',
        ]);

        return redirect()->route('categories.index');
    }

    private function sort(mixed $raw): string
    {
        return is_string($raw) && in_array($raw, self::SORTS, true)
            ? $raw
            : 'az';
    }
}
