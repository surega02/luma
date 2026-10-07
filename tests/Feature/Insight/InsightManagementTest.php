<?php

namespace Tests\Feature\Insight;

use App\Enums\KnowledgeStatus;
use App\Models\Insight;
use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InsightManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_adding_an_insight_completes_the_knowledge(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create(['user_id' => $user->id]);
        $this->stale($knowledge);

        $this->actingAs($user)
            ->post(route('knowledge.insights.store', $knowledge), [
                'content' => '<p>Callbacks resolve in order.</p>',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('knowledge.show', $knowledge))
            ->assertInertiaFlash('toast', [
                'type' => 'success',
                'message' => 'Insight added successfully.',
            ]);

        $this->assertDatabaseHas('insights', [
            'knowledge_id' => $knowledge->id,
            'content' => '<p>Callbacks resolve in order.</p>',
        ]);

        $knowledge->refresh();
        $this->assertSame(KnowledgeStatus::COMPLETE, $knowledge->status);
        $this->assertTrue(
            $knowledge->updated_at->greaterThan(now()->subMinutes(4)),
            'Adding an Insight must move the Knowledge updated_at.',
        );
    }

    public function test_an_insight_cannot_complete_knowledge_without_understanding(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->post(route('knowledge.insights.store', $knowledge), [
                'content' => '<p>Premature reflection.</p>',
            ])
            ->assertSessionHasNoErrors();

        $knowledge->refresh();
        $this->assertSame(KnowledgeStatus::CAPTURED, $knowledge->status);
    }

    public function test_editing_an_insight_persists_and_refreshes_the_knowledge(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create(['user_id' => $user->id]);
        $insight = Insight::factory()->create([
            'knowledge_id' => $knowledge->id,
            'content' => '<p>First pass.</p>',
        ]);
        $this->stale($knowledge);

        $this->actingAs($user)
            ->patch(route('insights.update', $insight), [
                'content' => '<p>Second pass.</p>',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('knowledge.show', $knowledge))
            ->assertInertiaFlash('toast', [
                'type' => 'success',
                'message' => 'Insight updated successfully.',
            ]);

        $this->assertDatabaseHas('insights', [
            'id' => $insight->id,
            'content' => '<p>Second pass.</p>',
        ]);

        $knowledge->refresh();
        $this->assertSame(KnowledgeStatus::COMPLETE, $knowledge->status);
        $this->assertTrue($knowledge->updated_at->greaterThan(now()->subMinutes(4)));
    }

    public function test_deleting_the_last_insight_returns_complete_to_understood(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create(['user_id' => $user->id]);
        $insight = Insight::factory()->create(['knowledge_id' => $knowledge->id]);
        $this->stale($knowledge);

        $this->actingAs($user)
            ->delete(route('insights.destroy', $insight))
            ->assertRedirect(route('knowledge.show', $knowledge))
            ->assertInertiaFlash('toast', [
                'type' => 'success',
                'message' => 'Insight deleted successfully.',
            ]);

        $this->assertDatabaseMissing('insights', ['id' => $insight->id]);

        $knowledge->refresh();
        $this->assertSame(KnowledgeStatus::UNDERSTOOD, $knowledge->status);
        $this->assertTrue($knowledge->updated_at->greaterThan(now()->subMinutes(4)));
    }

    public function test_deleting_an_insight_keeps_the_other_insights(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create(['user_id' => $user->id]);
        $doomed = Insight::factory()->create(['knowledge_id' => $knowledge->id]);
        $survivor = Insight::factory()->create(['knowledge_id' => $knowledge->id]);

        $this->actingAs($user)
            ->delete(route('insights.destroy', $doomed))
            ->assertRedirect(route('knowledge.show', $knowledge));

        $this->assertDatabaseMissing('insights', ['id' => $doomed->id]);
        $this->assertDatabaseHas('insights', ['id' => $survivor->id]);
        $this->assertSame(KnowledgeStatus::COMPLETE, $knowledge->refresh()->status);
    }

    public function test_insight_content_is_sanitized_before_storage(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->post(route('knowledge.insights.store', $knowledge), [
                'content' => '<p>Keep <strong>this</strong></p><script>alert(1)</script>',
            ])
            ->assertSessionHasNoErrors();

        $insight = Insight::where('knowledge_id', $knowledge->id)->sole();

        $this->assertStringContainsString('<strong>this</strong>', $insight->content);
        $this->assertStringNotContainsString('script', $insight->content);
        $this->assertStringNotContainsString('alert(1)', $insight->content);
    }

    public function test_insight_content_is_required(): void
    {
        $user = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->post(route('knowledge.insights.store', $knowledge), [])
            ->assertSessionHasErrors('content');

        $this->assertSame(0, Insight::count());
    }

    public function test_cannot_add_an_insight_to_another_accounts_knowledge(): void
    {
        $attacker = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create([
            'user_id' => User::factory()->create()->id,
        ]);

        $this->actingAs($attacker)
            ->post(route('knowledge.insights.store', $knowledge), [
                'content' => '<p>Not mine to reflect on.</p>',
            ])
            ->assertForbidden();

        $this->assertSame(0, Insight::count());
    }

    public function test_cannot_edit_or_delete_another_accounts_insight(): void
    {
        $attacker = User::factory()->create();
        $knowledge = Knowledge::factory()->understood()->create([
            'user_id' => User::factory()->create()->id,
        ]);
        $insight = Insight::factory()->create([
            'knowledge_id' => $knowledge->id,
            'content' => '<p>Original.</p>',
        ]);

        $this->actingAs($attacker)
            ->patch(route('insights.update', $insight), [
                'content' => '<p>Hijacked.</p>',
            ])
            ->assertForbidden();

        $this->actingAs($attacker)
            ->delete(route('insights.destroy', $insight))
            ->assertForbidden();

        $this->assertDatabaseHas('insights', [
            'id' => $insight->id,
            'content' => '<p>Original.</p>',
        ]);
    }

    /**
     * Move a record's timestamp into the past so a touch is observable.
     */
    private function stale(Knowledge $knowledge): void
    {
        $knowledge->forceFill(['updated_at' => now()->subMinutes(5)])->saveQuietly();
    }
}
