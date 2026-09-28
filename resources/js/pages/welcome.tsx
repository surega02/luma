import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { dashboard, login, register } from '@/routes';
import type { RouteDefinition } from '@/wayfinder';
import { IconArrow, IconCapture, IconCategory, IconClose, IconGrowth, IconInsight, IconRecords, IconSearch, Sprig, StatusMark } from '@/components/landing/icons';
import { Vessel, type VesselItem } from '@/components/landing/vessel';

const INK = {
    dill: '#5C7F4A',
    coral: '#F26882',
    ruby: '#B21E4B',
    kraft: '#B08F63',
    deep: '#3F5A33',
};

const shelf: VesselItem[] = [
    {
        title: 'Event Delegation',
        day: 3,
        stage: 'captured',
        category: { name: 'Programming', ink: INK.dill },
        fill: 0.34,
        definition: 'A pattern where one handler on a parent element manages events fired by its descendants.',
    },
    {
        title: 'The Event Loop',
        day: 12,
        stage: 'understood',
        category: { name: 'JavaScript', ink: INK.coral },
        fill: 0.6,
        definition: 'The mechanism that drains the call stack, then lets queued microtasks run before the next macrotask.',
        understanding: 'The stack runs empty, every microtask drains, then exactly one macrotask runs.',
    },
    {
        title: 'Overfitting',
        day: 35,
        stage: 'complete',
        category: { name: 'Machine Learning', ink: INK.ruby },
        fill: 0.9,
        definition: 'A model that learns noise, not the pattern.',
        understanding: 'Passes the practice test, fails the exam.',
        insight: 'Regularisation is a bet on forgetting.',
    },
];

type PreviewItem = {
    title: string;
    definition: string;
    understanding?: string;
    insight?: string;
    categories: Array<{ name: string; ink: string }>;
    stage: 'captured' | 'understood' | 'complete';
    created: string;
};

const preview: PreviewItem[] = [
    {
        title: 'Overfitting',
        definition: 'When a model learns the noise in its training data instead of the underlying pattern.',
        understanding: 'It memorises the answers rather than the rule, so it passes the practice test and fails the exam.',
        insight: 'Regularisation is a bet on which details you are willing to forget.',
        categories: [{ name: 'Machine Learning', ink: INK.ruby }],
        stage: 'complete',
        created: '12 Aug 2026',
    },
    {
        title: 'The Event Loop',
        definition: 'The mechanism that drains the call stack, then lets queued microtasks run before the next macrotask.',
        understanding: 'The stack runs empty, every microtask drains, then exactly one macrotask runs.',
        categories: [{ name: 'JavaScript', ink: INK.coral }],
        stage: 'understood',
        created: '3 Aug 2026',
    },
    {
        title: 'Event Delegation',
        definition: 'A pattern where one handler on a parent element manages events fired by its descendants.',
        categories: [{ name: 'Programming', ink: INK.dill }],
        stage: 'captured',
        created: '24 Aug 2026',
    },
    {
        title: 'Cache-Control',
        definition: 'A response header telling a browser how long it may reuse a stored answer without asking again.',
        categories: [{ name: 'Web', ink: INK.kraft }],
        stage: 'captured',
        created: '2 Sep 2026',
    },
    {
        title: 'Spaced repetition',
        definition: 'Reviewing material at widening intervals, just before you would have forgotten it.',
        understanding: 'The schedule does the work, not the total hours spent reviewing.',
        categories: [{ name: 'Learning', ink: INK.deep }],
        stage: 'understood',
        created: '9 Sep 2026',
    },
    {
        title: 'Rate limiting',
        definition: 'A cap on how many requests one client may send inside a window, enforced by the server.',
        categories: [],
        stage: 'captured',
        created: '18 Sep 2026',
    },
];

const filterChips = ['Programming', 'JavaScript', 'Machine Learning', 'Web', 'Learning', 'Uncategorized'];

const stageText = { captured: 'Captured', understood: 'Understood', complete: 'Complete' } as const;

const loop = [
    { name: 'Capture', copy: 'A title and a definition, saved in seconds from any page. Everything else is optional.' },
    { name: 'Organize', copy: 'File one record under as many categories as it belongs to, with its own colour and icon.' },
    { name: 'Retrieve', copy: 'Search titles, definitions, understandings and insights at once, then filter by category.' },
    { name: 'Reflect', copy: 'Restate it in your own words, add the insight, and the status moves on by itself.' },
];

