import {
    assert,
    bodyText,
    clickKnowledgeLink,
    clickText,
    contains,
    createCategory,
    quickCapture,
    register,
    typeIn,
    waitFor,
    waitForToast,
    waitForToastsToClear,
} from '../support.js';

export const label = 'Register → Capture → Edit → Insight → Complete';

export async function run({ page, user }) {
    await register(page, user);

    await createCategory(page, 'Computer Science');

    await quickCapture(page, {
        title: 'The Event Loop',
        definition: 'Queued callbacks run one turn at a time.',
    });

    await clickKnowledgeLink(page, 'The Event Loop');
    await waitFor(
        () => page.url().includes('/knowledge/'),
        'the knowledge detail page',
    );

    let content = await bodyText(page);
    assert(contains(content, 'The Event Loop'), 'detail page shows the record');
    assert(contains(content, 'captured'), 'status starts as Captured');

    // Edit: an unsafe link must be rejected before anything is saved.
    await clickText(page, 'button', 'edit');
    await page.waitForSelector('#knowledge-url', { timeout: 15000 });
    await page.focus('#knowledge-url');
    await page.keyboard.type('javascript:alert(1)', { delay: 5 });
    await clickText(page, 'form button', 'save changes');

    await waitFor(
        async () => contains(await bodyText(page), 'must be a valid URL'),
        'the unsafe URL validation error',
    );
    content = await bodyText(page);
    assert(
        contains(content, 'Edit knowledge'),
        'an unsafe URL keeps the edit form open',
    );

    // A real https link, an updated definition and My Understanding save
    // cleanly - understanding is what lifts the status to Understood.
    await typeIn(page, '#knowledge-url', 'https://example.com/event-loop');
    await replaceEditor(
        page,
        '#knowledge-understanding',
        'Microtasks drain before the next task starts.',
    );
    await replaceEditor(
        page,
        '#knowledge-definition',
        'The event loop runs one task at a time and drains microtasks between tasks.',
    );
    await clickText(page, 'form button', 'save changes');
    await waitForToast(page, 'Knowledge updated successfully.');

    await waitFor(
        async () => !contains(await bodyText(page), 'Edit knowledge'),
        'the detail view after saving',
    );

    content = await bodyText(page);
    assert(
        contains(content, 'https://example.com/event-loop'),
        'the safe link is rendered on the detail page',
    );
    assert(
        contains(content, 'drains microtasks'),
        'the updated definition is rendered',
    );
    assert(
        contains(content, 'understood'),
        'status becomes Understood once My Understanding exists',
    );

    // An insight moves the record to Complete.
    await waitForToastsToClear(page);
    await clickText(page, 'button', 'add insight');
    await page.waitForSelector('#insight-content', { timeout: 15000 });
    await page.click('#insight-content');
    await page.keyboard.type('Microtasks run before the next task starts.', {
        delay: 5,
    });
    await clickText(page, 'button', 'add insight');
    await waitForToast(page, 'Insight added successfully.');

    content = await bodyText(page);
    assert(
        contains(content, 'complete'),
        'status becomes Complete once an insight exists',
    );
    assert(
        contains(content, 'Microtasks run before the next task starts.'),
        'the new insight is listed',
    );
}

/**
 * Replace the whole contents of one rich text field.
 */
async function replaceEditor(page, selector, value) {
    await page.click(selector);
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.type(value, { delay: 5 });
}
