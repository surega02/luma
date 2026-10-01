<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'username' => 'test-user',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('users', [
            'username' => 'test-user',
            'email' => 'test@example.com',
        ]);

        $this->assertNotNull(
            User::where('username', 'test-user')->first()?->email_verified_at,
            'PRD 7.1: registration must not require email verification.',
        );
    }

    public function test_registration_requires_a_unique_username()
    {
        User::factory()->create(['username' => 'test-user']);

        $response = $this->post(route('register.store'), [
            'name' => 'Taken User',
            'username' => 'test-user',
            'email' => 'taken@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('username');
        $this->assertGuest();
    }

    public function test_password_must_be_at_least_eight_characters()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Short Password',
            'username' => 'short-pw',
            'email' => 'short@example.com',
            'password' => 'short7',
            'password_confirmation' => 'short7',
        ]);

        $response->assertSessionHasErrors('password');
        $this->assertGuest();
    }

    public function test_registration_canonicalizes_username_and_email()
    {
        $this->post(route('register.store'), [
            'name' => 'Case User',
            'username' => '  CaseUser  ',
            'email' => 'Mixed@Example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'username' => 'caseuser',
            'email' => 'mixed@example.com',
        ]);
    }
}
