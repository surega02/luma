<?php

namespace App\Queries;

use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Builds the Knowledge List query for a single account (PRD 17-20,
 * API spec 7-8).
 *
 * Every condition stays inside the account scope, sort and page size come
 * from allow-lists, and the search only reads the four PRD search fields.
 */
class KnowledgeIndexQuery
{
    /**
     * Sort keys the list accepts. Anything else falls back to the default.
     *
     * @var list<string>
     */
    public const SORTS = ['recently_updated', 'newest', 'oldest'];

    public const DEFAULT_SORT = 'recently_updated';

    /**
     * Page sizes the list offers (PRD 20).
     *
     * @var list<int>
     */
    public const PER_PAGES = [10, 20, 50];

    public const DEFAULT_PER_PAGE = 20;

    /**
     * Normalize raw query-string input into the filters that will be applied,
     * so the UI and the query can never disagree about what is running.
     *
     * @param  array<string, mixed>  $input
     * @return array{search: string, category_ids: list<int>, include_uncategorized: bool, sort: string, per_page: int}
     */
    public function filters(array $input): array
    {
        return [
            'search' => trim((string) ($input['search'] ?? '')),
            'category_ids' => $this->categoryIds($input['category_ids'] ?? []),
            'include_uncategorized' => $this->boolean($input['include_uncategorized'] ?? false),
            'sort' => $this->sort($input['sort'] ?? null),
            'per_page' => $this->perPage($input['per_page'] ?? null),
        ];
    }

    /**
     * @param  array{search?: string, category_ids?: list<int>, include_uncategorized?: bool, sort?: string, per_page?: int}  $filters
     * @return LengthAwarePaginator<int, Knowledge>
     */
    public function forUser(User $user, array $filters): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $categoryIds = array_values(array_filter(
            array_map('intval', $filters['category_ids'] ?? []),
            fn (int $id) => $id > 0,
        ));
        $includeUncategorized = (bool) ($filters['include_uncategorized'] ?? false);

        $query = Knowledge::query()
            // Payload review (E12-F10): the list only renders the card, so
            // My Understanding, Source, URL and ownership columns stay out of
            // every response. `definition` remains because the card preview
            // snippet is derived from it server-side.
            ->select([
                'knowledges.id',
                'knowledges.title',
                'knowledges.definition',
                'knowledges.status',
                'knowledges.created_at',
                'knowledges.updated_at',
            ])
            ->with('categories:id,name,color,icon')
            ->where('knowledges.user_id', $user->id)
            ->whereNull('knowledges.deleted_at');

        if ($search !== '') {
            $this->applySearch($query, $search);
        }

        if ($categoryIds !== [] || $includeUncategorized) {
            $this->applyCategoryFilter($query, $categoryIds, $includeUncategorized);
        }

        $this->applySort($query, $this->sort($filters['sort'] ?? null));

        return $query
            ->paginate($this->perPage($filters['per_page'] ?? null))
            ->withQueryString();
    }

    /**
     * Partial, case-insensitive match across the four PRD search fields.
     * Source and URL are deliberately excluded (PRD 18.1).
     *
     * @param  Builder<Knowledge>  $query
     */
    private function applySearch(Builder $query, string $search): void
    {
        $like = '%'.$search.'%';

        $query->where(function (Builder $group) use ($like) {
            $group
                ->where('title', 'like', $like)
                ->orWhere('definition', 'like', $like)
                ->orWhere('my_understanding', 'like', $like)
                ->orWhereHas('insights', function (Builder $insight) use ($like) {
                    $insight->where('content', 'like', $like);
                });
        });
    }

    /**
     * Multiple categories are OR-ed, and Uncategorized ORs with them
     * (PRD 17, API spec 8).
     *
     * @param  Builder<Knowledge>  $query
     * @param  list<int>  $categoryIds
     */
    private function applyCategoryFilter(
        Builder $query,
        array $categoryIds,
        bool $includeUncategorized,
    ): void {
        $query->where(function (Builder $group) use ($categoryIds, $includeUncategorized) {
            if ($categoryIds !== []) {
                $group->whereHas('categories', function (Builder $category) use ($categoryIds) {
                    $category->whereIn('categories.id', $categoryIds);
                });
            }

            if ($includeUncategorized) {
                $group->orWhereDoesntHave('categories');
            }
        });
    }

    /**
     * Allow-listed ordering; the raw query string never reaches SQL.
     *
     * @param  Builder<Knowledge>  $query
     */
    private function applySort(Builder $query, string $sort): void
    {
        match ($sort) {
            'newest' => $query->orderBy('created_at', 'desc')->orderBy('id', 'desc'),
            'oldest' => $query->orderBy('created_at', 'asc')->orderBy('id', 'asc'),
            default => $query->orderBy('updated_at', 'desc')->orderBy('id', 'desc'),
        };
    }

    /**
     * Coerce the requested ids to positive integers.
     *
     * A foreign id is left in place on purpose: the account scope means it
     * can never match, so filtering by it simply returns nothing.
     *
     * @return list<int>
     */
    private function categoryIds(mixed $raw): array
    {
        return array_values(array_unique(array_filter(
            array_map('intval', is_array($raw) ? $raw : []),
            fn (int $id) => $id > 0,
        )));
    }

    private function sort(mixed $raw): string
    {
        $sort = is_string($raw) ? $raw : '';

        return in_array($sort, self::SORTS, true) ? $sort : self::DEFAULT_SORT;
    }

    private function perPage(mixed $raw): int
    {
        $perPage = (int) $raw;

        return in_array($perPage, self::PER_PAGES, true) ? $perPage : self::DEFAULT_PER_PAGE;
    }

    private function boolean(mixed $raw): bool
    {
        return in_array($raw, [true, 1, '1', 'true', 'on'], true);
    }
}
