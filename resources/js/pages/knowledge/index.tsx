import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Plus, SearchX } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import KnowledgeListSkeleton from '@/components/loading/knowledge-list-skeleton';
import ConfirmDialog from '@/components/knowledge/confirm-dialog';
import KnowledgeCard from '@/components/knowledge/knowledge-card';
import ListToolbar from '@/components/knowledge/list-toolbar';
import { useQuickCapture } from '@/components/knowledge/quick-capture-provider';
import { buttonPrimary, labelStamp } from '@/components/knowledge/stamp';
import { usePagePending } from '@/hooks/use-page-pending';
import {
    destroy as destroyKnowledge,
    index as knowledgeIndex,
} from '@/routes/knowledge';
import type {
    Category,
    KnowledgeFilters,
    KnowledgeListItem,
    Paginated,
} from '@/types';

export default function KnowledgeIndex() {
    const { knowledges, filters, categories } = usePage<{
        knowledges: Paginated<KnowledgeListItem>;
        filters: KnowledgeFilters;
        categories: Category[];
    }>().props;
    const openQuickCapture = useQuickCapture();
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const refreshing = usePagePending();

    const pending = knowledges.data.find((item) => item.id === pendingDelete);
    const hasFilters =
        filters.search !== '' ||
        filters.category_ids.length > 0 ||
        filters.include_uncategorized;
    const showToolbar = knowledges.total > 0 || hasFilters;

    return (
        <>
            <Head title="Knowledge" />

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6">
                <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-5">
                    <div className="flex flex-col gap-1.5">
                        <span className={labelStamp}>Your knowledge</span>
                        <h1 className="font-sans text-[24px] leading-tight font-semibold text-ink">
                            Knowledge
                        </h1>
                        <p className="text-[16px] text-ink-soft">
                            {hasFilters
                                ? `${knowledges.total} ${knowledges.total === 1 ? 'record matches' : 'records match'} your filters`
                                : `${knowledges.total} ${knowledges.total === 1 ? 'record' : 'records'} captured`}
                        </p>
                    </div>
                </header>

                {showToolbar && (
                    <ListToolbar filters={filters} categories={categories} />
                )}

                {refreshing ? (
                    <KnowledgeListSkeleton />
                ) : knowledges.data.length === 0 ? (
                    hasFilters ? (
                        <div className="flex flex-col items-start gap-3 rounded-[3px] border border-dashed border-rule px-6 py-10">
                            <SearchX
                                className="size-6 text-ink-soft"
                                aria-hidden="true"
                            />
                            <h2 className="font-sans text-[24px] font-semibold text-ink">
                                No knowledge matches.
                            </h2>
                            <p className="max-w-md text-[16px] leading-relaxed text-ink/85">
                                Nothing here answers that yet. Try a shorter
                                search, fewer categories, or capture what you
                                are learning now.
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
                        <div className="kraft flex flex-col items-start gap-3 rounded-[3px] border border-rule px-6 py-10">
                            <h2 className="font-sans text-[24px] font-semibold text-ink">
                                Nothing captured yet.
                            </h2>
                            <p className="max-w-md text-[16px] leading-relaxed text-ink/85">
                                Write down what you are learning. Capture the
                                definition first — the rest can wait until you
                                are ready.
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
                    )
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {knowledges.data.map((item) => (
                            <KnowledgeCard
                                key={item.id}
                                knowledge={item}
                                onDelete={setPendingDelete}
                            />
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
                title="Delete this knowledge?"
                description="It moves to Trash, where you can restore it later."
                confirmLabel="Delete"
                cancelLabel="Keep it"
                destructive
                onCancel={() => setPendingDelete(null)}
                onConfirm={() => {
                    if (!pending) {
                        return;
                    }

                    router.delete(destroyKnowledge.url(pending.id), {
                        onFinish: () => setPendingDelete(null),
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

KnowledgeIndex.layout = {
    breadcrumbs: [
        {
            title: 'Knowledge',
            href: knowledgeIndex(),
        },
    ],
};
