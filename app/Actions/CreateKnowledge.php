<?php

namespace App\Actions;

use App\Models\Knowledge;
use App\Models\User;
use App\Support\HtmlSanitizer;
use Illuminate\Support\Facades\DB;

class CreateKnowledge
{
    public function __construct(
        private readonly ResolveKnowledgeStatus $statusResolver,
        private readonly HtmlSanitizer $sanitizer,
    ) {}

    /**
     * Persist a Knowledge record together with its version history.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(User $user, array $data): Knowledge
    {
        return DB::transaction(function () use ($user, $data): Knowledge {
            $knowledge = new Knowledge([
                'title' => trim((string) ($data['title'] ?? '')),
                'definition' => $this->sanitizer->content($data['definition'] ?? null) ?? '',
                'my_understanding' => $this->sanitizer->content($data['my_understanding'] ?? null),
                'source' => $this->nullableString($data['source'] ?? null),
                'url' => $this->nullableString($data['url'] ?? null),
            ]);

            $knowledge->user_id = $user->id;
            $knowledge->status = $this->statusResolver->resolve($knowledge->my_understanding, 0);
            $knowledge->save();

            $knowledge->definitionVersions()->create([
                'version' => 1,
                'content' => $knowledge->definition,
            ]);

            if (filled($knowledge->my_understanding)) {
                $knowledge->understandingVersions()->create([
                    'version' => 1,
                    'content' => $knowledge->my_understanding,
                ]);
            }

            $knowledge->categories()->sync($this->categoryIds($data));

            return $knowledge;
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
