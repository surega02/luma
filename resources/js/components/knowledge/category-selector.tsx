import { router, usePage } from '@inertiajs/react';
import { Check, Loader2, Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
        <div className="grid gap-1.5">
            <div className="flex items-center justify-between gap-2">
                <span className={labelStamp}>Categories</span>

                <button
                    type="button"
                    onClick={() => setOpen((current) => !current)}
                    aria-expanded={open}
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
                <div className="rounded-[3px] border border-rule bg-mist p-2">
                    <div className="flex items-center gap-2 rounded-[3px] border border-input bg-paper px-2">
                        <Search
                            className="size-3.5 shrink-0 text-ink-soft"
                            aria-hidden="true"
                        />
                        <input
                            type="text"
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

                    <InputError message={createError} className="mt-1.5 px-1" />
                </div>
            )}

            <InputError message={error} className="mt-0.5" />
        </div>
    );
}
