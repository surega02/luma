import {
    assert,
    bodyText,
    clickKnowledgeLink,
    contains,
    createCategory,
    goto,
    mouseClickText,
    quickCapture,
    register,
    sleep,
    waitFor,
} from '../support.js';

export const label = 'Knowledge → Search → Category filter → Detail';

export async function run({ page, user }) {
    await register(page, user);

    await createCategory(page, 'Culinary');
    await createCategory(page, 'Language');

    await quickCapture(page, {
        title: 'Sourdough Hydration',
        definition: 'Baker percentages scale water against flour.',
        category: 'Culinary',
    });
    await quickCapture(page, {
        title: 'Spanish Subjunctive',
        definition: 'Used after wishes, doubts and impersonal expressions.',
        category: 'Language',
    });
    await quickCapture(page, {
        title: 'Scratch Note',
        definition: 'Look up the bake time for the pullman tin.',
    });

    await goto(page, '/knowledge');
    await waitFor(
        async () => contains(await bodyText(page), 'Scratch Note'),
        'all three records on the list',
    );

    // Search narrows the list to the matching record (partial reload path).
    await search(page, 'spanish');
    await waitFor(async () => {
        const content = await bodyText(page);

        return (
            contains(content, 'Spanish Subjunctive') &&
            !contains(content, 'Sourdough Hydration') &&
            !contains(content, 'Scratch Note')
        );
    }, 'the search result');
    assert(
        page.url().includes('search=spanish'),
        'the search lands in the query string',
    );

    // Clearing the search restores the full list.
    await search(page, '');
    await waitFor(
        async () => contains(await bodyText(page), 'Sourdough Hydration'),
        'the list after clearing the search',
    );

    // Category filter shows only that category's records.
    await mouseClickText(page, 'button', 'all categories');
    await waitFor(
        async () => (await page.$('[role="menu"]')) !== null,
        'the category menu to open',
    );
    await mouseClickText(page, '[role="menuitemcheckbox"]', 'culinary');
    await waitFor(async () => {
        const content = await bodyText(page);

        return (
            contains(content, 'Sourdough Hydration') &&
            !contains(content, 'Spanish Subjunctive') &&
            !contains(content, 'Scratch Note')
        );
    }, 'the category filter result');

    // Open the filtered record and confirm its detail page.
    await clickKnowledgeLink(page, 'Sourdough Hydration');
    await waitFor(
        () => page.url().includes('/knowledge/'),
        'the knowledge detail page',
    );

    const content = await bodyText(page);
    assert(contains(content, 'Sourdough Hydration'), 'detail shows the title');
    assert(
        contains(content, 'Baker percentages scale water against flour.'),
        'detail shows the definition',
    );
    assert(contains(content, 'Culinary'), 'detail shows the category');
}

/**
 * Type into the toolbar search and wait out the 400ms debounce plus the
 * partial reload that follows.
 */
async function search(page, value) {
    const selector = 'input[aria-label="Search knowledge"]';

    await page.waitForSelector(selector, { timeout: 15000 });
    await page.focus(selector);
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');

    if (value === '') {
        await page.keyboard.press('Backspace');
    } else {
        await page.keyboard.type(value, { delay: 8 });
    }

    await sleep(700);
}
