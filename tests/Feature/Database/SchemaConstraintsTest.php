<?php

namespace Tests\Feature\Database;

use App\Models\Category;
use App\Models\DefinitionVersion;
use App\Models\Knowledge;
use App\Models\UnderstandingVersion;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SchemaConstraintsTest extends TestCase
{
    use RefreshDatabase;

    public function test_username_must_be_unique(): void
    {
        User::factory()->create(['username' => 'duplicate']);

        $this->expectException(UniqueConstraintViolationException::class);

        User::factory()->create(['username' => 'duplicate']);
    }

    public function test_category_name_is_unique_per_user_and_reusable_across_users(): void
    {
        $first = User::factory()->create();
        $second = User::factory()->create();

        Category::factory()->for($first)->create(['name' => 'Programming']);

        $this->expectException(UniqueConstraintViolationException::class);

        Category::factory()->for($first)->create(['name' => 'Programming']);
    }

    public function test_category_names_can_differ_across_users(): void
    {
        $first = User::factory()->create();
        $second = User::factory()->create();

        Category::factory()->for($first)->create(['name' => 'Programming']);
        $other = Category::factory()->for($second)->create(['name' => 'Programming']);

        $this->assertTrue($other->exists);
    }

    public function test_a_knowledge_category_pair_can_only_be_attached_once(): void
    {
        $knowledge = Knowledge::factory()->create();
        $category = Category::factory()->create();

        $knowledge->categories()->attach($category->id);

        $this->expectException(UniqueConstraintViolationException::class);

        $knowledge->categories()->attach($category->id);
    }

    public function test_definition_version_numbers_are_unique_per_knowledge(): void
    {
        $knowledge = Knowledge::factory()->create();

        DefinitionVersion::factory()->for($knowledge)->create(['version' => 1]);

        $this->expectException(UniqueConstraintViolationException::class);

        DefinitionVersion::factory()->for($knowledge)->create(['version' => 1]);
    }

    public function test_understanding_version_numbers_are_unique_per_knowledge(): void
    {
        $knowledge = Knowledge::factory()->create();

        UnderstandingVersion::factory()->for($knowledge)->create(['version' => 1]);

        $this->expectException(UniqueConstraintViolationException::class);

        UnderstandingVersion::factory()->for($knowledge)->create(['version' => 1]);
    }

    public function test_force_deleting_knowledge_removes_every_dependent_row(): void
    {
        $knowledge = Knowledge::factory()->create();
        $category = Category::factory()->create();

        $knowledge->categories()->attach($category->id);
        $knowledge->insights()->create(['content' => 'Insight.']);
        DefinitionVersion::factory()->for($knowledge)->create();
        UnderstandingVersion::factory()->for($knowledge)->create();

        $knowledge->forceDelete();

        $this->assertDatabaseMissing('knowledges', ['id' => $knowledge->id]);
        $this->assertDatabaseMissing('category_knowledge', ['knowledge_id' => $knowledge->id]);
        $this->assertDatabaseMissing('insights', ['knowledge_id' => $knowledge->id]);
        $this->assertDatabaseMissing('definition_versions', ['knowledge_id' => $knowledge->id]);
        $this->assertDatabaseMissing('understanding_versions', ['knowledge_id' => $knowledge->id]);
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_deleting_a_category_keeps_its_knowledge(): void
    {
        $knowledge = Knowledge::factory()->create();
        $category = Category::factory()->create();

        $knowledge->categories()->attach($category->id);

        $category->delete();

        $this->assertDatabaseHas('knowledges', ['id' => $knowledge->id]);
        $this->assertDatabaseMissing('category_knowledge', ['category_id' => $category->id]);
    }

    public function test_deleting_a_user_removes_their_knowledge(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->for($user)->create();

        $user->delete();

        $this->assertDatabaseMissing('knowledges', ['id' => $knowledge->id]);
    }

    public function test_soft_deleted_knowledge_is_hidden_from_active_queries(): void
    {
        $knowledge = Knowledge::factory()->create();
        $knowledge->delete();

        $this->assertNull(Knowledge::find($knowledge->id));
        $this->assertNotNull(Knowledge::withTrashed()->find($knowledge->id));
        $this->assertSame($knowledge->id, Knowledge::onlyTrashed()->first()?->id);
        $this->assertNull(Knowledge::query()->find($knowledge->id));
    }
}
