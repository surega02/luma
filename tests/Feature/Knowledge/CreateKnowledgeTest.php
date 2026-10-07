<?php

namespace Tests\Feature\Knowledge;

use App\Models\Category;
use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CreateKnowledgeTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_knowledge_is_created_with_definition_version_one(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('knowledge.store'), [
            'title' => 'Event Loop',
            'definition' => '<p>The <strong>event loop</strong> processes callbacks.</p>',
            'my_understanding' => '<p>It drains the queue on every tick.</p>',
            'source' => 'MDN',
            'url' => 'https://example.com/event-loop',
        ]);

        $response->assertRedirect(route('knowledge.index', absolute: false));
        $response->assertSessionHasNoErrors();
        $response->assertInertiaFlash('toast', [
            'type' => 'success',
            'message' => 'Knowledge created successfully.',
        ]);

        $knowledge = Knowledge::firstOrFail();

        $this->assertSame($user->id, $knowledge->user_id);
        $this->assertSame('Event Loop', $knowledge->title);
        $this->assertSame('MDN', $knowledge->source);
        $this->assertSame('https://example.com/event-loop', $knowledge->url);
        $this->assertSame(1, $knowledge->definitionVersions()->count());
        $this->assertSame(1, $knowledge->definitionVersions()->first()->version);
        $this->assertSame(1, $knowledge->understandingVersions()->count());
    }

    public function test_initial_status_reflects_my_understanding(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('knowledge.store'), [
            'title' => 'Captured only',
            'definition' => '<p>Definition text</p>',
            'my_understanding' => '<p></p>',
        ]);

        $this->assertSame('captured', Knowledge::firstOrFail()->status->value);

        $this->actingAs($user)->post(route('knowledge.store'), [
            'title' => 'Understood',
            'definition' => '<p>Definition text</p>',
            'my_understanding' => '<p>My take on it</p>',
        ]);

        $this->assertSame(
            'understood',
            Knowledge::where('title', 'Understood')->firstOrFail()->status->value,
        );
    }

    public function test_categories_are_synced_and_foreign_categories_are_rejected(): void
    {
        $user = User::factory()->create();
        $own = Category::factory()->create(['user_id' => $user->id]);
        $foreign = Category::factory()->create();

        $response = $this->actingAs($user)->post(route('knowledge.store'), [
            'title' => 'Owned category',
            'definition' => '<p>Definition text</p>',
            'category_ids' => [$own->id],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertSame(
            [$own->id],
            Knowledge::firstOrFail()->categories()->pluck('categories.id')->all(),
        );

        $this->post(route('knowledge.store'), [
            'title' => 'Foreign category',
            'definition' => '<p>Definition text</p>',
            'category_ids' => [$foreign->id],
        ])->assertSessionHasErrors('category_ids.0');

        $this->assertSame(1, Knowledge::count());
    }

    public function test_title_and_definition_are_required(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('knowledge.store'), [
            'title' => '',
            'definition' => '<p></p>',
        ]);

        $response->assertSessionHasErrors(['title', 'definition']);
        $this->assertSame(0, Knowledge::count());
    }

    public function test_rich_text_is_sanitized_before_storage(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('knowledge.store'), [
            'title' => 'Sanitized',
            'definition' => '<p>hello</p><script>alert(1)</script><a href="javascript:x">click</a>',
            'my_understanding' => '<p>understood</p>',
        ]);

        $knowledge = Knowledge::firstOrFail();

        $this->assertStringNotContainsString('script', $knowledge->definition);
        $this->assertStringNotContainsString('javascript:', $knowledge->definition);
        $this->assertStringContainsString('hello', $knowledge->definition);
        $this->assertStringContainsString('click', $knowledge->definition);
    }

    public function test_index_shows_only_active_knowledge_of_the_current_user(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $mine = Knowledge::factory()->create(['user_id' => $user->id]);
        Knowledge::factory()->trashed()->create(['user_id' => $user->id]);
        Knowledge::factory()->create(['user_id' => $other->id]);

        $response = $this->actingAs($user)->get(route('knowledge.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('knowledge/index')
            ->has('knowledges.data', 1)
            ->where('knowledges.data.0.id', $mine->id)
            ->where('knowledges.data.0.definition_snippet', $mine->definition_snippet)
            ->where('knowledges.data.0.status', 'captured')
            ->has('knowledges.data.0.categories', 0));
    }
}
