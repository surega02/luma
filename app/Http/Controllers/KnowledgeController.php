<?php

namespace App\Http\Controllers;

use App\Actions\CreateKnowledge;
use App\Actions\UpdateKnowledge;
use App\Http\Requests\Knowledge\StoreKnowledgeRequest;
use App\Http\Requests\Knowledge\UpdateKnowledgeRequest;
use App\Models\Knowledge;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class KnowledgeController extends Controller
{
    /**
     * List the authenticated user's active Knowledge, newest first.
     */
    public function index(Request $request): Response
    {
        $userId = $request->user()?->id;

        return Inertia::render('knowledge/index', [
            'knowledge' => Knowledge::query()
                ->ownedBy($userId)
                ->with('categories:id,name,color,icon')
                ->latest()
                ->paginate(50)
                ->withQueryString(),
        ]);
    }

    /**
     * Show a single Knowledge record in PRD display order.
     */
    public function show(Knowledge $knowledge): Response
    {
        Gate::authorize('view', $knowledge);

        $knowledge->load([
            'categories:id,name,color,icon',
            'insights' => fn ($query) => $query->latest(),
            'definitionVersions',
            'understandingVersions',
        ]);

        return Inertia::render('knowledge/show', [
            'knowledge' => $knowledge,
        ]);
    }

    /**
     * Persist a new Knowledge record from Quick Capture.
     */
    public function store(StoreKnowledgeRequest $request, CreateKnowledge $action): RedirectResponse
    {
        Gate::authorize('create', Knowledge::class);

        $action->handle($request->user(), $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Knowledge created successfully.',
        ]);

        return to_route('knowledge.index');
    }

    /**
     * Persist edits and append version history.
     */
    public function update(UpdateKnowledgeRequest $request, Knowledge $knowledge, UpdateKnowledge $action): RedirectResponse
    {
        Gate::authorize('update', $knowledge);

        $action->handle($knowledge, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Knowledge updated successfully.',
        ]);

        return to_route('knowledge.show', $knowledge);
    }

    /**
     * Move a Knowledge record to Trash.
     */
    public function destroy(Request $request, Knowledge $knowledge): RedirectResponse
    {
        Gate::authorize('delete', $knowledge);

        $knowledge->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Knowledge deleted successfully.',
        ]);

        return to_route('knowledge.index');
    }
}
