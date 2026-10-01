<?php

namespace Tests\Feature\Knowledge;

use App\Actions\ResolveKnowledgeStatus;
use App\Enums\KnowledgeStatus;
use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResolveKnowledgeStatusTest extends TestCase
{
    use RefreshDatabase;

    private ResolveKnowledgeStatus $resolver;

    protected function setUp(): void
    {
        parent::setUp();

        $this->resolver = app(ResolveKnowledgeStatus::class);
    }

    public function test_status_is_recalculated_when_understanding_is_added(): void
    {
        $knowledge = Knowledge::factory()->create([
            'my_understanding' => null,
            'status' => KnowledgeStatus::CAPTURED,
        ]);

        $knowledge->update(['my_understanding' => 'Now I understand']);

        $status = $this->resolver->apply($knowledge);

        $this->assertSame(KnowledgeStatus::UNDERSTOOD, $status);
        $this->assertSame(KnowledgeStatus::UNDERSTOOD, $knowledge->fresh()->status);
    }

    public function test_first_insight_completes_the_knowledge(): void
    {
        $knowledge = Knowledge::factory()->understood()->create();
        $knowledge->insights()->create(['content' => 'A useful connection.']);

        $status = $this->resolver->apply($knowledge);

        $this->assertSame(KnowledgeStatus::COMPLETE, $status);
        $this->assertSame(KnowledgeStatus::COMPLETE, $knowledge->fresh()->status);
    }

    public function test_removing_the_last_insight_returns_to_understood(): void
    {
        $knowledge = Knowledge::factory()->complete()->create();
        $knowledge->insights()->create(['content' => 'A useful connection.']);
        $knowledge->insights()->delete();

        $status = $this->resolver->apply($knowledge);

        $this->assertSame(KnowledgeStatus::UNDERSTOOD, $status);
    }

    public function test_status_is_persisted_only_when_it_changes(): void
    {
        $knowledge = Knowledge::factory()->understood()->create();
        $originalUpdatedAt = $knowledge->updated_at;

        $this->travel(5)->seconds();

        $this->resolver->apply($knowledge);

        $this->assertTrue(
            $originalUpdatedAt->equalTo($knowledge->fresh()->updated_at),
            'Applying an unchanged status must not touch the record.',
        );
    }

    public function test_status_is_not_mass_assignable(): void
    {
        $user = User::factory()->create();

        $knowledge = $user->knowledges()->create([
            'title' => 'Sneaky',
            'definition' => 'Trying to set status.',
            'status' => KnowledgeStatus::COMPLETE->value,
        ]);

        $this->assertSame(KnowledgeStatus::CAPTURED, $knowledge->fresh()->status);
    }
}
