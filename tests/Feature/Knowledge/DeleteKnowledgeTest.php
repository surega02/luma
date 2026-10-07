<?php

namespace Tests\Feature\Knowledge;

use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DeleteKnowledgeTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_move_knowledge_to_trash(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('knowledge.destroy', $knowledge));

        $response->assertRedirect(route('knowledge.index', absolute: false));
        $response->assertSessionHasNoErrors();
        $response->assertInertiaFlash('toast', [
            'type' => 'success',
            'message' => 'Knowledge deleted successfully.',
        ]);

        $this->assertSoftDeleted('knowledges', ['id' => $knowledge->id]);
        $this->assertNull(Knowledge::find($knowledge->id));
        $this->assertNotNull(Knowledge::withTrashed()->find($knowledge->id));
    }

    public function test_trashed_knowledge_disappears_from_the_active_list(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)->delete(route('knowledge.destroy', $knowledge));

        $this->actingAs($user)
            ->get(route('knowledge.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 0));
    }

    public function test_another_user_cannot_delete_knowledge(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $knowledge = Knowledge::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($intruder)
            ->delete(route('knowledge.destroy', $knowledge))
            ->assertForbidden();

        $this->assertNotNull($knowledge->fresh());
    }
}
