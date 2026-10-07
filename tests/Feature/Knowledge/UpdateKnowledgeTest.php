<?php

namespace Tests\Feature\Knowledge;

use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateKnowledgeTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Event Loop',
            'definition' => '<p>Updated definition</p>',
            'my_understanding' => '<p>Updated understanding</p>',
            'source' => 'MDN',
            'url' => 'https://example.com',
            'category_ids' => [],
        ], $overrides);
    }

    private function createKnowledge(User $user, array $overrides = []): Knowledge
    {
        $this->actingAs($user)->post(route('knowledge.store'), array_merge([
            'title' => 'Event Loop',
            'definition' => '<p>Original definition</p>',
            'my_understanding' => '<p>Original understanding</p>',
        ], $overrides))->assertSessionHasNoErrors();

        return Knowledge::latest('id')->firstOrFail();
    }

    public function test_every_save_creates_a_new_definition_version(): void
    {
        $user = User::factory()->create();
        $knowledge = $this->createKnowledge($user);

        $this->actingAs($user)
            ->patch(route('knowledge.update', $knowledge), $this->payload())
            ->assertRedirect(route('knowledge.show', $knowledge, absolute: false))
            ->assertSessionHasNoErrors()
            ->assertInertiaFlash('toast', [
                'type' => 'success',
                'message' => 'Knowledge updated successfully.',
            ]);

        $this->actingAs($user)
            ->patch(route('knowledge.update', $knowledge), $this->payload())
            ->assertSessionHasNoErrors();

        $this->assertSame(
            [1, 2, 3],
            $knowledge->definitionVersions()->pluck('version')->all(),
        );
        $this->assertSame(
            ['<p>Original definition</p>', '<p>Updated definition</p>', '<p>Updated definition</p>'],
            $knowledge->definitionVersions()->orderBy('version')->pluck('content')->all(),
        );
    }

    public function test_understanding_versions_only_grow_while_content_exists(): void
    {
        $user = User::factory()->create();
        $knowledge = $this->createKnowledge($user, ['my_understanding' => null]);

        $this->assertSame(0, $knowledge->understandingVersions()->count());

        $this->actingAs($user)->patch(
            route('knowledge.update', $knowledge),
            $this->payload(['my_understanding' => '<p>first take</p>']),
        )->assertSessionHasNoErrors();

        $this->actingAs($user)->patch(
            route('knowledge.update', $knowledge),
            $this->payload(['my_understanding' => '<p>second take</p>']),
        )->assertSessionHasNoErrors();

        $this->assertSame(
            [1, 2],
            $knowledge->understandingVersions()->pluck('version')->all(),
        );

        $this->actingAs($user)->patch(
            route('knowledge.update', $knowledge),
            $this->payload(['my_understanding' => '<p></p>']),
        )->assertSessionHasNoErrors();

        $this->assertSame(2, $knowledge->understandingVersions()->count());

        $this->actingAs($user)->patch(
            route('knowledge.update', $knowledge),
            $this->payload(['my_understanding' => '<p>third take</p>']),
        )->assertSessionHasNoErrors();

        $this->assertSame(
            [1, 2, 3],
            $knowledge->understandingVersions()->pluck('version')->all(),
        );
    }

    public function test_status_is_recalculated_on_every_save(): void
    {
        $user = User::factory()->create();
        $knowledge = $this->createKnowledge($user);
        $knowledge->insights()->create(['content' => 'An insight']);

        $this->actingAs($user)->patch(
            route('knowledge.update', $knowledge),
            $this->payload(),
        )->assertSessionHasNoErrors();

        $this->assertSame('complete', $knowledge->fresh()->status->value);

        $this->actingAs($user)->patch(
            route('knowledge.update', $knowledge),
            $this->payload(['my_understanding' => '']),
        )->assertSessionHasNoErrors();

        $this->assertSame('captured', $knowledge->fresh()->status->value);
    }

    public function test_another_user_cannot_update_knowledge(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $knowledge = Knowledge::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($intruder)
            ->patch(route('knowledge.update', $knowledge), $this->payload())
            ->assertForbidden();

        $this->assertSame($knowledge->title, $knowledge->fresh()->title);
        $this->assertSame(0, $knowledge->definitionVersions()->count());
    }

    public function test_knowledge_show_displays_the_owning_users_record(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create(['user_id' => $user->id]);
        Knowledge::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)
            ->get(route('knowledge.show', $knowledge))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('knowledge/show')
                ->where('knowledge.id', $knowledge->id)
                ->where('knowledge.status', 'understood')
                ->has('knowledge.insights', 0)
                ->missing('knowledge.definition_versions')
                ->missing('knowledge.understanding_versions'));

        $this->actingAs($other)
            ->get(route('knowledge.show', $knowledge))
            ->assertForbidden();

        $trashed = Knowledge::factory()->trashed()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->get(route('knowledge.show', $trashed))
            ->assertNotFound();
    }
}
