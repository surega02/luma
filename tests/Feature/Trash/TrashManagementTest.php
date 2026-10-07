<?php

namespace Tests\Feature\Trash;

use App\Models\Category;
use App\Models\DefinitionVersion;
use App\Models\Insight;
use App\Models\Knowledge;
use App\Models\UnderstandingVersion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TrashManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_trash_shows_only_my_trashed_records_newest_deleted_first(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $older = Knowledge::factory()->create(['user_id' => $user->id]);
        $newer = Knowledge::factory()->create(['user_id' => $user->id]);
        $active = Knowledge::factory()->create(['user_id' => $user->id]);
        $foreign = Knowledge::factory()->trashed()->create(['user_id' => $otherUser->id]);

        $older->delete();
        Knowledge::withTrashed()->whereKey($older->id)->update([
            'deleted_at' => now()->subDay(),
        ]);
        $newer->delete();

        $this->actingAs($user)
            ->get(route('trash.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('trash/index')
                ->has('knowledges.data', 2)
                ->where('knowledges.data.0.id', $newer->id)
                ->where('knowledges.data.1.id', $older->id)
                ->missing('knowledges.data.2'));

        $this->assertNotNull(Knowledge::find($active->id));
        $this->assertNull(Knowledge::find($foreign->id));
        $this->assertSame(
            1,
            Knowledge::onlyTrashed()->where('user_id', $otherUser->id)->count(),
        );
    }

    public function test_empty_trash_renders_with_no_records(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('trash.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('trash/index')
                ->has('knowledges.data', 0)
                ->where('knowledges.total', 0));
    }

    public function test_owner_can_restore_knowledge_back_to_the_list(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);
        $knowledge->categories()->attach($category->id);
        $knowledge->delete();

        $this->actingAs($user)
            ->post(route('knowledge.restore', $knowledge))
            ->assertRedirect(route('trash.index', absolute: false))
            ->assertSessionHasNoErrors()
            ->assertInertiaFlash('toast', [
                'type' => 'success',
                'message' => 'Knowledge restored successfully.',
            ]);

        $restored = Knowledge::find($knowledge->id);
        $this->assertNotNull($restored);
        $this->assertNull($restored->deleted_at);
        $this->assertSame('understood', $restored->status->value);
        $this->assertTrue($restored->categories->contains('id', $category->id));

        $this->actingAs($user)
            ->get(route('knowledge.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('knowledge/index')
                ->has('knowledges.data', 1));

        $this->actingAs($user)
            ->get(route('trash.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('knowledges.data', 0));
    }

    public function test_restore_does_not_recreate_a_category_that_was_deleted(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);
        $knowledge->categories()->attach($category->id);
        $knowledge->delete();

        $this->actingAs($user)
            ->delete(route('categories.destroy', $category))
            ->assertRedirect(route('categories.index', absolute: false));

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);

        $this->actingAs($user)
            ->post(route('knowledge.restore', $knowledge))
            ->assertRedirect(route('trash.index', absolute: false));

        $restored = Knowledge::find($knowledge->id);
        $this->assertNotNull($restored, 'Knowledge must come back even when its category is gone.');
        $this->assertCount(0, $restored->categories);
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_another_user_cannot_restore_or_force_delete(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $knowledge = Knowledge::factory()->create(['user_id' => $owner->id]);
        $knowledge->delete();

        $this->actingAs($intruder)
            ->post(route('knowledge.restore', $knowledge))
            ->assertForbidden();

        $this->actingAs($intruder)
            ->delete(route('knowledge.force-delete', $knowledge))
            ->assertForbidden();

        $this->assertSoftDeleted('knowledges', ['id' => $knowledge->id]);
        $this->assertTrue(Knowledge::withTrashed()->find($knowledge->id)->trashed());
    }

    public function test_force_delete_removes_the_record_and_all_dependent_data(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);
        $knowledge->categories()->attach($category->id);
        Insight::factory()->create(['knowledge_id' => $knowledge->id]);
        DefinitionVersion::factory()->create(['knowledge_id' => $knowledge->id]);
        UnderstandingVersion::factory()->create(['knowledge_id' => $knowledge->id]);
        $keep = Knowledge::factory()->create(['user_id' => $user->id]);

        $knowledge->delete();

        $this->actingAs($user)
            ->delete(route('knowledge.force-delete', $knowledge))
            ->assertRedirect(route('trash.index', absolute: false))
            ->assertSessionHasNoErrors()
            ->assertInertiaFlash('toast', [
                'type' => 'success',
                'message' => 'Knowledge permanently deleted.',
            ]);

        $this->assertDatabaseMissing('knowledges', ['id' => $knowledge->id]);
        $this->assertDatabaseMissing('insights', ['knowledge_id' => $knowledge->id]);
        $this->assertDatabaseMissing('definition_versions', ['knowledge_id' => $knowledge->id]);
        $this->assertDatabaseMissing('understanding_versions', ['knowledge_id' => $knowledge->id]);
        $this->assertDatabaseMissing('category_knowledge', ['knowledge_id' => $knowledge->id]);

        $this->assertNotNull(Knowledge::find($keep->id));
        $this->assertDatabaseHas('categories', ['id' => $category->id]);

        $this->actingAs($user)
            ->get(route('trash.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('knowledges.data', 0));
    }

    public function test_permanent_delete_confirmation_is_the_only_way_out_of_trash(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->create(['user_id' => $user->id]);
        $knowledge->delete();

        $this->actingAs($user)
            ->get(route('trash.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('trash/index')
                ->where('knowledges.data.0.id', $knowledge->id)
                ->has('knowledges.data.0.deleted_at')
                ->where('knowledges.data.0.title', $knowledge->title));

        $this->assertSoftDeleted('knowledges', ['id' => $knowledge->id]);
    }
}
