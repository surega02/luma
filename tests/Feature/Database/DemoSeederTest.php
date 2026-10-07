<?php

namespace Tests\Feature\Database;

use App\Models\User;
use Database\Seeders\DemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_seeder_builds_a_complete_demo_account(): void
    {
        $this->seed(DemoSeeder::class);

        $user = User::query()->where('email', 'demo@luma.test')->firstOrFail();

        $this->assertCount(3, $user->categories()->get());
        $this->assertSame(6, $user->knowledges()->count());
        $this->assertSame(1, $user->knowledges()->onlyTrashed()->count());

        $statuses = $user->knowledges()
            ->pluck('status')
            ->map(fn ($status) => $status->value)
            ->all();

        $counts = array_count_values($statuses);
        $this->assertSame(2, $counts['captured']);
        $this->assertSame(2, $counts['understood']);
        $this->assertSame(2, $counts['complete']);

        $promises = $user->knowledges()->where('title', 'Promises')->firstOrFail();
        $this->assertSame(2, $promises->definitionVersions()->count());

        $this->assertSame(2, $user->knowledges()->with('insights')->get()->sum(
            fn ($knowledge) => $knowledge->insights->count(),
        ));

        // Re-running stays idempotent instead of duplicating the collection.
        $this->seed(DemoSeeder::class);

        $this->assertSame(6, $user->knowledges()->count());
        $this->assertSame(3, $user->categories()->count());
    }
}
