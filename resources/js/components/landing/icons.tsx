import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
};

/** Clip-top jar with a plus — capture into a vessel. */
export function IconCapture(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M8.5 3.2h7" />
            <path d="M9.2 3.2v2.1c0 .5-.2.9-.6 1.3C7.4 7.7 6.6 9.2 6.6 11v7.1c0 1.6 1.3 2.9 2.9 2.9h5c1.6 0 2.9-1.3 2.9-2.9V11c0-1.8-.8-3.3-2-4.4-.4-.4-.6-.8-.6-1.3V3.2" />
            <path d="M6.9 12.4h10.2" />
            <path d="M12 14.6v4.1M9.95 16.65h4.1" />
        </svg>
    );
}

/** Three stacked, ruled cards — the knowledge list. */
export function IconRecords(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <rect x="3.4" y="7.6" width="13.4" height="12.4" rx="1.6" />
            <path d="M6.6 5.1h9.2c1.8 0 3.2 1.4 3.2 3.2v8.8" />
            <path d="M6.4 11.6h7M6.4 14.7h4.6" />
        </svg>
    );
}

/** Hanging price tag with a punched eye — a category. */
export function IconCategory(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M11.6 3.4h6.2c1.4 0 2.5 1.1 2.5 2.5v6.2c0 .6-.2 1.2-.7 1.6l-6.1 6.1a2.1 2.1 0 0 1-3 0l-6.3-6.3a2.1 2.1 0 0 1 0-3l6.1-6.1c.4-.4 1-.6 1.3-.6Z" />
            <circle cx="16.1" cy="7.9" r="1.5" />
        </svg>
    );
}

/** Fountain-pen nib — reflection written down. */
export function IconInsight(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M12 3.1c3.1 3.1 5.2 6.3 5.2 9.4A5.2 5.2 0 0 1 12 17.7a5.2 5.2 0 0 1-5.2-5.2c0-3.1 2.1-6.3 5.2-9.4Z" />
            <path d="M12 8.6v9.1" />
            <path d="M12 17.7v3.2" />
        </svg>
    );
}

/** Shelf rail with rising blocks — learning growth. */
export function IconGrowth(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M3.2 20.4h17.6" />
            <rect x="4.8" y="13.6" width="4" height="6.8" rx="0.8" />
            <rect x="10.6" y="9.4" width="4" height="11" rx="0.8" />
            <rect x="16.4" y="5.2" width="4" height="15.2" rx="0.8" />
        </svg>
    );
}

export function IconSearch(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <circle cx="10.8" cy="10.8" r="6.4" />
            <path d="m15.6 15.6 4.2 4.2" />
        </svg>
    );
}

export function IconArrow(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M4.5 12h14.2" />
            <path d="m13.2 6.5 5.5 5.5-5.5 5.5" />
        </svg>
    );
}

export function IconClose(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />
        </svg>
    );
}

export function IconRestore(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M4.4 11.2a7.6 7.6 0 1 0 2.3-5.4" />
            <path d="M4.2 4.4v4.2h4.2" />
        </svg>
    );
}

export function IconTrash(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M4.6 6.6h14.8" />
            <path d="M9.4 6.6V4.9c0-.7.6-1.3 1.3-1.3h2.6c.7 0 1.3.6 1.3 1.3v1.7" />
            <path d="M6.6 6.6 7.4 19c0 1.2 1 2.1 2.1 2.1h5c1.2 0 2.1-1 2.1-2.1l.8-12.4" />
        </svg>
    );
}

/** Dill frond — the world's ornament, drawn in the same stroke. */
export function Sprig({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 120 40" className={className} fill="none" aria-hidden="true" focusable="false">
            <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M4 34c18-4 34-11 48-21C64 7 78 3 96 5" />
                <path d="M28 27c-2-5-6-8-11-9M34 24c-1-6-4-10-9-13M44 20c-1-6-3-11-7-15M56 15c0-6-2-11-5-15M68 11c1-6 0-11-3-15M80 8c2-6 2-11 0-16" />
                <path d="M30 26c4-3 9-4 14-3M42 21c4-3 9-4 14-3M54 16c4-3 9-4 14-3M66 12c4-3 9-4 14-3M78 8c4-2 9-3 14-2" />
            </g>
        </svg>
    );
}

/** System-generated status marks: Captured, Understood, Complete. */
export function StatusMark({ state, className = '' }: { state: 'captured' | 'understood' | 'complete'; className?: string }) {
    return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
            <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            {state !== 'captured' && (
                <path
                    d="M8 1.8a6.2 6.2 0 0 1 0 12.4Z"
                    fill="currentColor"
                    stroke="none"
                />
            )}
            {state === 'complete' && <circle cx="8" cy="8" r="6.2" fill="currentColor" stroke="none" />}
        </svg>
    );
}
