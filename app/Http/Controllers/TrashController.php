<?php

namespace App\Http\Controllers;

use App\Actions\ForceDeleteKnowledge;
use App\Actions\RestoreKnowledge;
use App\Models\Knowledge;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TrashController extends Controller
{
    /**
     * Trash list: the account's trashed Knowledge, newest deleted first
     * (PRD 25, API spec 15).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        abort_if($user === null, 401);

        return Inertia::render('trash/index', [
            'knowledges' => $user->knowledges()
                ->onlyTrashed()
                ->with('categories:id,name,color,icon')
                ->orderByDesc('deleted_at')
                ->orderByDesc('id')
                ->paginate(20),
        ]);
    }

    /**
     * Return a trashed Knowledge to the active list (PRD 25.3).
     */
    public function restore(Knowledge $knowledge, RestoreKnowledge $action): RedirectResponse
    {
        Gate::authorize('restore', $knowledge);

        $action->handle($knowledge);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Knowledge restored successfully.',
        ]);

        return to_route('trash.index');
    }

    /**
     * Permanently delete a trashed Knowledge and its dependent data (PRD 25.4).
     */
    public function forceDelete(Knowledge $knowledge, ForceDeleteKnowledge $action): RedirectResponse
    {
        Gate::authorize('forceDelete', $knowledge);

        $action->handle($knowledge);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Knowledge permanently deleted.',
        ]);

        return to_route('trash.index');
    }
}
