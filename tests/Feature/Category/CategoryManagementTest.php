<?php

namespace Tests\Feature\Category;

use App\Models\Category;
use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CategoryManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_only_my_categories_with_trashed_excluded_counts(): void
    {
        $user = User::factory()->create();
        $busy = Category::factory()->create(['user_id' => $user->id, 'name' => 'Live']);
        $busy->knowledge()->attach(Knowledge::factory()->create(['user_id' => $user->id])->id);
        $busy->knowledge()->attach(Knowledge::factory()->trashed()->create(['user_id' => $user->id])->id);

        $quiet = Category::factory()->create(['user_id' => $user->id, 'name' => 'Mine']);
        Category::factory()->create(['user_id' => User::factory()->create()->id, 'name' => 'Foreign']);

        $this->actingAs($user)
            ->get(route('categories.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('categories/index')
                ->has('categories', 2)
                ->where('categories.0.name', 'Live')
                ->where('categories.0.knowledge_count', 1)
                ->where('categories.1.id', $quiet->id)
                ->where('categories.1.knowledge_count', 0)
                ->where('sorting.current', 'az'));
    }

    public function test_sorting_by_most_knowledge_puts_the_busiest_first(): void
    {
        $user = User::factory()->create();
        $busy = Category::factory()->create(['user_id' => $user->id, 'name' => 'Busy']);
        $quiet = Category::factory()->create(['user_id' => $user->id, 'name' => 'Quiet']);

        foreach (range(1, 2) as $i) {
            $busy->knowledge()->attach(Knowledge::factory()->create(['user_id' => $user->id])->id);
        }
        $quiet->knowledge()->attach(Knowledge::factory()->create(['user_id' => $user->id])->id);

        $this->actingAs($user)
            ->get(route('categories.index', ['sort' => 'most_knowledge']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('categories/index')
                ->where('sorting.current', 'most_knowledge')
                ->where('categories.0.id', $busy->id)
                ->where('categories.1.id', $quiet->id));
    }

    public function test_invalid_sort_falls_back_to_az(): void
    {
        $user = User::factory()->create();
        Category::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->get(route('categories.index', ['sort' => 'name; drop table']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('categories/index')
                ->where('sorting.current', 'az'));
    }

    public function test_creating_a_category_persists_it_and_flashes(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('categories.store'), $this->payload('Deep Work'))
            ->assertSessionHasNoErrors()
            ->assertInertiaFlash('toast', [
                'type' => 'success',
                'message' => 'Category created successfully.',
            ]);

        $category = Category::where('user_id', $user->id)->where('name', 'Deep Work')->sole();

        $response->assertInertiaFlash('category', [
            'id' => $category->id,
            'name' => 'Deep Work',
            'color' => '#5C7F4A',
            'icon' => 'code',
        ]);
    }

    public function test_duplicate_category_name_is_rejected(): void
    {
        $user = User::factory()->create();
        Category::factory()->create(['user_id' => $user->id, 'name' => 'Deep Work']);

        $this->actingAs($user)
            ->post(route('categories.store'), $this->payload('Deep Work'))
            ->assertSessionHasErrors('name');

        $this->assertSame(1, Category::where('user_id', $user->id)->count());
    }

    public function test_the_same_name_is_allowed_in_another_account(): void
    {
        $user = User::factory()->create();
        Category::factory()->create([
            'user_id' => User::factory()->create()->id,
            'name' => 'Deep Work',
        ]);

        $this->actingAs($user)
            ->post(route('categories.store'), $this->payload('Deep Work'))
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'Deep Work',
        ]);
    }

    public function test_updating_a_category_persists_and_flashes(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id, 'name' => 'Old name']);

        $this->actingAs($user)
            ->patch(route('categories.update', $category), $this->payload('New name'))
            ->assertRedirect(route('categories.index'))
            ->assertSessionHasNoErrors()
            ->assertInertiaFlash('toast', [
                'type' => 'success',
                'message' => 'Category updated successfully.',
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'New name',
            'color' => '#5C7F4A',
            'icon' => 'code',
        ]);
    }

    public function test_updating_can_keep_its_own_name(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id, 'name' => 'Steady']);

        $this->actingAs($user)
            ->patch(route('categories.update', $category), $this->payload('Steady'))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Steady',
        ]);
    }

    public function test_renaming_onto_another_category_is_rejected(): void
    {
        $user = User::factory()->create();
        Category::factory()->create(['user_id' => $user->id, 'name' => 'Alpha']);
        $beta = Category::factory()->create(['user_id' => $user->id, 'name' => 'Beta']);

        $this->actingAs($user)
            ->patch(route('categories.update', $beta), $this->payload('Alpha'))
            ->assertSessionHasErrors('name');

        $this->assertDatabaseHas('categories', [
            'id' => $beta->id,
            'name' => 'Beta',
        ]);
    }

    public function test_cannot_update_another_accounts_category(): void
    {
        $attacker = User::factory()->create();
        $victim = Category::factory()->create([
            'user_id' => User::factory()->create()->id,
            'name' => 'Untouchable',
        ]);

        $this->actingAs($attacker)
            ->patch(route('categories.update', $victim), $this->payload('Hijacked'))
            ->assertForbidden();

        $this->assertDatabaseHas('categories', [
            'id' => $victim->id,
            'name' => 'Untouchable',
        ]);
    }

    public function test_cannot_delete_another_accounts_category(): void
    {
        $attacker = User::factory()->create();
        $victim = Category::factory()->create(['user_id' => User::factory()->create()->id]);

        $this->actingAs($attacker)
            ->delete(route('categories.destroy', $victim))
            ->assertForbidden();

        $this->assertNotNull(Category::find($victim->id));
    }

    public function test_deleting_keeps_the_knowledge_and_detaches_the_pivot(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id, 'name' => 'Doomed']);
        $first = Knowledge::factory()->create(['user_id' => $user->id]);
        $second = Knowledge::factory()->create(['user_id' => $user->id]);
        $category->knowledge()->attach([$first->id, $second->id]);

        $this->actingAs($user)
            ->delete(route('categories.destroy', $category))
            ->assertRedirect(route('categories.index'))
            ->assertInertiaFlash('toast', [
                'type' => 'success',
                'message' => 'Category deleted successfully.',
            ]);

        $this->assertNull(Category::find($category->id));
        $this->assertDatabaseHas('knowledges', ['id' => $first->id]);
        $this->assertDatabaseHas('knowledges', ['id' => $second->id]);
        $this->assertDatabaseMissing('category_knowledge', ['category_id' => $category->id]);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(string $name): array
    {
        return [
            'name' => $name,
            'color' => '#5C7F4A',
            'icon' => 'code',
        ];
    }
}
