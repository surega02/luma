<?php

namespace Tests\Feature\Knowledge;

use App\Models\Category;
use App\Models\Insight;
use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class KnowledgeIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_matches_title_case_insensitively(): void
    {
        $user = User::factory()->create();
        $match = $this->knowledgeFor($user, ['title' => 'Machine Learning']);
        $this->knowledgeFor($user, ['title' => 'Sourdough starter']);
        $this->knowledgeFor(User::factory()->create(), ['title' => 'Machine Learning']);

        $this->actingAs($user)
            ->get(route('knowledge.index', ['search' => 'machine']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 1)
                ->where('knowledges.data.0.id', $match->id)
                ->where('filters.search', 'machine'));
    }

    public function test_search_matches_definition_and_my_understanding(): void
    {
        $user = User::factory()->create();
        $byDefinition = $this->knowledgeFor($user, ['title' => 'First', 'definition' => '<p>The microtask queue drains first.</p>']);
        $byUnderstanding = $this->knowledgeFor($user, ['title' => 'Second', 'my_understanding' => '<p>Callbacks queue up.</p>']);

        $this->actingAs($user)
            ->get(route('knowledge.index', ['search' => 'queue']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 2)
                ->where('knowledges.data.0.id', $byUnderstanding->id)
                ->where('knowledges.data.1.id', $byDefinition->id));
    }

    public function test_search_matches_insight_content(): void
    {
        $user = User::factory()->create();
        $knowledge = $this->knowledgeFor($user);
        Insight::factory()->create([
            'knowledge_id' => $knowledge->id,
            'content' => '<p>Promises resolve out of order.</p>',
        ]);

        $this->actingAs($user)
            ->get(route('knowledge.index', ['search' => 'promises']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 1)
                ->where('knowledges.data.0.id', $knowledge->id));
    }

    public function test_search_ignores_source_and_url(): void
    {
        $user = User::factory()->create();
        $this->knowledgeFor($user, [
            'title' => 'Sourdough',
            'source' => 'machine learning handbook',
            'url' => 'https://machine.example.com/handbook',
        ]);

        $this->actingAs($user)
            ->get(route('knowledge.index', ['search' => 'machine']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 0));
    }

    public function test_search_never_reaches_another_account(): void
    {
        $user = User::factory()->create();
        $this->knowledgeFor(User::factory()->create(), ['title' => 'Quantum computing']);

        $this->actingAs($user)
            ->get(route('knowledge.index', ['search' => 'quantum']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 0));
    }

    public function test_a_single_category_filters_the_list(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);
        $tagged = $this->knowledgeFor($user, ['title' => 'Tagged']);
        $tagged->categories()->attach($category->id);
        $this->knowledgeFor($user, ['title' => 'Untagged']);

        $this->actingAs($user)
            ->get(route('knowledge.index', ['category_ids' => [$category->id]]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 1)
                ->where('knowledges.data.0.id', $tagged->id)
                ->where('filters.category_ids.0', $category->id));
    }

    public function test_filters_knowledge_by_multiple_categories_using_or_semantics(): void
    {
        $user = User::factory()->create();
        $programming = Category::factory()->create(['user_id' => $user->id, 'name' => 'Programming']);
        $ai = Category::factory()->create(['user_id' => $user->id, 'name' => 'AI']);

        $onlyProgramming = $this->knowledgeFor($user, ['title' => 'Programming only']);
        $onlyProgramming->categories()->attach($programming->id);

        $onlyAi = $this->knowledgeFor($user, ['title' => 'AI only']);
        $onlyAi->categories()->attach($ai->id);

        $both = $this->knowledgeFor($user, ['title' => 'Both']);
        $both->categories()->attach([$programming->id, $ai->id]);

        $this->knowledgeFor($user, ['title' => 'Neither']);

        $this->actingAs($user)
            ->get(route('knowledge.index', [
                'category_ids' => [$programming->id, $ai->id],
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 3)
                ->where('knowledges.data.0.id', $both->id));
    }

    public function test_includes_uncategorized_knowledge_in_an_or_filter(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);

        $tagged = $this->knowledgeFor($user, ['title' => 'Tagged']);
        $tagged->categories()->attach($category->id);
        $this->knowledgeFor($user, ['title' => 'Uncategorized']);

        $this->actingAs($user)
            ->get(route('knowledge.index', [
                'category_ids' => [$category->id],
                'include_uncategorized' => 1,
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 2)
                ->where('filters.include_uncategorized', true));
    }

    public function test_filtering_by_another_accounts_category_returns_nothing(): void
    {
        $user = User::factory()->create();
        $foreign = Category::factory()->create(['user_id' => User::factory()->create()->id]);
        $this->knowledgeFor($user);

        $this->actingAs($user)
            ->get(route('knowledge.index', ['category_ids' => [$foreign->id]]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 0));
    }

    public function test_invalid_filters_fall_back_to_the_defaults(): void
    {
        $user = User::factory()->create();
        $this->knowledgeFor($user);

        $this->actingAs($user)
            ->get(route('knowledge.index', [
                'search' => '  machine  ',
                'sort' => 'title; drop table',
                'per_page' => '999',
                'category_ids' => ['abc', 0],
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->where('filters.search', 'machine')
                ->where('filters.sort', 'recently_updated')
                ->where('filters.per_page', 20)
                ->where('filters.category_ids', [])
                ->where('filters.include_uncategorized', false));
    }

    public function test_sorting_follows_the_allow_list(): void
    {
        $user = User::factory()->create();
        $older = $this->knowledgeFor($user, ['title' => 'Older']);
        $newer = $this->knowledgeFor($user, ['title' => 'Newer']);

        $this->actingAs($user)
            ->get(route('knowledge.index', ['sort' => 'newest']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->where('filters.sort', 'newest')
                ->where('knowledges.data.0.id', $newer->id)
                ->where('knowledges.data.1.id', $older->id));

        $this->actingAs($user)
            ->get(route('knowledge.index', ['sort' => 'oldest']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.sort', 'oldest')
                ->where('knowledges.data.0.id', $older->id)
                ->where('knowledges.data.1.id', $newer->id));
    }

    public function test_default_sort_is_most_recently_updated(): void
    {
        $user = User::factory()->create();
        $stale = $this->knowledgeFor($user, ['title' => 'Stale']);
        $fresh = $this->knowledgeFor($user, ['title' => 'Fresh']);

        $stale->forceFill(['updated_at' => now()->subDay()])->saveQuietly();

        $this->actingAs($user)
            ->get(route('knowledge.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->where('filters.sort', 'recently_updated')
                ->where('knowledges.data.0.id', $fresh->id)
                ->where('knowledges.data.1.id', $stale->id));
    }

    public function test_per_page_offers_ten_twenty_and_fifty(): void
    {
        $user = User::factory()->create();
        Knowledge::factory()->count(11)->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->get(route('knowledge.index', ['per_page' => 10]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 10)
                ->where('filters.per_page', 10));

        $this->actingAs($user)
            ->get(route('knowledge.index', ['per_page' => 50]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('knowledges.data', 11)
                ->where('filters.per_page', 50));
    }

    public function test_pagination_keeps_search_filter_and_sort_state(): void
    {
        $user = User::factory()->create();
        Knowledge::factory()->count(11)->create([
            'user_id' => $user->id,
            'title' => 'Paging entry',
        ]);

        $this->actingAs($user)
            ->get(route('knowledge.index', [
                'search' => 'paging',
                'per_page' => 10,
                'page' => 2,
                'sort' => 'oldest',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->where('knowledges.current_page', 2)
                ->where('filters.search', 'paging')
                ->where('filters.per_page', 10)
                ->where('filters.sort', 'oldest'));
    }

    public function test_trashed_knowledge_is_excluded(): void
    {
        $user = User::factory()->create();
        $this->knowledgeFor($user);
        Knowledge::factory()->trashed()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->get(route('knowledge.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 1));
    }

    public function test_knowledge_list_does_not_run_an_n_plus_one_query(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);

        foreach (range(1, 12) as $i) {
            $knowledge = Knowledge::factory()->create([
                'user_id' => $user->id,
                'title' => "Eager record {$i}",
            ]);
            $knowledge->categories()->attach($category->id);
            Insight::factory()->create(['knowledge_id' => $knowledge->id]);
        }

        DB::enableQueryLog();
        $response = $this->actingAs($user)
            ->get(route('knowledge.index', ['per_page' => 50]));
        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('knowledge/index')
            ->has('knowledges.data', 12));

        $this->assertLessThanOrEqual(
            5,
            $queries,
            "Expected one page query, one count and one eager load, ran {$queries} queries.",
        );
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function knowledgeFor(User $user, array $attributes = []): Knowledge
    {
        return Knowledge::factory()->create(array_merge($attributes, [
            'user_id' => $user->id,
        ]));
    }
}
