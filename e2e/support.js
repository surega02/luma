import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

export const BASE = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:8000';

export const EDGE =
    process.env.E2E_EDGE_PATH ??
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const OUTPUT_DIR = path.join(HERE, 'output');

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

/**
 * `.stamp` labels render as uppercase, so every text match is compared
 * case-insensitively against the rendered body text.
 */
export function contains(haystack, fragment) {
    return haystack.toLowerCase().includes(fragment.toLowerCase());
}

export function newUser(prefix = 'e2e') {
    const stamp = `${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
    const identity = `${prefix}${stamp}`.toLowerCase();

    return {
        name: 'E2E Runner',
        username: identity,
        email: `${identity}@example.com`,
        password: 'password123',
    };
}

export async function launchBrowser() {
    return puppeteer.launch({
        executablePath: EDGE,
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--force-color-profile=srgb',
        ],
        defaultViewport: { width: 1440, height: 960 },
    });
}

export async function openSession(browser) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    const errors = [];

    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
        if (message.type() === 'error') {
            errors.push(`console: ${message.text()}`);
        }
    });

    return { context, page, errors };
}

export async function goto(page, route) {
    await page.goto(`${BASE}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 60000,
    });
}

export async function bodyText(page) {
    return page.evaluate(() =>
        document.body.innerText.replace(/\s+/g, ' ').trim(),
    );
}

export async function waitFor(predicate, label, timeout = 30000) {
    const started = Date.now();
    let last;

    while (Date.now() - started < timeout) {
        last = await predicate();

        if (last) {
            return last;
        }

        await sleep(250);
    }

    throw new Error(
        `timeout waiting for ${label} (last=${JSON.stringify(last)})`,
    );
}

export async function clickText(page, selector, wanted) {
    const handle = await page.evaluateHandle(
        (targetSelector, value) =>
            [...document.querySelectorAll(targetSelector)].find((element) =>
                (element.textContent || '')
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            ) || null,
        selector,
        wanted,
    );

    const element = handle.asElement();

    if (!element) {
        throw new Error(`no <${selector}> containing "${wanted}"`);
    }

    await element.evaluate((node) => node.click());
}

/**
 * Radix menus only open on a real pointer event, so the toolbar dropdown
 * cannot be driven with a synthetic DOM click.
 */
export async function mouseClickText(page, selector, wanted) {
    const point = await page.evaluate(
        (targetSelector, value) => {
            const element = [...document.querySelectorAll(targetSelector)].find(
                (candidate) =>
                    (candidate.textContent || '')
                        .toLowerCase()
                        .includes(value.toLowerCase()),
            );

            if (!element) {
                return null;
            }

            element.scrollIntoView({ block: 'center' });
            const rect = element.getBoundingClientRect();

            return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        },
        selector,
        wanted,
    );

    assert(point, `no <${selector}> containing "${wanted}"`);
    await page.mouse.click(point.x, point.y);
}

export async function clickKnowledgeLink(page, title) {
    const clicked = await page.evaluate((value) => {
        const link = [
            ...document.querySelectorAll('a[href*="/knowledge/"]'),
        ].find((anchor) => (anchor.textContent || '').includes(value));

        if (!link) {
            return false;
        }

        link.click();

        return true;
    }, title);

    assert(clicked, `no knowledge link for "${title}"`);
}

export async function typeIn(page, selector, value) {
    await page.waitForSelector(selector, { timeout: 20000 });
    await page.focus(selector);
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.type(value, { delay: 8 });
}

export async function toastText(page) {
    return page.evaluate(() => {
        const element = document.querySelector('[data-sonner-toast]');

        return element ? element.textContent.trim() : null;
    });
}

export async function waitForToast(page, fragment) {
    await waitFor(async () => {
        const value = await toastText(page);

        return value && value.toLowerCase().includes(fragment.toLowerCase());
    }, `toast "${fragment}"`);
}

export async function waitForToastsToClear(page) {
    await waitFor(
        async () => (await toastText(page)) === null,
        'the toast tray to clear',
        10000,
    );
}

export async function shot(page, name) {
    await page.evaluate(() => document.fonts.ready);
    await sleep(300);
    await page.screenshot({
        path: path.join(OUTPUT_DIR, `${name}.png`),
        fullPage: true,
    });
}

export async function register(page, user) {
    await goto(page, '/register');
    await page.type('[name="name"]', user.name, { delay: 5 });
    await page.type('[name="username"]', user.username, { delay: 5 });
    await page.type('[name="email"]', user.email, { delay: 5 });
    await page.type('[name="password"]', user.password, { delay: 5 });
    await page.type('[name="password_confirmation"]', user.password, {
        delay: 5,
    });
    await page.click('[data-test="register-user-button"]');
    await waitFor(
        () => page.url().includes('/dashboard'),
        'the dashboard after registering',
    );
    await waitFor(
        async () => contains(await bodyText(page), 'No knowledge yet.'),
        'the empty dashboard',
    );
}

export async function login(page, user) {
    await goto(page, '/login');
    await typeIn(page, '#email', user.email);
    await typeIn(page, '#password', user.password);
    await page.click('[data-test="login-button"]');
}

export async function createCategory(page, name) {
    await goto(page, '/categories');
    await clickText(page, 'button', 'new category');
    await page.waitForSelector('#category-name', { timeout: 15000 });
    await typeIn(page, '#category-name', name);
    await clickText(page, '[role="dialog"] button', 'create category');
    await waitForToast(page, 'Category created successfully.');
    await waitFor(
        async () => contains(await bodyText(page), name),
        `category ${name}`,
    );
}

export async function quickCapture(page, { title, definition, category }) {
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
    await sleep(400);
    await typeIn(page, '#knowledge-title', title);
    await page.click('.rt-editor__content');
    await page.keyboard.type(definition, { delay: 5 });

    if (category) {
        await clickText(page, '[role="dialog"] button', 'add');
        await sleep(400);
        await page.waitForSelector(
            '[role="dialog"] input[aria-label="Search categories"]',
            {
                timeout: 10000,
            },
        );
        await typeIn(
            page,
            '[role="dialog"] input[aria-label="Search categories"]',
            category,
        );
        await sleep(400);

        const picked = await page.evaluate((value) => {
            const dialog = document.querySelector('[role="dialog"]');
            const label = [...dialog.querySelectorAll('li label')].find(
                (candidate) =>
                    (candidate.textContent || '')
                        .toLowerCase()
                        .includes(value.toLowerCase()),
            );

            if (!label) {
                return false;
            }

            label.click();

            return true;
        }, category);

        assert(picked, `category option "${category}" not found`);
        await sleep(400);
    }

    await waitForToastsToClear(page);
    await clickText(page, '[role="dialog"] button[type="submit"]', 'save');
    await waitForToast(page, 'Knowledge created successfully.');
    await waitFor(
        async () => contains(await bodyText(page), title),
        `capture ${title}`,
    );
    await sleep(400);
}
