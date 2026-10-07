/**
 * The world's stamped-caps control language (DESIGN.md §components).
 *
 * Every Knowledge surface draws its buttons, labels and chips from these
 * strings so the same affordance never looks different twice.
 */

export const buttonBase =
    'stamp inline-flex items-center justify-center gap-1.5 rounded-[3px] px-3.5 py-2 text-[11px] tracking-[0.14em] transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50';

export const buttonPrimary = `${buttonBase} bg-dill text-white hover:bg-dill-deep`;

export const buttonSecondary = `${buttonBase} border border-ink/35 text-ink hover:border-ink hover:bg-ink/5`;

export const buttonQuiet = `${buttonBase} border border-transparent px-2 text-ink-soft hover:border-rule hover:text-ink`;

export const buttonDanger = `${buttonBase} border border-ruby/45 text-ruby hover:bg-ruby/10`;

export const labelStamp = 'stamp text-[11px] tracking-[0.14em] text-ink-soft';

const inputBase =
    'h-10 w-full rounded-[3px] border bg-paper px-3 text-[16px] text-ink placeholder:text-ink-soft focus-visible:outline-hidden focus-visible:ring-2';

export const inputField = `${inputBase} border-input focus-visible:border-dill-deep focus-visible:ring-dill/40`;

export const inputFieldInvalid = `${inputBase} border-ruby focus-visible:border-ruby focus-visible:ring-ruby/30`;

/**
 * The field gets its error treatment only while the server is holding a
 * message for it, so the ruby border never shows on a healthy form (E10-F04).
 */
export function inputClasses(error?: string, extra?: string): string {
    return `${error ? inputFieldInvalid : inputField}${extra ? ` ${extra}` : ''}`;
}

export const cardSurface = 'rounded-[3px] border border-rule bg-paper';

/**
 * Records dates as "12 Sep 2026" without pulling in a date library.
 */
export function formatRecordDate(value: string | null): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}
