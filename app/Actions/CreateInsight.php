<?php

namespace App\Actions;

use App\Models\Insight;
use App\Models\Knowledge;
use App\Support\HtmlSanitizer;
use Illuminate\Support\Facades\DB;

class CreateInsight
{
    public function __construct(
        private readonly ResolveKnowledgeStatus $statusResolver,
        private readonly HtmlSanitizer $sanitizer,
    ) {}

    /**
     * Store an Insight, then refresh the parent Knowledge status and timestamp.
     *
     * PRD 23.1 / spec 22: an Insight only ever lands on Knowledge the user
     * can edit, and every mutation recalculates the system-owned status.
     */
    public function handle(Knowledge $knowledge, mixed $content): Insight
    {
        return DB::transaction(function () use ($knowledge, $content): Insight {
            $insight = $knowledge->insights()->create([
                'content' => $this->sanitizer->content($content) ?? '',
            ]);

            $this->statusResolver->apply($knowledge);
            $knowledge->touch();

            return $insight;
        });
    }
}
