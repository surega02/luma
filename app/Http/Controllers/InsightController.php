<?php

namespace App\Http\Controllers;

use App\Actions\CreateInsight;
use App\Actions\DeleteInsight;
use App\Actions\UpdateInsight;
use App\Http\Requests\Insight\StoreInsightRequest;
use App\Http\Requests\Insight\UpdateInsightRequest;
use App\Models\Insight;
use App\Models\Knowledge;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class InsightController extends Controller
{
    /**
     * Add an Insight to Knowledge the user is allowed to edit (PRD 23.1).
     */
    public function store(StoreInsightRequest $request, Knowledge $knowledge, CreateInsight $action): RedirectResponse
    {
        Gate::authorize('update', $knowledge);

        $action->handle($knowledge, $request->validated('content'));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Insight added successfully.',
        ]);

        return to_route('knowledge.show', $knowledge);
    }

    /**
     * Persist an edited Insight and refresh its parent Knowledge (PRD 23.2).
     */
    public function update(UpdateInsightRequest $request, Insight $insight, UpdateInsight $action): RedirectResponse
    {
        Gate::authorize('update', $insight);

        $action->handle($insight, $request->validated('content'));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Insight updated successfully.',
        ]);

        return to_route('knowledge.show', $insight->knowledge_id);
    }

    /**
     * Delete an Insight directly - no confirmation in product (PRD 23.3).
     */
    public function destroy(Insight $insight, DeleteInsight $action): RedirectResponse
    {
        Gate::authorize('delete', $insight);

        $action->handle($insight);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Insight deleted successfully.',
        ]);

        return to_route('knowledge.show', $insight->knowledge_id);
    }
}
