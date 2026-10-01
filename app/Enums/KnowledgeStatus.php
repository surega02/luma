<?php

namespace App\Enums;

enum KnowledgeStatus: string
{
    case CAPTURED = 'captured';
    case UNDERSTOOD = 'understood';
    case COMPLETE = 'complete';

    /**
     * Human readable label for display surfaces.
     */
    public function label(): string
    {
        return match ($this) {
            self::CAPTURED => 'Captured',
            self::UNDERSTOOD => 'Understood',
            self::COMPLETE => 'Complete',
        };
    }

    /**
     * Display order used by dashboard aggregates.
     *
     * @return array<int, self>
     */
    public static function ordered(): array
    {
        return [self::CAPTURED, self::UNDERSTOOD, self::COMPLETE];
    }
}
