<?php

namespace App\Policies;

use App\Models\Insight;
use App\Models\User;

class InsightPolicy
{
    /**
     * Determine whether the user can view the insight.
     */
    public function view(User $user, Insight $insight): bool
    {
        return $this->owns($user, $insight);
    }

    /**
     * Determine whether the user can update the insight.
     */
    public function update(User $user, Insight $insight): bool
    {
        return $this->owns($user, $insight);
    }

    /**
     * Determine whether the user can delete the insight.
     */
    public function delete(User $user, Insight $insight): bool
    {
        return $this->owns($user, $insight);
    }

    private function owns(User $user, Insight $insight): bool
    {
        return $insight->knowledge !== null
            && $user->id === $insight->knowledge->user_id;
    }
}
