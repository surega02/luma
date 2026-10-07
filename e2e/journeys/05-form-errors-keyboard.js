import {
    assert,
    bodyText,
    clickText,
    contains,
    createCategory,
    goto,
    register,
    sleep,
    typeIn,
    waitFor,
    waitForToast,
    waitForToastsToClear,
} from '../support.js';

export const label = 'Form errors → Invalid states → Selector keyboard';

export async function run({ page, user }) {
    await register(page, user);
    await createCategory(page, 'Keyboard Basics');

    // An empty submit must land as an announced, wired, in-world error.
    await goto(page, '/knowledge');
    await page.waitForSelector('button[aria-label="Quick Capture"]', {
        timeout: 30000,
    });
    await clickText(
        page,
        'button[aria-label="Quick Capture"]',
        'quick capture',
    );
    await page.waitForSelector('#knowledge-title', { timeout: 15000 });
    await sleep(300);
    await clickText(page, '[role="dialog"] button[type="submit"]', 'save');

    await waitFor(
        async () => contains(await bodyText(page), 'required'),
        'the title validation error',
    );

    const titleState = await page.$eval('#knowledge-title', (node) => ({
        ariaInvalid: node.getAttribute('aria-invalid'),
        describedBy: node.getAttribute('aria-describedby'),
        border: getComputedStyle(node).borderColor,
    }));

    assert(
        titleState.ariaInvalid === 'true',
        'the title field is marked aria-invalid',
    );
    assert(
        titleState.describedBy === 'knowledge-title-error',
        'the title field points at its error message',
    );
    assert(
        titleState.border.includes('178, 30, 75'),
        `the invalid field wears the ruby border (got ${titleState.border})`,
    );

    const errorRole = await page.$eval('#knowledge-title-error', (node) =>
        node.getAttribute('role'),
    );
    assert(errorRole === 'alert', 'the error message is an alert region');

    // Fill the record in so the rest of the journey runs against a live form.
    await typeIn(page, '#knowledge-title', 'Keyboard Navigation');
    await page.click('.rt-editor__content');
    await page.keyboard.type('Arrow keys walk the option list.', { delay: 5 });

    // Opening the panel focuses its search field; Enter takes the single match.
    await clickText(page, '[role="dialog"] button', 'add');
    await page.waitForSelector(
        '[role="dialog"] input[aria-label="Search categories"]',
        { timeout: 10000 },
    );

    const searchFocused = await page.evaluate(
        () =>
            document.activeElement?.getAttribute('aria-label') ===
            'Search categories',
    );
    assert(searchFocused, 'opening the panel focuses the search field');

    await typeIn(
        page,
        '[role="dialog"] input[aria-label="Search categories"]',
        'Keyboard',
    );
    await sleep(300);
    await page.keyboard.press('Enter');

    const picked = await page.$eval(
        '[role="dialog"] input[data-category-option]',
        (node) => node.checked,
    );
    assert(picked, 'Enter selects the single matching category');
    assert(
        contains(await bodyText(page), 'Keyboard Basics'),
        'the picked category appears as a chip',
    );

    // Escape dismisses the panel only: the capture dialog stays open and
    // focus lands back on the Add button.
    await page.keyboard.press('Escape');

    const panelGone = await page.evaluate(
        () => !document.querySelector('input[aria-label="Search categories"]'),
    );
    assert(panelGone, 'Escape closes the option panel');

    const focusBack = await page.evaluate(
        () => document.activeElement?.textContent?.toLowerCase() ?? '',
    );
    assert(focusBack.includes('add'), 'Escape returns focus to the Add button');

    const dialogStillOpen = await page.evaluate(
        () =>
            document.querySelector('[role="dialog"]') !== null &&
            document.querySelector('#knowledge-title') !== null,
    );
    assert(dialogStillOpen, 'Escape leaves the capture dialog itself open');

    // Reopen and walk the list with the arrow keys.
    await clickText(page, '[role="dialog"] button', 'add');
    await page.waitForSelector(
        '[role="dialog"] input[aria-label="Search categories"]',
        { timeout: 10000 },
    );
    await sleep(200);
    await page.keyboard.press('ArrowDown');

    const walked = await page.evaluate(
        () => document.activeElement?.type === 'checkbox',
    );
    assert(walked, 'ArrowDown moves focus onto the first option');

    await page.keyboard.press('ArrowUp');
    const backToSearch = await page.evaluate(
        () =>
            document.activeElement?.getAttribute('aria-label') ===
            'Search categories',
    );
    assert(backToSearch, 'ArrowUp walks focus back to the search field');

    await page.keyboard.press('Escape');
    await waitForToastsToClear(page);
    await clickText(page, '[role="dialog"] button[type="submit"]', 'save');
    await waitForToast(page, 'Knowledge created successfully.');

    await waitFor(
        async () => contains(await bodyText(page), 'Keyboard Navigation'),
        'the saved record on the list',
    );
}
