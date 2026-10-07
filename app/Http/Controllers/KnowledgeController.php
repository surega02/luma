<?php

namespace App\Http\Controllers;

use App\Actions\CreateKnowledge;
use App\Actions\UpdateKnowledge;
use App\Http\Requests\Knowledge\StoreKnowledgeRequest;
use App\Http\Requests\Knowledge\UpdateKnowledgeRequest;
use App\Models\Knowledge;
use App\Queries\KnowledgeIndexQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class KnowledgeController extends Controller
{
    /**
     * List the authenticated user's active Knowledge with search, filter,
     * sort and pagination applied (PRD 17-20).
     */
    public function index(Request $request, KnowledgeIndexQuery $query): Response
    {
        $user = $request->user();

        abort_if($user === null, 401);

        $filters = $query->filters($request->query());

        return Inertia::render('knowledge/index', [
            'knowledges' => $query->forUser($user, $filters),
            'filters' => $filters,
        ]);
    }

    /**
     * Show a single Knowledge record in PRD display order.
     *
     * Version history is not part of the initial payload: it is fetched from
     * its own read-only routes when the user opens History (spec 10).
     */
    public function show(Knowledge $knowledge): Response
    {
        Gate::authorize('view', $knowledge);

        $knowledge->load([
            'categories:id,name,color,icon',
            'insights' => fn ($query) => $query->latest(),
        ]);

        return Inertia::render('knowledge/show', [
            'knowledge' => $knowledge,
        ]);
    }

    /**
     * Read-only Definition history, newest version first (PRD 24.3).
     */
    public function definitionHistory(Knowledge $knowledge): Response
    {
        return $this->history($knowledge, 'definition');
    }

    /**
     * Read-only My Understanding history (PRD 24.4).
     */
    public function understandingHistory(Knowledge $knowledge): Response
    {
        return $this->history($knowledge, 'understanding');
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

    /**
     * Shared Version History payload (spec 12/13): authorize through the
     * parent Knowledge, page immutable versions newest first, 20 per page.
     *
     * @param  'definition'|'understanding'  $field
     */
    private function history(Knowledge $knowledge, string $field): Response
    {
        Gate::authorize('view', $knowledge);

        $history = $field === 'definition'
            ? $knowledge->definitionVersions()->orderByDesc('version')->paginate(20)
            : $knowledge->understandingVersions()->orderByDesc('version')->paginate(20);

        return Inertia::render('knowledge/history', [
            'knowledge' => $knowledge->only(['id', 'title']),
            'field' => $field,
            'history' => $history,
        ]);
    }
}
