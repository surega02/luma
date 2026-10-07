<?php

namespace Tests\Feature\Knowledge;

use App\Models\DefinitionVersion;
use App\Models\Knowledge;
use App\Models\UnderstandingVersion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class VersionHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_definition_history_lists_versions_newest_first(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->create(['user_id' => $user->id]);
        $this->versions($knowledge, 'definition', [1, 2, 3]);

        $this->actingAs($user)
            ->get(route('knowledge.definition-history', $knowledge))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/history')
                ->where('knowledge.id', $knowledge->id)
                ->where('field', 'definition')
                ->has('history.data', 3)
                ->where('history.data.0.version', 3)
                ->where('history.data.1.version', 2)
                ->where('history.data.2.version', 1)
                ->where('history.data.0.content', '<p>Version 3</p>')
                ->where('history.total', 3));
    }

    public function test_definition_history_pages_twenty_versions(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->create(['user_id' => $user->id]);
        $this->versions($knowledge, 'definition', range(1, 21));

        $this->actingAs($user)
            ->get(route('knowledge.definition-history', $knowledge))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/history')
                ->has('history.data', 20)
                ->where('history.current_page', 1)
                ->where('history.per_page', 20)
                ->where('history.total', 21)
                ->where('history.last_page', 2)
                ->where('history.data.0.version', 21));

        $this->actingAs($user)
            ->get(route('knowledge.definition-history', ['knowledge' => $knowledge->id, 'page' => 2]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/history')
                ->has('history.data', 1)
                ->where('history.current_page', 2)
                ->where('history.data.0.version', 1));
    }

    public function test_understanding_history_is_empty_when_never_captured(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->get(route('knowledge.understanding-history', $knowledge))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/history')
                ->where('field', 'understanding')
                ->has('history.data', 0)
                ->where('history.total', 0));
    }

    public function test_understanding_history_lists_versions_newest_first(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create(['user_id' => $user->id]);
        $this->versions($knowledge, 'understanding', [1, 2]);

        $this->actingAs($user)
            ->get(route('knowledge.understanding-history', $knowledge))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/history')
                ->has('history.data', 2)
                ->where('history.data.0.version', 2)
                ->where('history.data.1.version', 1));
    }

    public function test_history_is_restricted_to_the_owner(): void
    {
        $attacker = User::factory()->create();
        $knowledge = Knowledge::factory()->create([
            'user_id' => User::factory()->create()->id,
        ]);

        $this->actingAs($attacker)
            ->get(route('knowledge.definition-history', $knowledge))
            ->assertForbidden();

        $this->actingAs($attacker)
            ->get(route('knowledge.understanding-history', $knowledge))
            ->assertForbidden();
    }

    /**
     * @param  list<int>  $versions
     */
    private function versions(Knowledge $knowledge, string $field, array $versions): void
    {
        foreach ($versions as $version) {
            $factory = $field === 'definition'
                ? DefinitionVersion::factory()
                : UnderstandingVersion::factory();

            $factory->create([
                'knowledge_id' => $knowledge->id,
                'version' => $version,
                'content' => "<p>Version {$version}</p>",
            ]);
        }
    }
}
