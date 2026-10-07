import {
    BASE,
    assert,
    bodyText,
    contains,
    goto,
    login,
    register,
    waitFor,
} from '../support.js';

export const label = 'Profile → Delete Account → signed out for good';

export async function run({ page, user }) {
    await register(page, user);

    await goto(page, '/settings/profile');
    await waitFor(
        async () => contains(await bodyText(page), 'Delete account'),
        'the profile page',
    );

    await page.click('[data-test="delete-user-button"]');
    await page.waitForSelector('[role="dialog"]', { timeout: 15000 });
    await page.waitForSelector('#password', { timeout: 15000 });
    await page.type('#password', user.password, { delay: 5 });
    await page.click('[data-test="confirm-delete-user-button"]');

    await waitFor(
        () => page.url() === `${BASE}/`,
        'the landing page after deleting the account',
    );

    // The deleted account can no longer sign in.
    await login(page, user);
    await waitFor(
        async () => contains(await bodyText(page), 'do not match our records'),
        'the rejected sign-in attempt',
    );

    assert(
        page.url().includes('/login'),
        'the rejected sign-in stays on login',
    );
    assert(
        !page.url().includes('/dashboard'),
        'a deleted account must never reach the dashboard',
    );
}
