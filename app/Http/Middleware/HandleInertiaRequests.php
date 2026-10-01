<?php

namespace App\Http\Middleware;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            // The category selector is used by the global Quick Capture
            // modal, so every page needs the account's category list.
            'categories' => $this->categories($request),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * Categories owned by the current account, ordered for display.
     *
     * @return array<int, array{id: int, name: string, color: string, icon: string}>
     */
    private function categories(Request $request): array
    {
        if ($request->user() === null) {
            return [];
        }

        return Category::query()
            ->ownedBy($request->user()->id)
            ->orderBy('name')
            ->get(['id', 'name', 'color', 'icon'])
            ->toArray();
    }
}