const extras = [
    {
        icon: IconRecords,
        title: 'Knowledge Management',
        copy: 'Cards, not tables. Open a record to read its definition, add your understanding, and watch its status move from Captured through to Complete.',
    },
    {
        icon: IconCategory,
        title: 'Categories',
        copy: 'Unique names, chosen colours and icons, many per record, picked from a searchable multi-select. Filters combine with OR, so Uncategorized counts too.',
    },
    {
        icon: IconInsight,
        title: 'Insights',
        copy: 'Reflection lives on the record itself. Add, edit or delete an insight and the status recalculates on the spot.',
    },
    {
        icon: IconGrowth,
        title: 'Learning Dashboard',
        copy: 'Thirty days of growth, your five newest records and insights, and the categories you reach for most.',
    },
];

function SectionHeading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <h2 className={`stamp text-[clamp(1.5rem,3vw,2.15rem)] leading-[1.1] tracking-[0.04em] text-balance text-ink ${className}`}>
            {children}
            <Sprig className="ml-3 inline-block h-[0.4em] w-[1.2em] align-middle text-kraft-deep" />
        </h2>
    );
}

function PrimaryAction({ href, children = 'Get Started', className = '' }: { href: RouteDefinition<'get'>; children?: React.ReactNode; className?: string }) {
    return (
        <Link
            href={href}
            className={`stamp inline-flex items-center gap-2 rounded-[3px] bg-dill px-6 py-3 text-[13px] tracking-[0.14em] text-[#fbfaf5] transition-colors duration-200 hover:bg-dill-deep ${className}`}
        >
            {children}
            <IconArrow className="h-4 w-4" />
        </Link>
    );
}

function SecondaryAction({ href, children, className = '' }: { href: RouteDefinition<'get'>; children: React.ReactNode; className?: string }) {
    return (
        <Link
            href={href}
            className={`stamp inline-flex items-center rounded-[3px] border border-ink/35 px-6 py-3 text-[13px] tracking-[0.14em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink/5 ${className}`}
        >
            {children}
        </Link>
    );
}

