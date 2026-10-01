<?php

namespace Tests\Unit;

use App\Actions\ResolveKnowledgeStatus;
use App\Enums\KnowledgeStatus;
use PHPUnit\Framework\TestCase;

class KnowledgeStatusTest extends TestCase
{
    private ResolveKnowledgeStatus $resolver;

    protected function setUp(): void
    {
        parent::setUp();

        $this->resolver = new ResolveKnowledgeStatus;
    }

    public function test_status_is_captured_when_understanding_is_empty(): void
    {
        $this->assertSame(
            KnowledgeStatus::CAPTURED,
            $this->resolver->resolve(null, 0),
        );

        $this->assertSame(
            KnowledgeStatus::CAPTURED,
            $this->resolver->resolve('', 3),
        );

        $this->assertSame(
            KnowledgeStatus::CAPTURED,
            $this->resolver->resolve('   ', 0),
        );
    }

    public function test_status_is_understood_with_understanding_and_no_insight(): void
    {
        $this->assertSame(
            KnowledgeStatus::UNDERSTOOD,
            $this->resolver->resolve('I get it now', 0),
        );
    }

    public function test_status_is_complete_with_understanding_and_an_insight(): void
    {
        $this->assertSame(
            KnowledgeStatus::COMPLETE,
            $this->resolver->resolve('I get it now', 1),
        );
    }

    public function test_status_values_match_the_erd(): void
    {
        $this->assertSame('captured', KnowledgeStatus::CAPTURED->value);
        $this->assertSame('understood', KnowledgeStatus::UNDERSTOOD->value);
        $this->assertSame('complete', KnowledgeStatus::COMPLETE->value);
    }
}
