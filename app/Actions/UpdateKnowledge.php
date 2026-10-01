<?php

namespace App\Actions;

use App\Models\Knowledge;
use App\Support\HtmlSanitizer;
use Illuminate\Support\Facades\DB;

class UpdateKnowledge
{
    public function __construct(
        private readonly ResolveKnowledgeStatus $statusResolver,
        private readonly HtmlSanitizer $sanitizer,
    ) {}

    /**
     * Persist edited Knowledge, append version history and refresh status.
     *
     * Tech design §24: every save writes a new Definition version even when
     * the content did not change; My Understanding versions only grow while
     * the field holds a value.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(Knowledge $knowledge, array $data): Knowledge
    {
        return DB::transaction(function () use ($knowledge, $data): Knowledge {
            $knowledge->fill([
                'title' => trim((string) ($data['title'] ?? $knowledge->title)),
                'definition' => $this->sanitizer->content($data['definition'] ?? null) ?? '',
                'my_understanding' => $this->sanitizer->content($data['my_understanding'] ?? null),
                'source' => $this->nullableString($data['source'] ?? null),
                'url' => $this->nullableString($data['url'] ?? null),
            ]);
            $knowledge->save();

            $knowledge->definitionVersions()->create([
                'version' => (int) $knowledge->definitionVersions()->max('version') + 1,
                'content' => $knowledge->definition,
            ]);

            if (filled($knowledge->my_understanding)) {
                $knowledge->understandingVersions()->create([
                    'version' => (int) $knowledge->understandingVersions()->max('version') + 1,
                    'content' => $knowledge->my_understanding,
                ]);
            }

            $knowledge->categories()->sync($this->categoryIds($data));

            $this->statusResolver->apply($knowledge);

            return $knowledge->fresh(['categories', 'insights']) ?? $knowledge;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<int, int>
     */
    private function categoryIds(array $data): array
    {
        $ids = $data['category_ids'] ?? [];

        if (! is_array($ids)) {
            return [];
        }

        return array_values(array_unique(array_map('intval', $ids)));
    }

    private function nullableString(mixed $value): ?string
    {
        $value = is_string($value) ? trim($value) : null;

        return $value === '' ? null : $value;
    }
}