export default function Welcome() {
    const { auth } = usePage().props;
    const [query, setQuery] = useState('');
    const [active, setActive] = useState<string[]>([]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        return preview.filter((item) => {
            const inCategories =
                active.length === 0 ||
                active.some((chip) =>
                    chip === 'Uncategorized'
                        ? item.categories.length === 0
                        : item.categories.some((c) => c.name === chip),
                );
            if (!inCategories) return false;
            if (!q) return true;
            return [item.title, item.definition, item.understanding, item.insight]
                .filter(Boolean)
                .some((field) => (field as string).toLowerCase().includes(q));
        });
    }, [query, active]);

    const toggleChip = (chip: string) =>
        setActive((prev) => (prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]));

    const hasFilter = query.trim().length > 0 || active.length > 0;

    return (
        <>
            <Head title="Luma — Learn. Capture. Grow." />

            <header className="sticky top-0 z-40 border-b border-rule bg-mist">
                <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 sm:h-[72px] sm:px-8">
                    <a href="/" className="script text-[26px] leading-none text-ink sm:text-[30px]">
                        Luma
                    </a>
                    <nav className="flex items-center gap-3 sm:gap-5" aria-label="Account">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="stamp rounded-[3px] bg-dill px-4 py-2.5 text-[12px] tracking-[0.14em] text-[#fbfaf5] transition-colors hover:bg-dill-deep sm:px-5 sm:text-[13px]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="stamp rounded-[3px] px-2 py-2.5 text-[12px] tracking-[0.14em] text-ink underline decoration-kraft-deep decoration-2 underline-offset-[6px] transition-colors hover:decoration-dill-deep sm:text-[13px]"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={register()}
                                    className="stamp rounded-[3px] bg-dill px-4 py-2.5 text-[12px] tracking-[0.14em] text-[#fbfaf5] transition-colors hover:bg-dill-deep sm:px-5 sm:text-[13px]"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main>
                {/* ---------------------------------------------------------- HERO */}
                <section className="paper-grain border-b border-rule">
                    <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 pt-14 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-24">
                        <div className="lg:col-span-6">
                            <Sprig className="h-5 w-16 text-kraft-deep" />
                            <h1 className="script mt-3 text-[clamp(2.75rem,7vw,6rem)] leading-[1.02] text-ink">
                                Learn. Capture. Grow.
                            </h1>
                            <p className="stamp mt-6 text-[clamp(0.9rem,1.5vw,1.05rem)] leading-[1.5] tracking-[0.14em] text-ink">
                                Capture what you learn. Build what you know.
                            </p>
                            <p className="mt-5 max-w-[62ch] text-[17px] leading-[1.66] text-ink">
                                Luma helps you capture what you learn, organize your knowledge, reflect on your
                                understanding, and turn scattered information into knowledge that grows with you.
                            </p>
                            <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                                <PrimaryAction href={register()} />
                                <SecondaryAction href={login()}>Login</SecondaryAction>
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            {/* desktop / tablet shelf */}
                            <div className="hidden sm:block">
                                <div className="grid grid-cols-3 items-end gap-3 md:gap-5">
                                    <div className="mx-auto w-[82%]">
                                        <Vessel item={shelf[0]} flipable={false} />
                                    </div>
                                    <div className="mx-auto w-[92%]">
                                        <Vessel item={shelf[1]} flipable={false} />
                                    </div>
                                    <div className="mx-auto w-full">
                                        <Vessel item={shelf[2]} autoFlip flipable={false} />
                                    </div>
                                </div>
                                <div className="relative mt-1">
                                    <div className="wood h-[10px] w-full rounded-[2px] shadow-[0_14px_26px_-14px_rgba(46,42,38,0.75)]" />
                                    <div className="mt-[3px] h-[4px] w-[97%] rounded-[2px] bg-ink/12" />
                                </div>
                                <p className="mt-4 text-[11.5px] leading-[1.5] text-ink-soft">
                                    Sample knowledge — synthetic content shown to demonstrate the interface.
                                </p>
                            </div>

                            {/* mobile: one vessel, anatomy open */}
                            <div className="sm:hidden">
                                <div className="flex items-end gap-4">
                                    <div className="w-[46%] shrink-0">
                                        <Vessel item={shelf[2]} flipable={false} />
                                    </div>
                                    <div className="min-w-0 flex-1 pb-6">
                                        <div className="rounded-[3px] shadow-[0_10px_24px_-14px_rgba(46,42,38,0.7)]">
                                            <div className="kraft ticket rounded-[3px] px-3 py-3 text-ink">
                                                <p className="stamp text-[9px] tracking-[0.14em] text-ink/85">
                                                    Inside the vessel
                                                </p>
                                                <dl className="mt-2 space-y-2">
                                                    <div>
                                                        <dt className="stamp text-[8px] text-ink/85">Definition</dt>
                                                        <dd className="text-[11px] leading-[1.35]">{shelf[2].definition}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="stamp text-[8px] text-ink/85">My Understanding</dt>
                                                        <dd className="text-[11px] leading-[1.35]">{shelf[2].understanding}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="stamp text-[8px] text-ink/85">Insight</dt>
                                                        <dd className="text-[11px] leading-[1.35]">{shelf[2].insight}</dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="wood mt-1 h-[10px] w-full rounded-[2px] shadow-[0_14px_26px_-14px_rgba(46,42,38,0.75)]" />
                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-ink-soft">
                                    <span>Day 3 · Captured</span>
                                    <span>Day 12 · Understood</span>
                                    <span>Day 35 · Complete</span>
                                </div>
                                <p className="mt-3 text-[11.5px] leading-[1.5] text-ink-soft">
                                    Sample knowledge — synthetic content shown to demonstrate the interface.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ----------------------------------------------------------- LOOP */}
                <section className="mx-auto max-w-[1240px] px-5 pt-16 pb-16 sm:px-8 lg:pt-24 lg:pb-24">
                    <SectionHeading className="max-w-[18ch]">Capture, organize, retrieve, reflect.</SectionHeading>

                    <div className="relative mt-12 md:mt-16">
                        <div className="rule-dotted absolute top-[7px] left-0 right-0 hidden h-px md:block" aria-hidden="true" />
                        <ol className="grid gap-9 md:grid-cols-4 md:gap-7">
                            {loop.map((step) => (
                                <li key={step.name} className="relative md:pr-4">
                                    <span
                                        className="relative z-10 block h-[15px] w-[15px] rounded-full border-[3px] border-kraft-deep bg-mist"
                                        aria-hidden="true"
                                    />
                                    <h3 className="stamp mt-5 text-[15px] tracking-[0.16em] text-ink">{step.name}</h3>
                                    <p className="mt-2.5 max-w-[36ch] text-[15px] leading-[1.6] text-ink-soft">{step.copy}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* -------------------------------------------------------- FEATURES */}
                <section className="border-y border-rule bg-paper">
                    <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-24">
                        <SectionHeading className="max-w-[16ch]">Everything a learning loop needs.</SectionHeading>

                        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
                            <div className="lg:col-span-5">
                                <IconCapture className="h-14 w-14 text-dill-deep" />
                                <h3 className="stamp mt-6 text-[22px] tracking-[0.06em] text-ink">Quick Capture</h3>
                                <p className="mt-3 max-w-[46ch] text-[16px] leading-[1.65] text-ink">
                                    One modal, reachable from every page in the app. Fill the two required fields and it is
                                    saved; close it and nothing is kept. No drafts, no auto-save, no navigation away from
                                    what you were doing.
                                </p>
                                <dl className="mt-7 border-t border-dotted border-rule">
                                    {[
                                        ['Title', 'Required'],
                                        ['Definition', 'Required'],
                                        ['My Understanding', 'Optional'],
                                        ['Category', 'Optional · many'],
                                        ['Source & URL', 'Optional'],
                                    ].map(([field, weight]) => (
                                        <div key={field} className="flex items-baseline justify-between gap-4 border-b border-dotted border-rule py-3">
                                            <dt className="text-[15px] text-ink">{field}</dt>
                                            <dd className="stamp text-[10px] tracking-[0.16em] text-ink-soft">{weight}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="lg:col-span-7">
                                <ul>
                                    {extras.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <li
                                                key={item.title}
                                                className={`grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 py-6 sm:gap-x-7 ${
                                                    index === 0 ? 'border-b border-dotted border-rule' : 'border-t border-dotted border-rule'
                                                } ${index === 0 ? 'sm:pt-0 sm:border-t-0' : ''}`}
                                            >
                                                <Icon className="mt-1 h-7 w-7 text-dill-deep" />
                                                <div>
                                                    <h3 className="stamp text-[16px] tracking-[0.1em] text-ink sm:text-[17px]">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-2 max-w-[54ch] text-[15.5px] leading-[1.62] text-ink-soft">
                                                        {item.copy}
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --------------------------------------------------------- PREVIEW */}
                <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-24">
                    <SectionHeading className="max-w-[20ch]">Find anything you have captured.</SectionHeading>

                    <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:max-w-[420px]">
                            <label htmlFor="preview-search" className="sr-only">
                                Search knowledge
                            </label>
                            <IconSearch className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-ink-soft" />
                            <input
                                id="preview-search"
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search titles, definitions, insights"
                                className="stamp h-12 w-full rounded-[3px] border border-input bg-paper pr-10 pl-11 text-[13px] tracking-[0.06em] text-ink placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-soft focus-visible:border-dill-deep"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    aria-label="Clear search"
                                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-[3px] p-1 text-ink-soft transition-colors hover:text-ink"
                                >
                                    <IconClose className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setQuery('machine')}
                            className="stamp self-start rounded-[3px] border border-dashed border-kraft-deep px-3 py-2 text-[10.5px] tracking-[0.14em] text-ink-soft transition-colors hover:border-dill-deep hover:text-ink md:self-auto"
                        >
                            Try “machine”
                        </button>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                        {filterChips.map((chip) => {
                            const on = active.includes(chip);
                            return (
                                <button
                                    key={chip}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => toggleChip(chip)}
                                    className={`stamp rounded-[3px] px-3 py-2 text-[10.5px] tracking-[0.12em] transition-colors ${
                                        on
                                            ? 'bg-ink text-mist'
                                            : 'border border-rule bg-paper text-ink-soft hover:border-ink/40 hover:text-ink'
                                    }`}
                                >
                                    {chip}
                                </button>
                            );
                        })}
                    </div>

                    <p aria-live="polite" className="mt-6 text-[13px] text-ink-soft">
                        {results.length} {results.length === 1 ? 'record' : 'records'}
                        {hasFilter ? ' match' : ''} · searched across title, definition, understanding and insight
                    </p>

                    {results.length > 0 ? (
                        <ul className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {results.map((item) => (
                                <li key={item.title} className="lift flex flex-col rounded-[3px] border border-rule bg-paper">
                                    <div className="flex gap-[3px] px-5 pt-5">
                                        {item.categories.length > 0 ? (
                                            item.categories.map((c) => (
                                                <span key={c.name} className="h-[4px] flex-1 rounded-full" style={{ backgroundColor: c.ink }} />
                                            ))
                                        ) : (
                                            <span className="h-[4px] flex-1 rounded-full bg-ink/20" />
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
                                        <h3 className="stamp text-[16px] leading-[1.2] tracking-[0.05em] text-ink">{item.title}</h3>
                                        <p className="mt-2.5 line-clamp-3 text-[14.5px] leading-[1.55] text-ink-soft">
                                            {item.definition}
                                        </p>
                                        <div className="mt-auto pt-5">
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.categories.length > 0 ? (
                                                    item.categories.map((c) => (
                                                        <span
                                                            key={c.name}
                                                            className="stamp rounded-[2px] px-2 py-1 text-[9px] tracking-[0.1em]"
                                                            style={{ backgroundColor: `${c.ink}1f`, color: '#2e2a26' }}
                                                        >
                                                            {c.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="stamp rounded-[2px] border border-rule px-2 py-1 text-[9px] tracking-[0.1em] text-ink-soft">
                                                        Uncategorized
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-dotted border-rule pt-3">
                                                <span className="stamp flex items-center gap-1.5 text-[10px] tracking-[0.12em] text-ink">
                                                    <StatusMark state={item.stage} className="h-[11px] w-[11px] text-dill-deep" />
                                                    {stageText[item.stage]}
                                                </span>
                                                <span className="text-[12px] text-ink-soft">{item.created}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="mt-5 rounded-[3px] border border-dashed border-rule bg-paper px-6 py-14 text-center">
                            <Sprig className="mx-auto h-8 w-24 text-kraft-deep" />
                            <p className="stamp mt-5 text-[14px] tracking-[0.1em] text-ink">
                                {query.trim() ? 'Knowledge not found.' : 'No knowledge found for the selected filter.'}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery('');
                                    setActive([]);
                                }}
                                className="stamp mt-5 rounded-[3px] border border-ink/35 px-4 py-2.5 text-[11px] tracking-[0.14em] text-ink transition-colors hover:bg-ink/5"
                            >
                                Clear search and filters
                            </button>
                        </div>
                    )}
                </section>

                {/* ----------------------------------------------------------- CLOSE */}
                <section className="bg-dill-deep text-mist">
                    <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-24">
                        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
                            <div className="lg:col-span-7">
                                <Sprig className="h-6 w-20 text-mist/60" />
                                <h2 className="script mt-3 text-[clamp(2.25rem,5vw,4rem)] leading-[1.08] text-balance">
                                    Understood, not just stored.
                                </h2>
                                <p className="mt-5 max-w-[54ch] text-[17px] leading-[1.65] text-mist/90">
                                    Every record carries a definition, your own understanding of it, and the insight that
                                    proves you kept it. Luma keeps those three things together, and shows you the status
                                    you have earned.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
                                <Link
                                    href={register()}
                                    className="stamp inline-flex items-center gap-2 rounded-[3px] bg-mist px-6 py-3.5 text-[13px] tracking-[0.14em] text-ink transition-colors hover:bg-white"
                                >
                                    Get Started
                                    <IconArrow className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={login()}
                                    className="stamp inline-flex items-center rounded-[3px] border border-mist/45 px-6 py-3.5 text-[13px] tracking-[0.14em] text-mist transition-colors hover:border-mist hover:bg-mist/10"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-rule bg-mist">
                <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <span className="stamp flex items-center gap-2.5 text-[12px] tracking-[0.2em] text-ink">
                        <Sprig className="h-4 w-12 shrink-0 text-kraft-deep" />
                        Luma · Learn. Capture. Grow.
                    </span>
                    <nav className="flex items-center gap-6" aria-label="Footer">
                        <Link href={login()} className="text-[14px] text-ink-soft underline decoration-kraft-deep decoration-1 underline-offset-4 transition-colors hover:text-ink">
                            Login
                        </Link>
                        <Link href={register()} className="text-[14px] text-ink-soft underline decoration-kraft-deep decoration-1 underline-offset-4 transition-colors hover:text-ink">
                            Register
                        </Link>
                        <span className="text-[13px] text-ink-soft">© 2026 Luma</span>
                    </nav>
                </div>
            </footer>
        </>
    );
}
