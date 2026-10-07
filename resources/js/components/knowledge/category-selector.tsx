import { router, usePage } from '@inertiajs/react';
import { Check, Loader2, Plus, Search, X } from 'lucide-react';
import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from 'react';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';
import { store as storeCategory } from '@/routes/categories';
import type { Category } from '@/types';
import { labelStamp } from './stamp';

type PageProps = {
    categories?: Category[];
};

type SelectorFlash = {
    category?: Category;
};

const NEW_CATEGORY_COLORS = [
    '#CDAE86',
    '#5C7F4A',
    '#F26882',
    '#B21E4B',
    '#DDE6E1',
];

/**
 * Radix dismisses its Dialog on Escape before React's bubble-phase handlers
 * run, so dialogs that contain an open selector panel consult this counter
 * and let the Escape belong to the panel instead (E10-F07).
 */
let openPanels = 0;

export const categoryPanelIsOpen = () => openPanels > 0;

function colorFor(name: string): string {
    const index =
        Array.from(name).reduce(
            (total, char) => total + char.charCodeAt(0),
            0,
        ) % NEW_CATEGORY_COLORS.length;

    return NEW_CATEGORY_COLORS[index];
}

/**
 * Searchable multi-select with inline category creation, so a new category
 * can be made without leaving the Knowledge form (E05-F05).
 */
