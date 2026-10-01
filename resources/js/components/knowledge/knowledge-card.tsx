import { Link } from '@inertiajs/react';
import { ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { show as showKnowledge } from '@/routes/knowledge';
import type { KnowledgeListItem } from '@/types';
import StatusBadge from './status-badge';
import { cardSurface, formatRecordDate } from './stamp';

const actionClass =
    'stamp inline-flex items-center gap-1 rounded-[2px] px-2 py-1 text-[11px] tracking-[0.14em] transition-colors duration-150';

/**
 * The Knowledge list record card: title, definition snippet, categories,
 * status, created date and the three MVP actions (PRD §12).
 */
export default function KnowledgeCard({
    knowledge,
    onDelete,
}: {
    knowledge: KnowledgeListItem;
    onDelete: (id: number) => void;
}) {
    const href = showKnowledge(knowledge.id);

    return (
        <article
            className={cn(
                cardSurface,
                'lift flex flex-col gap-3 p-4 transition-shadow duration-200 hover:shadow-[0_6px_18px_-14px_rgba(46,42,38,0.6)]',
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-[24px] leading-snug font-semibold text-ink">
                    <Link
                        href={href}
                        className="transition-colors hover:text-dill-deep"
                    >
                        {knowledge.title}
                    </Link>
                </h2>
                <StatusBadge
                    status={knowledge.status}
                    className="mt-0.5 shrink-0"
                />
            </div>

            <p className="line-clamp-2 text-[16px] leading-relaxed text-ink-soft">
                {knowledge.definition_snippet || 'No definition yet.'}
            </p>

            <div className="rule-dotted" aria-hidden="true" />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    {knowledge.categories.map((category) => (
                        <span
                            key={category.id}
                            className="stamp inline-flex items-center gap-1.5 rounded-[2px] border border-rule bg-mist px-1.5 py-1 text-[11px] tracking-[0.1em] text-ink-soft"
                        >
                            <span
                                className="size-1.5 rounded-full"
                                style={{ backgroundColor: category.color }}
                                aria-hidden="true"
                            />
                            {category.name}
                        </span>
                    ))}

                    <time
                        className="text-[11px] text-ink-soft"
                        dateTime={knowledge.created_at ?? undefined}
                    >
                        {formatRecordDate(knowledge.created_at)}
                    </time>
                </div>

                <div className="flex items-center">
                    <Link
                        href={href}
                        className={`${actionClass} text-dill-deep hover:bg-dill/10`}
                    >
                        Open
                        <ArrowRight className="size-3" aria-hidden="true" />
                    </Link>
                    <Link
                        href={showKnowledge.url(knowledge.id, {
                            query: { edit: '1' },
                        })}
                        className={`${actionClass} text-ink-soft hover:bg-ink/5 hover:text-ink`}
                    >
                        <Pencil className="size-3" aria-hidden="true" />
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={() => onDelete(knowledge.id)}
                        aria-label={`Delete ${knowledge.title}`}
                        className={`${actionClass} text-ruby hover:bg-ruby/10`}
                    >
                        <Trash2 className="size-3" aria-hidden="true" />
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
}
