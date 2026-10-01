<?php

namespace App\Policies;

use App\Models\Knowledge;
use App\Models\User;

class KnowledgePolicy
{
    /**
     * Determine whether the user can create knowledge.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the knowledge.
     */
    public function view(User $user, Knowledge $knowledge): bool
    {
        return $this->owns($user, $knowledge);
    }

    /**
     * Determine whether the user can update the knowledge.
     */
    public function update(User $user, Knowledge $knowledge): bool
    {
        return $this->owns($user, $knowledge);
    }

    /**
     * Determine whether the user can delete the knowledge (move to Trash).
     */
    public function delete(User $user, Knowledge $knowledge): bool
    {
        return $this->owns($user, $knowledge);
    }

    /**
     * Determine whether the user can restore the knowledge from Trash.
     */
    public function restore(User $user, Knowledge $knowledge): bool
    {
        return $this->owns($user, $knowledge);
    }

    /**
     * Determine whether the user can permanently delete the knowledge.
     */
    public function forceDelete(User $user, Knowledge $knowledge): bool
    {
        return $this->owns($user, $knowledge);
    }

    private function owns(User $user, Knowledge $knowledge): bool
    {
        return $user->id === $knowledge->user_id;
    }
}
