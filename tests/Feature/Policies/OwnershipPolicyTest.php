<?php

namespace Tests\Feature\Policies;

use App\Models\Category;
use App\Models\Insight;
use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnershipPolicyTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;

    private User $intruder;

    private Knowledge $knowledge;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->intruder = User::factory()->create();
        $this->knowledge = Knowledge::factory()->for($this->owner)->create();
    }

    public function test_owner_can_act_on_their_knowledge(): void
    {
        foreach (['view', 'update', 'delete', 'restore', 'forceDelete'] as $ability) {
            $this->assertTrue(
                $this->owner->can($ability, $this->knowledge),
                "Owner must be allowed to {$ability}.",
            );
        }
    }

    public function test_another_user_cannot_act_on_someone_elses_knowledge(): void
    {
        foreach (['view', 'update', 'delete', 'restore', 'forceDelete'] as $ability) {
            $this->assertFalse(
                $this->intruder->can($ability, $this->knowledge),
                "Intruder must be denied {$ability}.",
            );
        }
    }

    public function test_another_user_cannot_act_on_someone_elses_category(): void
    {
        $category = Category::factory()->for($this->owner)->create();

        foreach (['view', 'update', 'delete'] as $ability) {
            $this->assertTrue($this->owner->can($ability, $category));
            $this->assertFalse($this->intruder->can($ability, $category));
        }
    }

    public function test_insight_access_follows_the_parent_knowledge(): void
    {
        $insight = Insight::factory()->for($this->knowledge)->create();

        foreach (['view', 'update', 'delete'] as $ability) {
            $this->assertTrue($this->owner->can($ability, $insight));
            $this->assertFalse($this->intruder->can($ability, $insight));
        }
    }

    public function test_creating_an_insight_requires_ownership_of_the_knowledge(): void
    {
        $this->assertTrue($this->owner->can('create', Knowledge::class));
        $this->assertTrue($this->intruder->can('create', Knowledge::class));

        $this->assertTrue($this->owner->can('update', $this->knowledge));
        $this->assertFalse($this->intruder->can('update', $this->knowledge));
    }

    public function test_queries_are_scoped_to_the_authenticated_user(): void
    {
        Knowledge::factory()->count(2)->for($this->owner)->create();
        Knowledge::factory()->count(3)->for($this->intruder)->create();

        $ownerIds = Knowledge::query()
            ->where('user_id', $this->owner->id)
            ->pluck('id')
            ->all();

        $intruderIds = Knowledge::query()
            ->where('user_id', $this->intruder->id)
            ->pluck('id')
            ->all();

        $this->assertCount(3, $ownerIds);
        $this->assertCount(3, $intruderIds);
        $this->assertSame([], array_intersect($ownerIds, $intruderIds));
    }
}