export default function CategorySelector({
    selectedIds,
    onChange,
    error,
}: {
    selectedIds: number[];
    onChange: (ids: number[]) => void;
    error?: string;
}) {
    const page = usePage<PageProps>();
    const { categories } = page.props;
    const all = useMemo(() => categories ?? [], [categories]);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | undefined>();
    const seenFlashId = useRef<number | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const panelId = useId();
    const errorId = `${panelId}-error`;

    // Inertia v3 keeps flash on the page, not inside props.
    const flashed = (page.flash as SelectorFlash | undefined)?.category;

    useEffect(() => {
        if (!flashed || flashed.id === seenFlashId.current) {
            return;
        }

        seenFlashId.current = flashed.id;

        if (!selectedIds.includes(flashed.id)) {
            onChange([...selectedIds, flashed.id]);
        }

        setQuery('');
        setCreateError(undefined);
    }, [flashed, selectedIds, onChange]);

    // Opening moves focus straight to the search field; a click outside puts
    // the panel away without stealing a click from the form behind it (E10-F07).
    useEffect(() => {
        if (open) {
            searchRef.current?.focus();
        }
    }, [open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        openPanels += 1;

        return () => {
            openPanels -= 1;
        };
    }, [open]);

    // Escape while focus has left the selector (Tab moved on) still belongs
    // to the open panel, so watch it from the document as well.
    useEffect(() => {
        if (!open) {
            return;
        }

        const onDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', onDocumentKeyDown);

        return () => document.removeEventListener('keydown', onDocumentKeyDown);
    }, [open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onPointerDown = (event: PointerEvent) => {
            if (
                rootRef.current &&
                !rootRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('pointerdown', onPointerDown);

        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open]);

    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase();

        if (needle === '') {
            return all;
        }

        return all.filter((category) =>
            category.name.toLowerCase().includes(needle),
        );
    }, [all, query]);

    const exactMatch = all.some(
        (category) =>
            category.name.toLowerCase() === query.trim().toLowerCase(),
    );

    const toggle = (id: number) => {
        onChange(
            selectedIds.includes(id)
                ? selectedIds.filter((selected) => selected !== id)
                : [...selectedIds, id],
        );
    };

    const close = (returnFocus = false) => {
        setOpen(false);

        if (returnFocus) {
            buttonRef.current?.focus();
        }
    };

    /**
     * Full keyboard support for the panel: Escape dismisses it, the arrows and
     * Home/End walk the option list, and Enter picks the single match instead
     * of submitting the Knowledge form behind it (E10-F07).
     */
    const onRootKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            if (open) {
                event.preventDefault();
                event.stopPropagation();
                close(true);
            }

            return;
        }

        if (!open) {
            return;
        }

        const options = Array.from(
            rootRef.current?.querySelectorAll<HTMLInputElement>(
                'input[data-category-option]',
            ) ?? [],
        );
        const index = options.indexOf(
            document.activeElement as HTMLInputElement,
        );

        if (event.key === 'Enter') {
            event.preventDefault();

            if (
                document.activeElement === searchRef.current &&
                visible.length === 1
            ) {
                toggle(visible[0].id);
            }

            return;
        }

        if (options.length === 0) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            options[
                index < 0 ? 0 : Math.min(index + 1, options.length - 1)
            ]?.focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();

            if (index <= 0) {
                searchRef.current?.focus();
            } else {
                options[index - 1]?.focus();
            }
        } else if (event.key === 'Home') {
            event.preventDefault();
            options[0]?.focus();
        } else if (event.key === 'End') {
            event.preventDefault();
            options[options.length - 1]?.focus();
        }
    };

    const createCategory = () => {
        const name = query.trim();

        if (name === '') {
            return;
        }

        setCreating(true);
        setCreateError(undefined);

        router.post(
            storeCategory.url(),
            { name, color: colorFor(name), icon: 'tag' },
            {
                preserveScroll: true,
                onError: (pageErrors) => {
                    setCreateError(pageErrors.name);
                },
                onFinish: () => {
                    setCreating(false);
                },
            },
        );
    };

    const selected = all.filter((category) =>
        selectedIds.includes(category.id),
    );

    return (
        <div ref={rootRef} onKeyDown={onRootKeyDown} className="grid gap-1.5">
            <div className="flex items-center justify-between gap-2">
                <span className={labelStamp}>Categories</span>

                <button
                    type="button"
                    ref={buttonRef}
                    onClick={() => setOpen((current) => !current)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className="stamp inline-flex items-center gap-1 rounded-[2px] border border-dashed border-kraft-deep px-2 py-1 text-[11px] tracking-[0.14em] text-ink-soft transition-colors hover:border-dill-deep hover:text-ink"
                >
                    {open ? (
                        <X className="size-3" aria-hidden="true" />
                    ) : (
                        <Plus className="size-3" aria-hidden="true" />
                    )}
                    {open ? 'Close' : 'Add'}
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
                {selected.length === 0 && (
                    <span className="text-[16px] text-ink-soft">
                        Uncategorized
                    </span>
                )}

                {selected.map((category) => (
                    <span
                        key={category.id}
                        className="stamp inline-flex items-center gap-1.5 rounded-[2px] border border-rule bg-paper px-2 py-1 text-[11px] tracking-[0.1em] text-ink"
                    >
                        <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: category.color }}
                            aria-hidden="true"
                        />
                        {category.name}
                        <button
                            type="button"
                            aria-label={`Remove ${category.name}`}
                            onClick={() => toggle(category.id)}
                            className="text-ink-soft transition-colors hover:text-ruby"
                        >
                            <X className="size-3" aria-hidden="true" />
                        </button>
                    </span>
                ))}
            </div>

            {open && (
                <div
                    id={panelId}
                    className="rounded-[3px] border border-rule bg-mist p-2"
                >
                    <div className="flex items-center gap-2 rounded-[3px] border border-input bg-paper px-2">
                        <Search
                            className="size-3.5 shrink-0 text-ink-soft"
                            aria-hidden="true"
                        />
                        <input
                            type="text"
                            ref={searchRef}
                            value={query}
                            placeholder="Search categories"
                            aria-label="Search categories"
                            onChange={(event) => setQuery(event.target.value)}
                            className="h-8 min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-soft"
                        />
                    </div>

                    <ul className="mt-1.5 max-h-40 overflow-y-auto">
                        {visible.length === 0 && (
                            <li className="px-2 py-2 text-[16px] text-ink-soft">
                                No categories match.
                            </li>
                        )}

                        {visible.map((category) => {
                            const checked = selectedIds.includes(category.id);

                            return (
                                <li key={category.id}>
                                    <label
                                        className={cn(
                                            'flex cursor-pointer items-center gap-2 rounded-[2px] px-2 py-1.5 transition-colors hover:bg-paper',
                                            checked && 'bg-paper',
                                        )}
                                    >
                                        <input
                                            type="checkbox"
                                            data-category-option=""
                                            checked={checked}
                                            onChange={() => toggle(category.id)}
                                            className="size-3.5 accent-dill-deep"
                                        />
                                        <span
                                            className="size-2 rounded-full"
                                            style={{
                                                backgroundColor: category.color,
                                            }}
                                            aria-hidden="true"
                                        />
                                        <span className="text-[16px] text-ink">
                                            {category.name}
                                        </span>
                                        {checked && (
                                            <Check
                                                className="ml-auto size-3.5 text-dill-deep"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>

                    {query.trim() !== '' && !exactMatch && (
                        <button
                            type="button"
                            onClick={createCategory}
                            disabled={creating}
                            className="mt-1.5 flex w-full items-center gap-2 rounded-[2px] border border-dashed border-kraft-deep px-2 py-1.5 text-left text-[16px] text-ink transition-colors hover:border-dill-deep hover:bg-paper disabled:opacity-50"
                        >
                            {creating ? (
                                <Loader2
                                    className="size-3.5 animate-spin"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Plus className="size-3.5" aria-hidden="true" />
                            )}
                            Create “{query.trim()}”
                        </button>
                    )}

                    <InputError
                        id={`${panelId}-create-error`}
                        message={createError}
                        className="mt-1.5 px-1"
                    />
                </div>
            )}

            <InputError id={errorId} message={error} className="mt-0.5" />
        </div>
    );
}
