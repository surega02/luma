<?php

namespace Database\Seeders;

use App\Actions\CreateInsight;
use App\Actions\CreateKnowledge;
use App\Actions\UpdateKnowledge;
use App\Models\Category;
use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Demo account for E12-F01: one realistic collection that exercises every
 * dashboard surface - a mixed status set, three categories, version history,
 * insights, a 30-day growth curve and a record waiting in Trash.
 *
 * php artisan db:seed --class=DemoSeeder
 */
class DemoSeeder extends Seeder
{
    public function __construct(
        private readonly CreateKnowledge $createKnowledge,
        private readonly UpdateKnowledge $updateKnowledge,
        private readonly CreateInsight $createInsight,
    ) {}

    public function run(): void
    {
        $user = User::query()->firstOrCreate(
            ['email' => 'demo@luma.test'],
            [
                'name' => 'Demo User',
                'username' => 'demo',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );

        if (! $user->wasRecentlyCreated && $user->knowledges()->exists()) {
            $this->command->info('Demo data already present for demo@luma.test.');

            return;
        }

        $categories = $this->categories($user);

        $captured = $this->capture($user, [
            'title' => 'The Event Loop',
            'definition' => '<p>Queued callbacks run one turn at a time: microtasks drain before the next task starts.</p>',
            'category_ids' => [$categories['Computer Science']->id],
        ], 18);

        $this->capture($user, [
            'title' => 'Sourdough Hydration',
            'definition' => '<p>Baker percentages scale every ingredient against flour weight, so hydration is water divided by flour.</p>',
            'category_ids' => [$categories['Culinary']->id],
        ], 12);

        $promises = $this->capture($user, [
            'title' => 'Promises',
            'definition' => '<p>A promise represents a value that may arrive later, with then() and catch() chaining the follow-up work.</p>',
            'my_understanding' => '<p>Errors bubble through rejected promises until a catch handler is attached.</p>',
            'category_ids' => [$categories['Computer Science']->id],
        ], 9);

        $this->capture($user, [
            'title' => 'Spanish Subjunctive',
            'definition' => '<p>The subjunctive mood appears after wishes, doubts and impersonal expressions.</p>',
            'my_understanding' => '<p>Use it whenever the speaker doubts or desires rather than states a fact.</p>',
            'category_ids' => [$categories['Language']->id],
        ], 6);

        $closures = $this->capture($user, [
            'title' => 'Closures',
            'definition' => '<p>A function keeps a reference to the scope it was created in, even after that scope exits.</p>',
            'my_understanding' => '<p>Module patterns and event handlers rely on closures to remember private state.</p>',
            'category_ids' => [$categories['Computer Science']->id],
        ], 4);

        $percentages = $this->capture($user, [
            'title' => "Baker's Percentages",
            'definition' => '<p>Every ingredient is expressed as a percentage of the total flour weight.</p>',
            'my_understanding' => '<p>Scaling a recipe becomes arithmetic: multiply each percentage by the new flour weight.</p>',
            'category_ids' => [$categories['Culinary']->id],
        ], 2);

        $scratch = $this->capture($user, [
            'title' => 'Scratch note',
            'definition' => '<p>Look up the exact bake time for the pullman tin.</p>',
        ], 1);

        // Second definition version so the history page has something to page.
        $this->updateKnowledge->handle($promises, [
            'title' => $promises->title,
            'definition' => '<p>A promise represents a value that may arrive later: then() chains success, catch() handles failure, and finally() always runs.</p>',
            'my_understanding' => $promises->my_understanding,
            'category_ids' => [$categories['Computer Science']->id],
        ]);

        $this->createInsight->handle(
            $closures,
            '<p>Closures capture variables by reference, so mutating the outer variable is visible inside.</p>',
        );

        $this->createInsight->handle(
            $percentages,
            '<p>Hydration above 75% needs a gentler mix; below 65% the dough stays stiff and easy to shape.</p>',
        );

        // One record waiting in Trash so the page is never empty in the demo.
        $scratch->delete();

        $this->command->info('Seeded demo@luma.test (password: password) with categories, knowledge, insights and one trashed record.');
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function capture(User $user, array $data, int $daysAgo): Knowledge
    {
        $knowledge = $this->createKnowledge->handle($user, $data);

        $knowledge->timestamps = false;
        $knowledge->created_at = now()->subDays($daysAgo);
        $knowledge->updated_at = now()->subDays($daysAgo);
        $knowledge->save();
        $knowledge->timestamps = true;

        return $knowledge;
    }

    /**
     * @return array<string, Category>
     */
    private function categories(User $user): array
    {
        $definitions = [
            'Computer Science' => ['color' => '#5C7F4A', 'icon' => 'code'],
            'Culinary' => ['color' => '#CDAE86', 'icon' => 'leaf'],
            'Language' => ['color' => '#F26882', 'icon' => 'globe'],
        ];

        $categories = [];

        foreach ($definitions as $name => $attributes) {
            $categories[$name] = $user->categories()->firstOrCreate(
                ['name' => $name],
                $attributes,
            );
        }

        return $categories;
    }
}
