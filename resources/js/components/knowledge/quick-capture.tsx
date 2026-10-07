import { useForm } from '@inertiajs/react';
import { Loader2, Sparkle } from 'lucide-react';
import { lazy, Suspense, useEffect, type FormEvent } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { store as storeKnowledge } from '@/routes/knowledge';
import type { KnowledgeDraft } from './knowledge-fields';
import { categoryPanelIsOpen } from './category-selector';
import { buttonPrimary, buttonSecondary } from './stamp';

/**
 * The field stack pulls in the whole Tiptap editor (≈400 kB). Nothing else on
 * the shell needs it, so it arrives on demand while the dialog shows a
 * form-shaped skeleton rather than a blank panel.
 */
const KnowledgeFields = lazy(() => import('./knowledge-fields'));

function FieldsFallback() {
    return (
        <div className="grid gap-4" aria-hidden="true">
            {[60, 100, 100, 45].map((width, index) => (
                <div
                    key={`field-skeleton-${index + 1}`}
                    className="grid gap-1.5"
                >
                    <div className="h-3 w-20 rounded-[2px] bg-muted" />
                    <div
                        className={`rounded-[3px] bg-muted ${index === 1 || index === 2 ? 'h-24' : 'h-10'}`}
                        style={{ width: `${width}%` }}
                    />
                </div>
            ))}
        </div>
    );
}

const EMPTY: KnowledgeDraft = {
    title: '',
    definition: '',
    my_understanding: '',
    source: '',
    url: '',
    category_ids: [],
};

/**
 * Quick Capture (PRD §11): a global modal that creates Knowledge without
 * leaving the current page. Closing it discards whatever was typed.
 */
export default function QuickCapture({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const { data, setData, post, processing, errors, clearErrors } =
        useForm<KnowledgeDraft>({ ...EMPTY });

    // Closing discards input rather than preserving a draft. Inertia v3 resets
    // to the last submitted values after a successful post, so the discard
    // writes the empty draft explicitly.
    useEffect(() => {
        if (!open) {
            setData({ ...EMPTY });
            clearErrors();
        }
    }, [open, setData, clearErrors]);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(storeKnowledge.url(), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    onClose();
                }
            }}
        >
            <DialogContent
                className="gap-0 overflow-hidden rounded-[3px] border border-ink/30 bg-paper p-0 shadow-[0_30px_60px_-30px_rgba(46,42,38,0.6)] sm:max-w-xl"
                onEscapeKeyDown={(event) => {
                    if (categoryPanelIsOpen()) {
                        event.preventDefault();
                    }
                }}
            >
                <div className="kraft flex items-center gap-3 px-5 py-3.5">
                    <Sparkle className="size-4 text-ink" aria-hidden="true" />
                    <div className="min-w-0">
                        <DialogTitle className="stamp text-[16px] tracking-[0.18em] text-ink">
                            Quick Capture
                        </DialogTitle>
                        <DialogDescription className="truncate text-[16px] text-ink/85">
                            Capture it now. Perfect it later.
                        </DialogDescription>
                    </div>
                </div>

                <form onSubmit={submit} noValidate>
                    <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
                        <Suspense fallback={<FieldsFallback />}>
                            <KnowledgeFields
                                data={data}
                                setData={(next) => setData(next)}
                                errors={errors}
                            />
                        </Suspense>
                    </div>

                    <DialogFooter className="gap-2 border-t border-rule bg-mist px-5 py-4 sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
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
                            Save
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
