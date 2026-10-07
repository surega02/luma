<?php

namespace App\Actions;

use App\Models\Insight;
use App\Support\HtmlSanitizer;
use Illuminate\Support\Facades\DB;

class UpdateInsight
{
    public function __construct(
        private readonly ResolveKnowledgeStatus $statusResolver,
        private readonly HtmlSanitizer $sanitizer,
    ) {}

    /**
     * Persist edited Insight content and refresh the parent Knowledge.
     */
    public function handle(Insight $insight, mixed $content): Insight
    {
        return DB::transaction(function () use ($insight, $content): Insight {
            $insight->update([
                'content' => $this->sanitizer->content($content) ?? '',
            ]);

            $knowledge = $insight->knowledge()->firstOrFail();
            $this->statusResolver->apply($knowledge);
            $knowledge->touch();

            return $insight;
        });
    }
}
