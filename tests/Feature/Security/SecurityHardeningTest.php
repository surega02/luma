<?php

namespace Tests\Feature\Security;

use App\Enums\KnowledgeStatus;
use App\Models\Category;
use App\Models\Knowledge;
use App\Models\User;
use App\Queries\DashboardQuery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * E12-F09: security hardening checks that are not covered by the domain
 * suites - URL scheme acceptance, mass assignment, session cookies, debug
 * posture, log hygiene and the defensive ownership scopes.
 */
class SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    /**
     * list<string>
     */
    private const UNSAFE_URLS = [
        'javascript:alert(1)',
        'JavaScript:alert(document.cookie)',
        'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'vbscript:msgbox(1)',
        'file:///etc/passwd',
    ];

    public function test_knowledge_url_rejects_everything_but_http_and_https(): void
    {
        $user = User::factory()->create();

        foreach (self::UNSAFE_URLS as $index => $url) {
            $response = $this->actingAs($user)->post(route('knowledge.store'), [
                'title' => "Unsafe {$index}",
                'definition' => '<p>Body</p>',
                'url' => $url,
            ]);

            $response->assertSessionHasErrors('url');
        }

        $this->assertSame(0, $user->knowledges()->count());

        $this->actingAs($user)->post(route('knowledge.store'), [
            'title' => 'Safe link',
            'definition' => '<p>Body</p>',
            'url' => 'https://example.com/notes',
        ])->assertRedirect(route('knowledge.index'));

        $this->actingAs($user)->post(route('knowledge.store'), [
            'title' => 'Plain http link',
            'definition' => '<p>Body</p>',
            'url' => 'http://example.org/notes',
        ])->assertRedirect(route('knowledge.index'));

        $this->assertSame(2, $user->knowledges()->count());
    }

    public function test_client_cannot_mass_assign_status_owner_or_id_on_create(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();

        $this->actingAs($owner)->post(route('knowledge.store'), [
            'title' => 'Injected',
            'definition' => '<p>Body</p>',
            'user_id' => $intruder->id,
            'status' => KnowledgeStatus::COMPLETE->value,
            'id' => 424242,
        ])->assertRedirect(route('knowledge.index'));

        $knowledge = $owner->knowledges()->firstOrFail();

        $this->assertSame($owner->id, $knowledge->user_id);
        $this->assertSame(KnowledgeStatus::CAPTURED, $knowledge->status);
    }

    public function test_client_cannot_mass_assign_status_owner_or_id_on_update(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $knowledge = Knowledge::factory()->for($owner)->create([
            'status' => KnowledgeStatus::CAPTURED,
        ]);

        $this->actingAs($owner)->patch(route('knowledge.update', $knowledge), [
            'title' => 'Still mine',
            'definition' => '<p>Body</p>',
            'my_understanding' => null,
            'source' => null,
            'url' => null,
            'category_ids' => [],
            'user_id' => $intruder->id,
            'status' => KnowledgeStatus::COMPLETE->value,
        ])->assertRedirect(route('knowledge.show', $knowledge, absolute: false));

        $knowledge->refresh();

        $this->assertSame($owner->id, $knowledge->user_id);
        $this->assertSame(KnowledgeStatus::CAPTURED, $knowledge->status);
        $this->assertSame('Still mine', $knowledge->title);
    }

    public function test_models_keep_credentials_out_of_serialized_arrays(): void
    {
        $user = User::factory()->create();

        $attributes = $user->toArray();

        $this->assertArrayNotHasKey('password', $attributes);
        $this->assertArrayNotHasKey('two_factor_secret', $attributes);
        $this->assertArrayNotHasKey('two_factor_recovery_codes', $attributes);
        $this->assertArrayNotHasKey('remember_token', $attributes);
    }

    public function test_session_cookie_is_http_only_and_same_site(): void
    {
        config(['session.driver' => 'cookie']);

        $response = $this->get('/login');
        $response->assertOk();

        $cookie = collect($response->headers->getCookies())
            ->first(fn ($cookie) => $cookie->getName() === config('session.cookie'));

        $this->assertNotNull($cookie, 'The session cookie must be sent.');
        $this->assertTrue($cookie->isHttpOnly(), 'Session cookies must be HttpOnly.');
        $this->assertSame('lax', $cookie->getSameSite());
        $this->assertContains(config('session.same_site'), ['lax', 'strict']);
        $this->assertTrue(config('session.http_only'));
    }

    public function test_debug_mode_is_off_outside_local_development(): void
    {
        $this->assertFalse(config('app.debug'));
        $this->assertFalse((bool) env('APP_DEBUG', false));
    }

    public function test_passwords_and_reset_tokens_never_reach_the_log(): void
    {
        $path = storage_path('framework/testing/security-hardening.log');
        File::delete($path);

        config([
            'logging.default' => 'security_hardening',
            'logging.channels.security_hardening' => [
                'driver' => 'single',
                'path' => $path,
                'level' => 'debug',
            ],
        ]);

        $password = 'Sup3r-Secret!Passw0rd';

        $this->post(route('register.store'), [
            'name' => 'Log Watcher',
            'username' => 'log-watcher',
            'email' => 'watcher@example.com',
            'password' => $password,
            'password_confirmation' => $password,
        ])->assertRedirect(route('dashboard', absolute: false));

        $this->post(route('password.email'), ['email' => 'watcher@example.com']);

        $contents = File::exists($path) ? File::get($path) : '';

        $this->assertStringNotContainsString($password, $contents);
        $this->assertStringNotContainsString('password_confirmation', $contents);
        $this->assertStringNotContainsString('/reset-password/', $contents);
        $this->assertStringNotContainsString('base64:', $contents);
    }

    public function test_top_categories_ignore_rows_belonging_to_another_account(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();

        $category = Category::factory()->for($owner)->create();
        $foreignKnowledge = Knowledge::factory()->for($intruder)->create();

        // Simulate corrupted pivot data: the pair should never surface.
        DB::table('category_knowledge')->insert([
            'category_id' => $category->id,
            'knowledge_id' => $foreignKnowledge->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $top = app(DashboardQuery::class)->topCategories($owner);

        $this->assertCount(0, $top);
    }

    public function test_category_knowledge_counts_ignore_other_accounts(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();

        $category = Category::factory()->for($owner)->create();
        $own = Knowledge::factory()->for($owner)->create();
        $foreign = Knowledge::factory()->for($intruder)->create();

        DB::table('category_knowledge')->insert([
            [
                'category_id' => $category->id,
                'knowledge_id' => $own->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => $category->id,
                'knowledge_id' => $foreign->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $this->actingAs($owner)
            ->get(route('categories.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('categories/index')
                ->where('categories.0.knowledge_count', 1));
    }
}
