import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import RichText from '@/components/knowledge/rich-text';
import { formatRecordDate, labelStamp } from '@/components/knowledge/stamp';
import {
    index as knowledgeIndex,
    show as showKnowledge,
} from '@/routes/knowledge';
import type { KnowledgeVersion, Paginated } from '@/types';

type PageProps = {
    knowledge: { id: number; title: string };
    field: 'definition' | 'understanding';
    history: Paginated<KnowledgeVersion>;
};

const FIELD_LABEL: Record<PageProps['field'], string> = {
    definition: 'Definition',
    understanding: 'My Understanding',
};

/**
 * Read-only Version History (PRD 24): every stored version, newest first,
 * immutable — there is no restore path in the MVP.
 */
export default function KnowledgeHistory() {
    const { knowledge, field, history } = usePage<PageProps>().props;
    const label = FIELD_LABEL[field];

    return (
        <>
            <Head title={`${label} history`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-4 py-8 md:px-6">
                <Link
                    href={showKnowledge.url(knowledge.id)}
                    className="stamp inline-flex w-fit items-center gap-1.5 rounded-[2px] text-[11px] tracking-[0.14em] text-ink-soft transition-colors hover:text-ink"
                >
                    <ChevronLeft className="size-3.5" aria-hidden="true" />
                    Back to {knowledge.title}
                </Link>

                <header className="flex flex-col gap-2 border-b border-rule pb-5">
                    <h1 className="font-sans text-[24px] leading-[1.15] font-semibold text-ink">
                        {label} history
                    </h1>
                    <p className="text-[16px] text-ink-soft">
                        Every saved version, newest first. History is read-only.
                    </p>
                </header>

                {history.data.length === 0 ? (
                    <p className="text-[16px] text-ink-soft">
                        No versions recorded yet. Versions appear after your
                        first save.
                    </p>
                ) : (
                    <ol className="flex flex-col gap-4">
                        {history.data.map((version) => (
                            <li
                                key={version.id}
                                className="flex flex-col gap-2.5 rounded-[3px] border border-rule bg-paper px-5 py-4"
                            >
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <span className="stamp rounded-[2px] border border-rule bg-mist px-2 py-1 text-[11px] tracking-[0.14em] text-ink">
                                        Version {version.version}
                                    </span>
                                    <span
                                        className={labelStamp}
                                        title={version.created_at ?? undefined}
                                    >
                                        {formatRecordDate(version.created_at)} ·{' '}
                                        {formatStampTime(version.created_at)}
                                    </span>
                                </div>

                                <RichText
                                    html={version.content}
                                    className="text-ink"
                                />
                            </li>
                        ))}
                    </ol>
                )}

                {history.last_page > 1 && (
                    <nav className="flex items-center justify-between border-t border-rule pt-4">
                        <PageLink href={history.prev_page_url} rel="prev">
                            <ChevronLeft
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Previous
                        </PageLink>

                        <span className="stamp text-[11px] tracking-[0.14em] text-ink-soft">
                            Page {history.current_page} of {history.last_page}
                        </span>

                        <PageLink href={history.next_page_url} rel="next">
                            Next
                            <ChevronRight
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        </PageLink>
                    </nav>
                )}
            </div>
        </>
    );
}

/**
 * "14:05" next to formatRecordDate's "12 Sep 2026".
 */
function formatStampTime(value: string | null): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function PageLink({
    href,
    rel,
    children,
}: {
    href: string | null;
    rel: 'prev' | 'next';
    children: ReactNode;
}) {
    const stamp =
        'stamp inline-flex items-center gap-1 rounded-[2px] px-2.5 py-1.5 text-[11px] tracking-[0.14em] transition-colors duration-150';

    if (!href) {
        return (
            <span className={`${stamp} cursor-not-allowed text-ink-soft/50`}>
                {children}
            </span>
        );
    }

    return (
        <Link
            rel={rel}
            href={href}
            className={`${stamp} border border-rule text-ink hover:border-ink/40 hover:bg-ink/5`}
        >
            {children}
        </Link>
    );
}

KnowledgeHistory.layout = {
    breadcrumbs: [
        {
            title: 'Knowledge',
            href: knowledgeIndex(),
        },
    ],
};
