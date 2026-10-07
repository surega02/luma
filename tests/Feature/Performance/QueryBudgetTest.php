<?php

namespace Tests\Feature\Performance;

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Category;
use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * E12-F10: performance audit - fixed query budgets (guards against N+1),
 * the indexes every hot query leans on, the Inertia payload projection and
 * the partial-reload contract the toolbars rely on.
 */
class QueryBudgetTest extends TestCase
{
    use RefreshDatabase;

    private const LIST_BUDGET = 8;

    private const DASHBOARD_BUDGET = 14;

    private const TRASH_BUDGET = 8;

    public function test_knowledge_list_stays_within_its_query_budget(): void
    {
        $user = $this->seedCollection(25);

        $queries = $this->countQueries(function () use ($user): void {
            $this->actingAs($user)
                ->get(route('knowledge.index'))
                ->assertOk();
        });

        $this->assertGreaterThanOrEqual(3, $queries);
        $this->assertLessThanOrEqual(self::LIST_BUDGET, $queries, "Knowledge list ran {$queries} queries.");
    }

    public function test_knowledge_list_search_and_filters_do_not_multiply_queries(): void
    {
        $user = $this->seedCollection(25);
        $category = $user->categories()->firstOrFail();

        $queries = $this->countQueries(function () use ($user, $category): void {
            $this->actingAs($user)
                ->get(route('knowledge.index', [
                    'search' => 'event',
                    'category_ids' => [$category->id],
                    'sort' => 'newest',
                ]))
                ->assertOk();
        });

        $this->assertLessThanOrEqual(self::LIST_BUDGET + 2, $queries, "Filtered list ran {$queries} queries.");
    }

    public function test_dashboard_stays_within_its_query_budget(): void
    {
        $user = $this->seedCollection(25);

        $queries = $this->countQueries(function () use ($user): void {
            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertOk();
        });

        $this->assertGreaterThanOrEqual(6, $queries, 'The dashboard reads progress, growth, recents, insights and categories.');
        $this->assertLessThanOrEqual(self::DASHBOARD_BUDGET, $queries, "Dashboard ran {$queries} queries.");
    }

    public function test_trash_list_stays_within_its_query_budget(): void
    {
        $user = $this->seedCollection(25);
        $user->knowledges()->take(5)->get()->each->delete();

        $queries = $this->countQueries(function () use ($user): void {
            $this->actingAs($user)
                ->get(route('trash.index'))
                ->assertOk();
        });

        $this->assertLessThanOrEqual(self::TRASH_BUDGET, $queries, "Trash ran {$queries} queries.");
    }

    public function test_hot_tables_carry_the_indexes_the_planner_needs(): void
    {
        $expected = [
            'knowledges' => [
                'knowledges_user_id_deleted_at_index',
                'knowledges_user_id_updated_at_index',
                'knowledges_status_index',
            ],
            'categories' => [
                'categories_user_id_name_unique',
            ],
            'category_knowledge' => [
                'category_knowledge_knowledge_id_category_id_unique',
                'category_knowledge_category_id_index',
            ],
            'insights' => [
                'insights_knowledge_id_index',
            ],
            'definition_versions' => [
                'definition_versions_knowledge_id_version_unique',
                'definition_versions_knowledge_id_index',
            ],
            'understanding_versions' => [
                'understanding_versions_knowledge_id_version_unique',
                'understanding_versions_knowledge_id_index',
            ],
        ];

        foreach ($expected as $table => $indexes) {
            $available = array_column(Schema::getIndexes($table), 'name');

            foreach ($indexes as $index) {
                $this->assertContains($index, $available, "Missing index {$index} on {$table}.");
            }
        }
    }

    public function test_knowledge_list_payload_only_ships_the_card_fields(): void
    {
        $user = User::factory()->create();
        Knowledge::factory()->for($user)->create([
            'title' => 'Event loop',
            'definition' => '<p>Callbacks run one turn at a time.</p>',
            'my_understanding' => '<p>Long private understanding that the list never renders.</p>',
            'source' => 'A very long source label',
            'url' => 'https://example.com/event-loop',
        ]);

        $this->actingAs($user)
            ->get(route('knowledge.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 1)
                ->where('knowledges.data.0.title', 'Event loop')
                ->where('knowledges.data.0.definition_snippet', 'Callbacks run one turn at a time.')
                ->missing('knowledges.data.0.my_understanding')
                ->missing('knowledges.data.0.source')
                ->missing('knowledges.data.0.url')
                ->missing('knowledges.data.0.user_id'));
    }

    public function test_filter_visits_request_a_partial_reload(): void
    {
        $user = $this->seedCollection(5);

        $version = app(HandleInertiaRequests::class)
            ->version(Request::create(route('knowledge.index')));

        $response = $this->actingAs($user)->get(route('knowledge.index', ['search' => 'event']), [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $version,
            'X-Inertia-Partial-Component' => 'knowledge/index',
            'X-Inertia-Partial-Data' => 'knowledges,filters',
        ]);

        $response->assertOk();
        $response->assertHeader('X-Inertia', 'true');

        $props = $response->json('props');

        $this->assertArrayHasKey('knowledges', $props);
        $this->assertArrayHasKey('filters', $props);
        $this->assertArrayNotHasKey('categories', $props, 'Shared props must stay out of a partial reload.');
    }

    /**
     * Seed a realistic collection for a fresh account.
     */
    private function seedCollection(int $items): User
    {
        $user = User::factory()->create();
        $categories = Category::factory()->count(3)->for($user)->create();

        Knowledge::factory()->count($items)->for($user)->create()
            ->each(fn (Knowledge $knowledge) => $knowledge->categories()->sync(
                $categories->random()->id,
            ));

        return $user;
    }

    private function countQueries(callable $callback): int
    {
        DB::flushQueryLog();
        DB::enableQueryLog();

        try {
            $callback();
        } finally {
            $queries = DB::getQueryLog();
            DB::disableQueryLog();
        }

        return count($queries);
    }
}
