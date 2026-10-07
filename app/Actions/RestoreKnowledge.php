<?php

namespace App\Actions;

use App\Models\Knowledge;
use Illuminate\Support\Facades\DB;

class RestoreKnowledge
{
    /**
     * Bring a Knowledge record back from Trash (PRD 25.3).
     *
     * Category pivot rows for still-existing categories survive the soft
     * delete, so they simply reappear. A category deleted in the meantime
     * lost its pivot row to the foreign-key cascade and is never recreated.
     */
    public function handle(Knowledge $knowledge): Knowledge
    {
        return DB::transaction(function () use ($knowledge): Knowledge {
            $knowledge->restore();

            return $knowledge;
        });
    }
}
