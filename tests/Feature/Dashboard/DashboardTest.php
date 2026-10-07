<?php

namespace Tests\Feature\Dashboard;

use App\Models\Category;
use App\Models\Insight;
use App\Models\Knowledge;
use App\Models\User;
use App\Queries\DashboardQuery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_progress_counts_active_knowledge_only(): void
    {
        $user = User::factory()->create();

        Knowledge::factory()->create(['user_id' => $user->id]);
        Knowledge::factory()->understood()->create(['user_id' => $user->id]);
        Knowledge::factory()->complete()->create(['user_id' => $user->id]);
        Knowledge::factory()->trashed()->create(['user_id' => $user->id]);
        Knowledge::factory()->create(['user_id' => User::factory()->create()->id]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('progress.total', 3)
                ->where('progress.captured', 1)
                ->where('progress.understood', 1)
                ->where('progress.complete', 1));
    }

    public function test_growth_returns_thirty_days_with_every_date_filled(): void
    {
        $user = User::factory()->create();

        Knowledge::factory()->create([
            'user_id' => $user->id,
            'created_at' => now()->subDays(45),
        ]);
        Knowledge::factory()->create(['user_id' => $user->id]);
        Knowledge::factory()->create(['user_id' => $user->id]);
        Knowledge::factory()->trashed()->create(['user_id' => $user->id]);
        Knowledge::factory()->create(['user_id' => User::factory()->create()->id]);

        $expectedStart = now()->startOfDay()->subDays(29);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->has('growth', 30)
                ->where('growth.0.date', $expectedStart->toDateString())
                ->where('growth.29.date', now()->startOfDay()->toDateString()));

        $growth = (new DashboardQuery)->growth($user);

        $this->assertCount(30, $growth);
        $this->assertSame($expectedStart->toDateString(), $growth[0]['date']);
        $this->assertSame(now()->startOfDay()->toDateString(), $growth[29]['date']);

        $dates = array_column($growth, 'date');
        $this->assertSame($dates, array_unique($dates));

        $this->assertSame(2, array_sum(array_column($growth, 'created')), 'Only in-window knowledge counts.');

        $previous = null;

        foreach ($growth as $point) {
            $this->assertGreaterThanOrEqual(0, $point['created']);

            if ($previous !== null) {
                $this->assertGreaterThanOrEqual($previous, $point['cumulative']);
            }

            $previous = $point['cumulative'];

            if ($point['created'] === 0) {
                $this->assertGreaterThan(0, $point['cumulative'], 'Zero days still carry the running total.');
            }
        }

        $this->assertSame(3, $previous, 'Cumulative total includes the record older than the window.');
    }

    public function test_recent_knowledge_is_limited_to_summary_data(): void
    {
        $user = User::factory()->create();

        foreach (range(1, 7) as $index) {
            Knowledge::factory()->create([
                'user_id' => $user->id,
                'title' => "Note {$index}",
                'created_at' => now()->subMinutes(8 - $index),
            ]);
        }

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->has('recentKnowledge', 5)
                ->where('recentKnowledge.0.title', 'Note 7')
                ->where('recentKnowledge.4.title', 'Note 3')
                ->missing('recentKnowledge.0.definition')
                ->missing('recentKnowledge.0.my_understanding')
                ->has('recentKnowledge.0.status')
                ->has('recentKnowledge.0.definition_snippet'));
    }

    public function test_recent_insights_carry_their_parent_knowledge(): void
    {
        $user = User::factory()->create();
        $active = Knowledge::factory()->create(['user_id' => $user->id, 'title' => 'Event Loop']);
        $trashed = Knowledge::factory()->create(['user_id' => $user->id]);
        $trashed->delete();

        Insight::factory()->create([
            'knowledge_id' => $active->id,
            'content' => '<p>Microtasks first.</p>',
        ]);
        Insight::factory()->create(['knowledge_id' => $trashed->id]);
        Insight::factory()->create([
            'knowledge_id' => Knowledge::factory()->create([
                'user_id' => User::factory()->create()->id,
            ])->id,
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->has('recentInsights', 1)
                ->where('recentInsights.0.content', '<p>Microtasks first.</p>')
                ->where('recentInsights.0.knowledge.title', 'Event Loop'));
    }

    public function test_top_categories_rank_by_active_knowledge_count(): void
    {
        $user = User::factory()->create();
        $counts = [6, 5, 4, 3, 2, 1];
        $created = [];

        foreach ($counts as $index => $count) {
            $category = Category::factory()->create([
                'user_id' => $user->id,
                'name' => 'Category '.chr(65 + $index),
            ]);
            $created[$category->id] = $count;

            foreach (range(1, $count) as $ignored) {
                $knowledge = Knowledge::factory()->create(['user_id' => $user->id]);
                $knowledge->categories()->attach($category->id);
            }
        }

        $dropped = array_search(1, $created, true);
        $knowledge = Knowledge::factory()->create(['user_id' => $user->id]);
        $knowledge->categories()->attach($dropped);
        $knowledge->delete();

        Knowledge::factory()->create(['user_id' => User::factory()->create()->id]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->has('topCategories', 5)
                ->where('topCategories.0.name', 'Category A')
                ->where('topCategories.0.knowledge_count', 6)
                ->where('topCategories.1.name', 'Category B')
                ->where('topCategories.1.knowledge_count', 5)
                ->where('topCategories.4.name', 'Category E')
                ->where('topCategories.4.knowledge_count', 2)
                ->missing('topCategories.5'));
    }
}
