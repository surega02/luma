<?php

namespace App\Queries;

use App\Enums\KnowledgeStatus;
use App\Models\Category;
use App\Models\Insight;
use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * Aggregates every Dashboard number in SQL (PRD 27, API spec 5.1).
 *
 * One account scope, no record hydration for the counts, and no N+1 for
 * the ranked categories.
 */
class DashboardQuery
{
    /**
     * Days covered by the growth chart (PRD 27.2).
     */
    public const GROWTH_DAYS = 30;

    /**
     * Rows shown in each "recent" list (PRD 27.3).
     */
    public const RECENT_LIMIT = 5;

    /**
     * Categories ranked on the dashboard (PRD 27.4).
     */
    public const TOP_CATEGORIES = 5;

    /**
     * Learning Progress counts, active Knowledge only (PRD 27.1).
     *
     * @return array{total: int, captured: int, understood: int, complete: int}
     */
    public function progress(User $user): array
    {
        $counts = Knowledge::query()
            ->where('knowledges.user_id', $user->id)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->all();

        $captured = (int) ($counts[KnowledgeStatus::CAPTURED->value] ?? 0);
        $understood = (int) ($counts[KnowledgeStatus::UNDERSTOOD->value] ?? 0);
        $complete = (int) ($counts[KnowledgeStatus::COMPLETE->value] ?? 0);

        return [
            'total' => $captured + $understood + $complete,
            'captured' => $captured,
            'understood' => $understood,
            'complete' => $complete,
        ];
    }

    /**
     * One point per day for the last 30 days: created that day plus the
     * cumulative total, zero-filled so the chart never skips a day.
     *
     * @return list<array{date: string, created: int, cumulative: int}>
     */
    public function growth(User $user): array
    {
        $start = now()->startOfDay()->subDays(self::GROWTH_DAYS - 1);

        $days = Knowledge::query()
            ->where('knowledges.user_id', $user->id)
            ->where('knowledges.created_at', '>=', $start)
            ->toBase()
            ->selectRaw('date(created_at) as day, count(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day')
            ->all();

        $beforeWindow = Knowledge::query()
            ->where('knowledges.user_id', $user->id)
            ->where('knowledges.created_at', '<', $start)
            ->count();

        $cumulative = $beforeWindow;
        $points = [];

        for ($offset = 0; $offset < self::GROWTH_DAYS; $offset++) {
            $date = $start->addDays($offset);
            $created = (int) ($days[$date->toDateString()] ?? 0);
            $cumulative += $created;

            $points[] = [
                'date' => $date->toDateString(),
                'created' => $created,
                'cumulative' => $cumulative,
            ];
        }

        return $points;
    }

    /**
     * Newest active Knowledge, card summary only (PRD 27.3).
     *
     * @return Collection<int, array{id: int, title: string, definition_snippet: string, status: 'captured'|'complete'|'understood', updated_at: string|null}>
     */
    public function recentKnowledge(User $user): Collection
    {
        return Knowledge::query()
            ->where('knowledges.user_id', $user->id)
            ->latest()
            ->take(self::RECENT_LIMIT)
            ->get(['id', 'title', 'definition', 'status', 'updated_at'])
            ->map(fn (Knowledge $knowledge): array => [
                'id' => $knowledge->id,
                'title' => $knowledge->title,
                'definition_snippet' => $knowledge->definition_snippet,
                'status' => $knowledge->status->value,
                'updated_at' => $knowledge->updated_at?->toIso8601String(),
            ]);
    }

    /**
     * Newest Insights whose parent Knowledge is still active, with the
     * parent title attached (PRD 27.3).
     *
     * @return Collection<int, Insight>
     */
    public function recentInsights(User $user): Collection
    {
        return Insight::query()
            ->whereHas('knowledge', fn ($query) => $query->where('user_id', $user->id))
            ->with('knowledge:id,title')
            ->latest()
            ->take(self::RECENT_LIMIT)
            ->get();
    }

    /**
     * Most active categories ranked by active Knowledge count (PRD 27.4),
     * resolved in a single aggregate query.
     *
     * @return Collection<int, array{id: int, name: string, color: string, icon: string, knowledge_count: int}>
     */
    public function topCategories(User $user): Collection
    {
        return Category::query()
            ->where('categories.user_id', $user->id)
            ->join('category_knowledge', 'categories.id', '=', 'category_knowledge.category_id')
            ->join('knowledges', 'knowledges.id', '=', 'category_knowledge.knowledge_id')
            ->where('knowledges.user_id', $user->id)
            ->whereNull('knowledges.deleted_at')
            ->groupBy('categories.id', 'categories.name', 'categories.color', 'categories.icon')
            ->selectRaw('categories.id as id, categories.name as name, categories.color as color, categories.icon as icon, count(*) as knowledge_count')
            ->orderByDesc('knowledge_count')
            ->orderBy('categories.name')
            ->limit(self::TOP_CATEGORIES)
            ->get()
            ->map(fn (Category $category): array => [
                'id' => (int) $category->id,
                'name' => (string) $category->name,
                'color' => (string) $category->color,
                'icon' => (string) $category->icon,
                'knowledge_count' => (int) $category->getAttribute('knowledge_count'),
            ]);
    }
}
