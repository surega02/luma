import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, Loader2, Pencil, Trash2 } from 'lucide-react';
import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type ReactNode,
} from 'react';
import ConfirmDialog from '@/components/knowledge/confirm-dialog';
import KnowledgeFields, {
    type KnowledgeDraft,
} from '@/components/knowledge/knowledge-fields';
import RichText from '@/components/knowledge/rich-text';
import StatusBadge from '@/components/knowledge/status-badge';
import {
    buttonDanger,
    buttonPrimary,
    buttonSecondary,
    formatRecordDate,
    labelStamp,
} from '@/components/knowledge/stamp';
import {
    destroy as destroyKnowledge,
    index as knowledgeIndex,
    update as updateKnowledge,
} from '@/routes/knowledge';
import type { KnowledgeDetail } from '@/types';

type PageProps = {
    knowledge: KnowledgeDetail;
    edit?: string;
};

export default function KnowledgeShow() {
    const { knowledge, edit } = usePage<PageProps>().props;
    const [editing, setEditing] = useState(Boolean(edit));
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [leavePrompt, setLeavePrompt] = useState(false);
    const pendingUrl = useRef<string | null>(null);
    const allowLeave = useRef(false);

    const draft = (): KnowledgeDraft => ({
        title: knowledge.title,
        definition: knowledge.definition,
        my_understanding: knowledge.my_understanding ?? '',
        source: knowledge.source ?? '',
        url: knowledge.url ?? '',
        category_ids: knowledge.categories.map((category) => category.id),
    });

    const {
        data,
        setData,
        patch,
        processing,
        errors,
        isDirty,
        reset,
        clearErrors,
        setDefaults,
    } = useForm<KnowledgeDraft>(draft());

    const discard = () => {
        setDefaults(draft());
        reset();
        clearErrors();
        setEditing(false);
        setLeavePrompt(false);
    };

    // Leaving a dirty edit form asks first, both for in-app links and for
    // browser refresh (E04-F05).
    useEffect(() => {
        if (!editing || !isDirty) {
            return;
        }

        const blockLeaving = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', blockLeaving);

        const stopVisit = router.on('before', (event) => {
            if (allowLeave.current) {
                allowLeave.current = false;
                return;
            }

            if (event.detail.visit.method.toLowerCase() !== 'get') {
                return;
            }

            pendingUrl.current = event.detail.visit.url.href;
            setLeavePrompt(true);

            return false;
        });

        return () => {
            window.removeEventListener('beforeunload', blockLeaving);
            stopVisit();
        };
    }, [editing, isDirty]);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        patch(updateKnowledge.url(knowledge.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDefaults(draft());
                reset();
                clearErrors();
                setEditing(false);
            },
        });
    };

    const leaveAnyway = () => {
        const target = pendingUrl.current;
        pendingUrl.current = null;
        allowLeave.current = true;
        discard();

        if (target) {
            router.visit(target);
        }
    };

    const sourceUrl = knowledge.url?.trim() ?? '';
    const linkable = /^https?:\/\//i.test(sourceUrl);

    return (
        <>
            <Head title={knowledge.title} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-4 py-8 md:px-6">
                <Link
                    href={knowledgeIndex()}
                    className="stamp inline-flex w-fit items-center gap-1.5 rounded-[2px] text-[11px] tracking-[0.14em] text-ink-soft transition-colors hover:text-ink"
                >
                    <ArrowLeft className="size-3.5" aria-hidden="true" />
                    Back to Knowledge
                </Link>

                {editing ? (
                    <form
                        onSubmit={submit}
                        noValidate
                        className="flex flex-col gap-6"
                    >
                        <div className="kraft flex items-center justify-between gap-3 px-5 py-3.5">
                            <span className="stamp text-[16px] tracking-[0.18em] text-ink">
                                Edit knowledge
                            </span>
                            <span className="text-[16px] text-ink/85">
                                One save, new definition version.
                            </span>
                        </div>

                        <KnowledgeFields
                            data={data}
                            setData={(next) => setData(next)}
                            errors={errors}
                        />

                        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-rule pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (isDirty) {
                                        setLeavePrompt(true);
                                        return;
                                    }

                                    discard();
                                }}
                                className={buttonSecondary}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className={buttonPrimary}
                            >
                                {processing && (
                                    <Loader2
                                        className="size-3.5 animate-spin"
                                        aria-hidden="true"
                                    />
                                )}
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-5">
                            <div className="flex flex-col gap-2.5">
                                <StatusBadge
                                    status={knowledge.status}
                                    className="self-start"
                                />
                                <h1 className="font-sans text-[24px] leading-[1.15] font-semibold text-ink">
                                    {knowledge.title}
                                </h1>
                                <p className="text-[16px] text-ink-soft">
                                    Created{' '}
                                    {formatRecordDate(knowledge.created_at)}
                                    {knowledge.updated_at !==
                                        knowledge.created_at &&
                                        ` · Updated ${formatRecordDate(knowledge.updated_at)}`}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditing(true)}
                                    className={buttonSecondary}
                                >
                                    <Pencil
                                        className="size-3.5"
                                        aria-hidden="true"
                                    />
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(true)}
                                    className={buttonDanger}
                                >
                                    <Trash2
                                        className="size-3.5"
                                        aria-hidden="true"
                                    />
                                    Delete
                                </button>
                            </div>
                        </header>

                        <Section title="Definition">
                            <RichText
                                html={knowledge.definition}
                                className="text-ink"
                            />
                        </Section>

                        <Section title="My Understanding">
                            {knowledge.my_understanding ? (
                                <RichText
                                    html={knowledge.my_understanding}
                                    className="text-ink"
                                />
                            ) : (
                                <p className="text-[16px] text-ink-soft">
                                    Not captured yet.
                                </p>
                            )}
                        </Section>

                        <Section title="Insights">
                            {knowledge.insights.length === 0 ? (
                                <p className="text-[16px] text-ink-soft">
                                    No insights yet.
                                </p>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {knowledge.insights.map((insight) => (
                                        <li
                                            key={insight.id}
                                            className="rounded-[3px] border border-rule bg-mist px-3.5 py-2.5 text-[16px] leading-relaxed text-ink"
                                        >
                                            {insight.content}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Section>

                        <Section title="Categories">
                            {knowledge.categories.length === 0 ? (
                                <span className="text-[16px] text-ink-soft">
                                    Uncategorized
                                </span>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {knowledge.categories.map((category) => (
                                        <span
                                            key={category.id}
                                            className="stamp inline-flex items-center gap-1.5 rounded-[2px] border border-rule bg-paper px-2 py-1 text-[11px] tracking-[0.1em] text-ink"
                                        >
                                            <span
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        category.color,
                                                }}
                                                aria-hidden="true"
                                            />
                                            {category.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </Section>

                        <Section title="Source">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[16px] text-ink">
                                    {knowledge.source || 'No source recorded.'}
                                </span>

                                {sourceUrl !== '' && (
                                    <span className="text-[16px] break-all text-ink-soft">
                                        {sourceUrl}
                                    </span>
                                )}

                                {linkable && (
                                    <a
                                        href={sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="stamp inline-flex w-fit items-center gap-1.5 rounded-[2px] border border-rule px-2 py-1 text-[11px] tracking-[0.14em] text-dill-deep transition-colors hover:border-dill-deep hover:bg-dill/10"
                                    >
                                        Open Source
                                        <ExternalLink
                                            className="size-3"
                                            aria-hidden="true"
                                        />
                                    </a>
                                )}
                            </div>
                        </Section>
                    </>
                )}
            </div>

            <ConfirmDialog
                open={confirmDelete}
                title="Delete this knowledge?"
                description="It moves to Trash, where you can restore it later."
                confirmLabel="Delete"
                cancelLabel="Keep it"
                destructive
                onCancel={() => setConfirmDelete(false)}
                onConfirm={() => {
                    setConfirmDelete(false);
                    router.delete(destroyKnowledge.url(knowledge.id));
                }}
            />

            <ConfirmDialog
                open={leavePrompt}
                title="Leave with unsaved changes?"
                description="Your edits to this knowledge will be lost."
                confirmLabel="Leave"
                cancelLabel="Stay"
                destructive
                onCancel={() => {
                    setLeavePrompt(false);
                    pendingUrl.current = null;
                }}
                onConfirm={leaveAnyway}
            />
        </>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="flex flex-col gap-2.5">
            <h2 className={labelStamp}>{title}</h2>
            <div>{children}</div>
            <div className="rule-dotted mt-1" aria-hidden="true" />
        </section>
    );
}

KnowledgeShow.layout = {
    breadcrumbs: [
        {
            title: 'Knowledge',
            href: knowledgeIndex(),
        },
    ],
};
