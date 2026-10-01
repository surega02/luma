<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $input = $this->normalize($input);

        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $user = new User([
            'name' => $input['name'],
            'username' => $input['username'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        // PRD 7.1: email verification is not required for the MVP.
        $user->email_verified_at = now();
        $user->save();

        return $user;
    }

    /**
     * Canonicalize identifiers so login by email or username always matches.
     *
     * @param  array<string, string>  $input
     * @return array<string, string>
     */
    protected function normalize(array $input): array
    {
        foreach (['username', 'email'] as $field) {
            $value = $input[$field] ?? null;

            if (is_string($value)) {
                $input[$field] = Str::lower(trim($value));
            }
        }

        return $input;
    }
}
