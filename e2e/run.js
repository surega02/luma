import fs from 'node:fs';
import {
    launchBrowser,
    newUser,
    openSession,
    OUTPUT_DIR,
    shot,
} from './support.js';

const JOURNEYS = [
    './journeys/01-capture-edit-insight.js',
    './journeys/02-search-filter-detail.js',
    './journeys/03-delete-trash-restore.js',
    './journeys/04-profile-delete.js',
    './journeys/05-form-errors-keyboard.js',
];

async function main() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const browser = await launchBrowser();
    const results = [];

    for (const [index, relativePath] of JOURNEYS.entries()) {
        const journey = await import(relativePath);
        const user = newUser(`e2e${index + 1}`);
        const { context, page, errors } = await openSession(browser);
        const started = Date.now();

        try {
            await journey.run({ page, user });

            if (errors.length > 0) {
                throw new Error(`browser errors: ${errors.join(' | ')}`);
            }

            const duration = Date.now() - started;
            results.push({ label: journey.label, ok: true, duration });
            console.log(`PASS  ${journey.label} (${duration}ms)`);
        } catch (error) {
            results.push({ label: journey.label, ok: false, error });

            try {
                await shot(page, `failure-${index + 1}`);
            } catch {
                // The page may already be gone; the error below is enough.
            }

            console.error(`FAIL  ${journey.label}`);
            console.error(error);
            if (errors.length > 0) {
                console.error('browser errors:', errors);
            }
        } finally {
            await context.close();
        }
    }

    await browser.close();

    const failed = results.filter((result) => !result.ok);
    const passed = results.length - failed.length;

    console.log(`\n${passed}/${results.length} journeys passed`);

    if (failed.length > 0) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error('FAILED', error);
    process.exit(1);
});
