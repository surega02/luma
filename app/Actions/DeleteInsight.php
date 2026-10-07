<?php

namespace App\Actions;

use App\Models\Insight;
use Illuminate\Support\Facades\DB;

class DeleteInsight
{
    public function __construct(private readonly ResolveKnowledgeStatus $statusResolver) {}

    /**
     * Remove an Insight, then recalculate the parent Knowledge.
     *
     * PRD 23.3: dropping the last Insight moves Complete back to Understood
     * and the Knowledge timestamp always moves with it.
     */
    public function handle(Insight $insight): void
    {
        DB::transaction(function () use ($insight): void {
            $knowledge = $insight->knowledge()->firstOrFail();

            $insight->delete();

            $this->statusResolver->apply($knowledge);
            $knowledge->touch();
        });
    }
}
