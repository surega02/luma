<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class UsernameLoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_user_can_log_in_with_username()
    {
        $user = User::factory()->create([
            'username' => 'janedoe',
            'email' => 'jane@example.com',
        ]);

        $response = $this->post(route('login'), [
            'email' => 'janedoe',
            'password' => 'password',
        ]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticatedAs($user);
    }

    public function test_user_can_log_in_with_email()
    {
        $user = User::factory()->create([
            'username' => 'janedoe',
            'email' => 'jane@example.com',
        ]);

        $response = $this->post(route('login'), [
            'email' => 'jane@example.com',
            'password' => 'password',
        ]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticatedAs($user);
    }

    public function test_username_login_is_case_insensitive()
    {
        $user = User::factory()->create([
            'username' => 'janedoe',
            'email' => 'jane@example.com',
        ]);

        $this->post(route('login'), [
            'email' => 'JaneDoe',
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
    }

    public function test_unknown_identifier_is_rejected()
    {
        User::factory()->create([
            'username' => 'janedoe',
            'email' => 'jane@example.com',
        ]);

        $response = $this->from(route('login'))->post(route('login'), [
            'email' => 'nobody',
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_wrong_password_is_rejected_for_username_login()
    {
        User::factory()->create([
            'username' => 'janedoe',
            'email' => 'jane@example.com',
        ]);

        $response = $this->from(route('login'))->post(route('login'), [
            'email' => 'janedoe',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }
}
