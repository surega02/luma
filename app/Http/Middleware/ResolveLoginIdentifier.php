<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolve an email-or-username login identifier into the account's email.
 *
 * PRD 7.2 lets people sign in with either. Fortify authenticates against a
 * single field (config fortify.username), so a username is swapped for the
 * matching account email before Fortify's two-factor and credential steps
 * run. When nothing matches, the request is left untouched so authentication
 * fails with the standard "credentials do not match" response.
 */
class ResolveLoginIdentifier
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $field = config('fortify.username');
        $value = is_string($field) ? $request->input($field) : null;

        if (is_string($value) && $value !== '' && ! filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $user = User::query()
                ->where('username', Str::lower(trim($value)))
                ->first();

            if ($user !== null) {
                $request->merge([$field => $user->email]);
            }
        }

        return $next($request);
    }
}
