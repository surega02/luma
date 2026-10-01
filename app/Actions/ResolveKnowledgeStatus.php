<?php

namespace App\Actions;

use App\Enums\KnowledgeStatus;
use App\Models\Knowledge;

class ResolveKnowledgeStatus
{
    /**
     * Derive the system-owned status of a Knowledge record.
     *
     * Status is never accepted from the client: it is always recomputed from
     * My Understanding presence and Insight count.
     */
    public function resolve(?string $myUnderstanding, int $insightCount): KnowledgeStatus
    {
        if (blank($myUnderstanding)) {
            return KnowledgeStatus::CAPTURED;
        }

        return $insightCount > 0
            ? KnowledgeStatus::COMPLETE
            : KnowledgeStatus::UNDERSTOOD;
    }

    /**
     * Recalculate and persist the status of an existing Knowledge record.
     */
    public function apply(Knowledge $knowledge): KnowledgeStatus
    {
        $status = $this->resolve(
            $knowledge->my_understanding,
            $knowledge->insights()->count(),
        );

        if ($knowledge->status !== $status) {
            $knowledge->status = $status;
            $knowledge->save();
        }

        return $status;
    }
}
