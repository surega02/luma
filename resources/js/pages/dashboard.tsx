import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import GrowthChart from '@/components/dashboard/growth-chart';
import { useQuickCapture } from '@/components/knowledge/quick-capture-provider';
import StatusBadge from '@/components/knowledge/status-badge';
import {
    buttonPrimary,
    cardSurface,
    formatRecordDate,
    labelStamp,
} from '@/components/knowledge/stamp';
import { dashboard } from '@/routes';
import { show as showKnowledge } from '@/routes/knowledge';
import type { DashboardProps, KnowledgeStatus } from '@/types';

export default function Dashboard() {
    const { progress, growth, recentKnowledge, recentInsights, topCategories } =
        usePage<DashboardProps>().props;
    const openQuickCapture = useQuickCapture();

    return (
        <>
            <Head title="Dashboard" />

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-7 px-4 py-8 md:px-6">
                <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-5">
                    <div className="flex flex-col gap-1.5">
                        <span className={labelStamp}>Learning overview</span>
                        <h1 className="font-sans text-[24px] leading-tight font-semibold text-ink">
                            Dashboard
                        </h1>
                        <p className="text-[16px] text-ink-soft">
                            {progress.total === 0
                                ? 'Nothing captured yet.'
                                : `${progress.total} ${progress.total === 1 ? 'record' : 'records'} in your collection`}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openQuickCapture}
                        className={buttonPrimary}
                    >
                        <Plus className="size-3.5" aria-hidden="true" />
                        Quick Capture
                    </button>
                </header>

                {progress.total === 0 ? (
                    <div className="kraft flex flex-col items-start gap-3 rounded-[3px] border border-rule px-6 py-10">
                        <h2 className="font-sans text-[24px] font-semibold text-ink">
                            No knowledge yet.
                        </h2>
                        <p className="max-w-md text-[16px] leading-relaxed text-ink/85">
                            Your learning overview fills in as soon as you
                            capture something. Write down what you are learning
                            today.
                        </p>
                        <button
                            type="button"
                            onClick={openQuickCapture}
                            className={buttonPrimary}
                        >
                            <Plus className="size-3.5" aria-hidden="true" />
                            Quick Capture
                        </button>
                    </div>
                ) : (
                    <>
                        <Section title="Learning progress">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard
                                    label="Total knowledge"
                                    value={progress.total}
                                />
                                <StatCard
                                    label="Captured"
                                    value={progress.captured}
                                />
                                <StatCard
                                    label="Understood"
                                    value={progress.understood}
                                />
                                <StatCard
                                    label="Complete"
                                    value={progress.complete}
                                />
                            </div>
                        </Section>

                        <Section title="Knowledge growth" note="Last 30 days">
                            <div className={`${cardSurface} p-4`}>
                                <GrowthChart points={growth} />
                            </div>
                        </Section>

                        <div className="grid gap-7 lg:grid-cols-2">
                            <Section title="Recent knowledge">
                                {recentKnowledge.length === 0 ? (
                                    <EmptyLine text="No active knowledge yet." />
                                ) : (
                                    <ul className="flex flex-col divide-y divide-rule rounded-[3px] border border-rule bg-paper">
                                        {recentKnowledge.map((item) => (
                                            <li key={item.id}>
                                                <Link
                                                    href={showKnowledge.url(
                                                        item.id,
                                                    )}
                                                    className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-mist"
                                                >
                                                    <span className="flex min-w-0 flex-col gap-0.5">
                                                        <span className="truncate text-[16px] text-ink">
                                                            {item.title}
                                                        </span>
                                                        <span className="truncate text-[11px] text-ink-soft">
                                                            {item.definition_snippet ||
                                                                'No definition yet.'}
                                                        </span>
                                                    </span>
                                                    <span className="flex shrink-0 items-center gap-2">
                                                        <StatusChip
                                                            status={item.status}
                                                        />
                                                        <ArrowRight
                                                            className="size-3.5 text-ink-soft"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </Section>

                            <Section title="Recent insights">
                                {recentInsights.length === 0 ? (
                                    <EmptyLine text="No insights yet." />
                                ) : (
                                    <ul className="flex flex-col divide-y divide-rule rounded-[3px] border border-rule bg-paper">
                                        {recentInsights.map((insight) => (
                                            <li
                                                key={insight.id}
                                                className="flex flex-col gap-1 px-4 py-3"
                                            >
                                                <span className="text-[16px] leading-relaxed text-ink">
                                                    {plainText(insight.content)}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                                                    <span className="stamp tracking-[0.14em]">
                                                        From
                                                    </span>
                                                    {insight.knowledge ? (
                                                        <Link
                                                            href={showKnowledge.url(
                                                                insight
                                                                    .knowledge
                                                                    .id,
                                                            )}
                                                            className="truncate text-dill-deep transition-colors hover:text-ink"
                                                        >
                                                            {
                                                                insight
                                                                    .knowledge
                                                                    .title
                                                            }
                                                        </Link>
                                                    ) : (
                                                        <span>Untitled</span>
                                                    )}
                                                    <span aria-hidden="true">
                                                        ·
                                                    </span>
                                                    <time
                                                        dateTime={
                                                            insight.created_at ??
                                                            undefined
                                                        }
                                                    >
                                                        {formatRecordDate(
                                                            insight.created_at,
                                                        )}
                                                    </time>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </Section>
                        </div>

                        <Section
                            title="Top categories"
                            note="Ranked by active knowledge"
                        >
                            {topCategories.length === 0 ? (
                                <EmptyLine text="No categories with knowledge yet." />
                            ) : (
                                <ul className="flex flex-col gap-3 rounded-[3px] border border-rule bg-paper px-4 py-4">
                                    {topCategories.map((category) => {
                                        const max =
                                            topCategories[0].knowledge_count;

                                        return (
                                            <li
                                                key={category.id}
                                                className="flex items-center gap-3"
                                            >
                                                <span
                                                    className="size-2.5 shrink-0 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            category.color,
                                                    }}
                                                    aria-hidden="true"
                                                />
                                                <span className="w-40 shrink-0 truncate text-[16px] text-ink">
                                                    {category.name}
                                                </span>
                                                <span className="h-2 flex-1 rounded-full bg-mist">
                                                    <span
                                                        className="block h-2 rounded-full bg-dill"
                                                        style={{
                                                            width: `${Math.max(
                                                                6,
                                                                (category.knowledge_count /
                                                                    Math.max(
                                                                        max,
                                                                        1,
                                                                    )) *
                                                                    100,
                                                            )}%`,
                                                        }}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <span className="stamp w-24 shrink-0 text-right text-[11px] tracking-[0.14em] text-ink-soft">
                                                    {category.knowledge_count}{' '}
                                                    {category.knowledge_count ===
                                                    1
                                                        ? 'item'
                                                        : 'items'}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </Section>
                    </>
                )}
            </div>
        </>
    );
}

function Section({
    title,
    note,
    children,
}: {
    title: string;
    note?: string;
    children: ReactNode;
}) {
    return (
        <section className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className={labelStamp}>{title}</h2>
                {note && (
                    <span className="stamp text-[11px] tracking-[0.14em] text-ink-soft">
                        {note}
                    </span>
                )}
            </div>
            <div>{children}</div>
        </section>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className={`${cardSurface} flex flex-col gap-2 px-4 py-3.5`}>
            <span className="stamp text-[11px] tracking-[0.14em] text-ink-soft">
                {label}
            </span>
            <span className="font-sans text-[34.4px] leading-none font-semibold text-ink tabular-nums">
                {value}
            </span>
        </div>
    );
}

function StatusChip({ status }: { status: KnowledgeStatus }) {
    return <StatusBadge status={status} className="shrink-0" />;
}

function EmptyLine({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 rounded-[3px] border border-dashed border-rule px-4 py-5">
            <Sparkles className="size-4 text-ink-soft" aria-hidden="true" />
            <span className="text-[16px] text-ink-soft">{text}</span>
        </div>
    );
}

/**
 * Insight content is sanitized HTML; the dashboard shows plain text only.
 */
function plainText(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
