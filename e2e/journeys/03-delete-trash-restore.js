import {
    assert,
    bodyText,
    clickText,
    contains,
    goto,
    quickCapture,
    register,
    sleep,
    waitFor,
    waitForToast,
    waitForToastsToClear,
} from '../support.js';

export const label = 'Knowledge → Delete → Trash → Restore';

export async function run({ page, user }) {
    await register(page, user);

    await quickCapture(page, {
        title: 'The Event Loop',
        definition: 'Queued callbacks run one turn at a time.',
    });

    // Delete from the list moves the record into Trash.
    await waitForToastsToClear(page);
    await page.click('button[aria-label="Delete The Event Loop"]');
    await page.waitForSelector('[role="dialog"]', { timeout: 15000 });
    await sleep(300);
    await clickText(page, '[role="dialog"] button', 'delete');
    await waitForToast(page, 'Knowledge deleted successfully.');
    await waitFor(
        async () => !contains(await bodyText(page), 'The Event Loop'),
        'the list after deleting',
    );

    // Trash lists the record together with its deleted date.
    await sleep(400);
    await clickText(page, 'a', 'trash');
    await waitFor(() => page.url().includes('/trash'), 'the trash page');
    await waitFor(
        async () => contains(await bodyText(page), 'The Event Loop'),
        'the trashed record',
    );

    const trashed = await bodyText(page);
    assert(
        contains(trashed, 'deleted'),
        'the trashed record shows a deleted date',
    );

    // Restore puts it back on the list and empties Trash.
    await waitForToastsToClear(page);
    await clickText(page, 'button', 'restore');
    await waitForToast(page, 'Knowledge restored successfully.');
    await waitFor(
        async () => contains(await bodyText(page), 'Trash is empty.'),
        'the empty trash page',
    );

    await goto(page, '/knowledge');
    await waitFor(
        async () => contains(await bodyText(page), 'The Event Loop'),
        'the restored record on the list',
    );

    const restored = await bodyText(page);
    assert(
        contains(restored, 'The Event Loop'),
        'the restored record is back on the list',
    );
}
