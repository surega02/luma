<?php

namespace App\Actions;

use App\Models\Knowledge;
use Illuminate\Support\Facades\DB;

class ForceDeleteKnowledge
{
    /**
     * Permanently remove a trashed Knowledge and every dependent MVP row
     * (PRD 39, API spec 17).
     *
     * The foreign keys cascade, but the children are removed explicitly
     * first so the guarantee holds even where FKs are not enforced.
     */
    public function handle(Knowledge $knowledge): void
    {
        DB::transaction(function () use ($knowledge): void {
            $knowledge->categories()->detach();
            $knowledge->insights()->delete();
            $knowledge->definitionVersions()->delete();
            $knowledge->understandingVersions()->delete();

            $knowledge->forceDelete();
        });
    }
}
