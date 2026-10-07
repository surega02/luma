import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, RotateCcw, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import ConfirmDialog from '@/components/knowledge/confirm-dialog';
import {
    cardSurface,
    formatRecordDate,
    labelStamp,
} from '@/components/knowledge/stamp';
import {
    forceDelete as forceDeleteKnowledge,
    index as knowledgeIndex,
    restore as restoreKnowledge,
} from '@/routes/knowledge';
import { index as trashIndex } from '@/routes/trash';
import type { Paginated, TrashKnowledgeCard } from '@/types';

type PageProps = {
    knowledges: Paginated<TrashKnowledgeCard>;
};

const actionClass =
    'stamp inline-flex items-center gap-1 rounded-[2px] px-2 py-1 text-[11px] tracking-[0.14em] transition-colors duration-150';

/**
 * Trash (PRD 25): deleted Knowledge, newest deleted first, with Restore and
 * a confirmed Permanent Delete.
 */
export default function TrashIndex() {
    const { knowledges } = usePage<PageProps>().props;
    const [pendingForceDelete, setPendingForceDelete] = useState<number | null>(
        null,
    );

    const pending = knowledges.data.find(
        (item) => item.id === pendingForceDelete,
    );

    return (
        <>
            <Head title="Trash" />

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6">
                <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-5">
                    <div className="flex flex-col gap-1.5">
                        <span className={labelStamp}>Deleted knowledge</span>
                        <h1 className="font-sans text-[24px] leading-tight font-semibold text-ink">
                            Trash
                        </h1>
                        <p className="text-[16px] text-ink-soft">
                            {knowledges.total === 0
                                ? 'Nothing deleted yet.'
                                : `${knowledges.total} ${knowledges.total === 1 ? 'record' : 'records'} waiting to be restored`}
                        </p>
                    </div>
                </header>

                {knowledges.data.length === 0 ? (
                    <div className="kraft flex flex-col items-start gap-3 rounded-[3px] border border-rule px-6 py-10">
                        <h2 className="font-sans text-[24px] font-semibold text-ink">
                            Trash is empty.
                        </h2>
                        <p className="max-w-md text-[16px] leading-relaxed text-ink/85">
                            Deleted knowledge lands here first. Restore brings
                            it back to your list — nothing is removed until you
                            delete it permanently.
                        </p>
                        <Link
                            href={knowledgeIndex()}
                            className="stamp inline-flex w-fit items-center gap-1.5 rounded-[2px] border border-ink/35 px-3.5 py-2 text-[11px] tracking-[0.14em] text-ink transition-colors hover:border-ink hover:bg-ink/5"
                        >
                            <ChevronLeft
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Back to Knowledge
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {knowledges.data.map((item) => (
                            <article
                                key={item.id}
                                className={`${cardSurface} lift flex flex-col gap-3 p-4`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="font-serif text-[24px] leading-snug font-semibold text-ink">
                                        {item.title}
                                    </h2>
                                </div>

                                <p className="line-clamp-2 text-[16px] leading-relaxed text-ink-soft">
                                    {item.definition_snippet ||
                                        'No definition yet.'}
                                </p>

                                <div
                                    className="rule-dotted"
                                    aria-hidden="true"
                                />

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <time
                                        className="stamp text-[11px] tracking-[0.14em] text-ink-soft"
                                        dateTime={item.deleted_at ?? undefined}
                                    >
                                        Deleted{' '}
                                        {formatRecordDate(item.deleted_at)}
                                    </time>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post(
                                                    restoreKnowledge.url(
                                                        item.id,
                                                    ),
                                                    {},
                                                    { preserveScroll: true },
                                                )
                                            }
                                            className={`${actionClass} text-dill-deep hover:bg-dill/10`}
                                        >
                                            <RotateCcw
                                                className="size-3"
                                                aria-hidden="true"
                                            />
                                            Restore
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPendingForceDelete(item.id)
                                            }
                                            aria-label={`Delete ${item.title} permanently`}
                                            className={`${actionClass} text-ruby hover:bg-ruby/10`}
                                        >
                                            <Trash2
                                                className="size-3"
                                                aria-hidden="true"
                                            />
                                            Delete permanently
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {knowledges.last_page > 1 && (
                    <nav className="flex items-center justify-between border-t border-rule pt-4">
                        <PageLink href={knowledges.prev_page_url} rel="prev">
                            <ChevronLeft
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Previous
                        </PageLink>

                        <span className="stamp text-[11px] tracking-[0.14em] text-ink-soft">
                            Page {knowledges.current_page} of{' '}
                            {knowledges.last_page}
                        </span>

                        <PageLink href={knowledges.next_page_url} rel="next">
                            Next
                            <ChevronRight
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        </PageLink>
                    </nav>
                )}
            </div>

            <ConfirmDialog
                open={pending !== undefined}
                title="Delete this knowledge permanently?"
                description="The record and everything attached to it are removed for good. This cannot be undone."
                confirmLabel="Delete permanently"
                cancelLabel="Keep it in Trash"
                destructive
                onCancel={() => setPendingForceDelete(null)}
                onConfirm={() => {
                    if (!pending) {
                        return;
                    }

                    router.delete(forceDeleteKnowledge.url(pending.id), {
                        preserveScroll: true,
                        onFinish: () => setPendingForceDelete(null),
                    });
                }}
            />
        </>
    );
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

TrashIndex.layout = {
    breadcrumbs: [
        {
            title: 'Trash',
            href: trashIndex(),
        },
    ],
};
