<?php

namespace Tests\Feature\Settings;

use App\Models\Category;
use App\Models\DefinitionVersion;
use App\Models\Knowledge;
use App\Models\UnderstandingVersion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteAccountTest extends TestCase
{
    use RefreshDatabase;

    public function test_correct_password_permanently_deletes_the_account_and_owned_data(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $knowledge = Knowledge::factory()->for($user)->understood()->create();
        $category = Category::factory()->for($user)->create();
        $knowledge->categories()->attach($category->id);
        $knowledge->insights()->create(['content' => 'A reflection.']);
        DefinitionVersion::factory()->for($knowledge)->create();
        UnderstandingVersion::factory()->for($knowledge)->create();

        $otherKnowledge = Knowledge::factory()->for($other)->create();
        $otherCategory = Category::factory()->for($other)->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), ['password' => 'password']);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('home'));

        $this->assertGuest();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseMissing('knowledges', ['id' => $knowledge->id]);
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
        $this->assertDatabaseMissing('category_knowledge', ['knowledge_id' => $knowledge->id]);
        $this->assertDatabaseMissing('insights', ['knowledge_id' => $knowledge->id]);
        $this->assertDatabaseMissing('definition_versions', ['knowledge_id' => $knowledge->id]);
        $this->assertDatabaseMissing('understanding_versions', ['knowledge_id' => $knowledge->id]);

        $this->assertDatabaseHas('users', ['id' => $other->id]);
        $this->assertDatabaseHas('knowledges', ['id' => $otherKnowledge->id]);
        $this->assertDatabaseHas('categories', ['id' => $otherCategory->id]);
    }

    public function test_wrong_password_blocks_deletion_and_keeps_the_data(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->for($user)->create();

        $response = $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->delete(route('profile.destroy'), ['password' => 'wrong-password']);

        $response->assertSessionHasErrors('password');
        $response->assertRedirect(route('profile.edit'));

        $this->assertAuthenticatedAs($user);
        $this->assertDatabaseHas('users', ['id' => $user->id]);
        $this->assertDatabaseHas('knowledges', ['id' => $knowledge->id]);
    }

    public function test_deleting_an_account_does_not_touch_other_accounts(): void
    {
        $first = User::factory()->create();
        $second = User::factory()->create();

        Knowledge::factory()->for($first)->count(2)->create();
        Knowledge::factory()->for($second)->count(3)->create();

        $this->actingAs($first)
            ->delete(route('profile.destroy'), ['password' => 'password']);

        $this->assertSame(
            3,
            Knowledge::query()->where('user_id', $second->id)->count(),
        );
        $this->assertNull(User::find($first->id));
        $this->assertNotNull(User::find($second->id));
    }
}
