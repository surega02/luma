import { router } from '@inertiajs/react';
import { ChevronDown, Loader2, Search, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
    buttonQuiet,
    buttonSecondary,
    inputField,
    labelStamp,
} from '@/components/knowledge/stamp';
import { usePagePending } from '@/hooks/use-page-pending';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as knowledgeIndex } from '@/routes/knowledge';
import type { Category, KnowledgeFilters, KnowledgeSort } from '@/types';
import type { QueryParams } from '@/wayfinder';

const SORT_LABELS: Record<KnowledgeSort, string> = {
    recently_updated: 'Recently updated',
    newest: 'Newest',
    oldest: 'Oldest',
};

const PER_PAGE_OPTIONS = [10, 20, 50] as const;

/**
 * Search, category filter, sort and page size for the Knowledge List
 * (PRD 17-20). Every change lands in the query string so the state
 * survives pagination and the browser back button.
 */
export default function ListToolbar({
    filters,
    categories,
}: {
    filters: KnowledgeFilters;
    categories: Category[];
}) {
    const [search, setSearch] = useState(filters.search);
    const pending = usePagePending();
    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );
    const focused = useRef(false);

    // Never overwrite what someone is still typing with an older response.
    useEffect(() => {
        if (!focused.current) {
            setSearch(filters.search);
        }
    }, [filters.search]);

    useEffect(() => {
        return () => {
            if (debounce.current) {
                clearTimeout(debounce.current);
            }
        };
    }, []);

    const go = (next: Partial<KnowledgeFilters>) => {
        const merged = { ...filters, ...next };
        const query: QueryParams = {};
        const term = merged.search.trim();

        if (term !== '') {
            query.search = term;
        }
        if (merged.category_ids.length > 0) {
            query.category_ids = merged.category_ids;
        }
        if (merged.include_uncategorized) {
            query.include_uncategorized = true;
        }
        if (merged.sort !== 'recently_updated') {
            query.sort = merged.sort;
        }
        if (merged.per_page !== 20) {
            query.per_page = merged.per_page;
        }

        router.get(knowledgeIndex.url({ query }), undefined, {
            only: ['knowledges', 'filters'],
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const onSearchChange = (value: string) => {
        setSearch(value);

        if (debounce.current) {
            clearTimeout(debounce.current);
        }

        debounce.current = setTimeout(() => go({ search: value }), 400);
    };

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();

        if (debounce.current) {
            clearTimeout(debounce.current);
        }

        go({ search });
    };

    const toggleCategory = (id: number) => {
        const selected = filters.category_ids.includes(id)
            ? filters.category_ids.filter((value) => value !== id)
            : [...filters.category_ids, id];

        go({ category_ids: selected });
    };

    const clearAll = () => {
        setSearch('');

        if (debounce.current) {
            clearTimeout(debounce.current);
        }

        go({
            search: '',
            category_ids: [],
            include_uncategorized: false,
        });
    };

    const selectedCategories =
        filters.category_ids.length + (filters.include_uncategorized ? 1 : 0);
    const hasFilters =
        filters.search !== '' ||
        filters.category_ids.length > 0 ||
        filters.include_uncategorized;

    const filterLabel =
        selectedCategories === 0
            ? 'All categories'
            : selectedCategories === 1
              ? '1 category'
              : `${selectedCategories} categories`;

    return (
        <div className="flex flex-col gap-3 border-b border-rule pb-4">
            <div className="flex flex-wrap items-center gap-2">
                <form
                    onSubmit={submitSearch}
                    role="search"
                    className="flex min-w-0 flex-1 items-center gap-2"
                >
                    <div className="relative min-w-0 flex-1">
                        <Search
                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={search}
                            aria-label="Search knowledge"
                            placeholder="Search title, definition, understanding"
                            onFocus={() => {
                                focused.current = true;
                            }}
                            onBlur={() => {
                                focused.current = false;
                            }}
                            onChange={(event) =>
                                onSearchChange(event.target.value)
                            }
                            className={`${inputField} pl-9`}
                        />
                    </div>

                    <button
                        type="submit"
                        className={buttonSecondary}
                        disabled={pending}
                    >
                        {pending && (
                            <Loader2
                                className="size-3.5 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        Search
                    </button>
                </form>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className={`${buttonSecondary} gap-2.5`}
                        >
                            {filterLabel}
                            <ChevronDown
                                className="size-3"
                                aria-hidden="true"
                            />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-60">
                        <DropdownMenuLabel className={labelStamp}>
                            Categories
                        </DropdownMenuLabel>

                        {categories.length === 0 ? (
                            <div className="px-2 py-2 text-[16px] text-ink-soft">
                                No categories yet.
                            </div>
                        ) : (
                            categories.map((category) => (
                                <DropdownMenuCheckboxItem
                                    key={category.id}
                                    checked={filters.category_ids.includes(
                                        category.id,
                                    )}
                                    onCheckedChange={() =>
                                        toggleCategory(category.id)
                                    }
                                    onSelect={(event) => event.preventDefault()}
                                >
                                    <span
                                        className="size-2 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: category.color,
                                        }}
                                        aria-hidden="true"
                                    />
                                    {category.name}
                                </DropdownMenuCheckboxItem>
                            ))
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuCheckboxItem
                            checked={filters.include_uncategorized}
                            onCheckedChange={() =>
                                go({
                                    include_uncategorized:
                                        !filters.include_uncategorized,
                                })
                            }
                            onSelect={(event) => event.preventDefault()}
                        >
                            Uncategorized
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-2">
                    <span className={labelStamp}>Sort</span>
                    <Select
                        value={filters.sort}
                        onValueChange={(value) =>
                            go({ sort: value as KnowledgeSort })
                        }
                    >
                        <SelectTrigger
                            aria-label="Sort knowledge"
                            className={`${inputField} w-auto gap-2 pr-8`}
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {(Object.keys(SORT_LABELS) as KnowledgeSort[]).map(
                                (value) => (
                                    <SelectItem key={value} value={value}>
                                        {SORT_LABELS[value]}
                                    </SelectItem>
                                ),
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <span className={labelStamp}>Per page</span>
                    <Select
                        value={String(filters.per_page)}
                        onValueChange={(value) =>
                            go({ per_page: Number(value) as 10 | 20 | 50 })
                        }
                    >
                        <SelectTrigger
                            aria-label="Knowledge per page"
                            className={`${inputField} w-auto gap-2 pr-8`}
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PER_PAGE_OPTIONS.map((value) => (
                                <SelectItem key={value} value={String(value)}>
                                    {value}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {hasFilters && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[16px] text-ink-soft">
                        Filters on:{' '}
                        {[
                            filters.search !== ''
                                ? `search “${filters.search}”`
                                : null,
                            filters.category_ids.length > 0
                                ? `${filters.category_ids.length} ${filters.category_ids.length === 1 ? 'category' : 'categories'}`
                                : null,
                            filters.include_uncategorized
                                ? 'uncategorized'
                                : null,
                        ]
                            .filter(Boolean)
                            .join(', ')}
                    </span>

                    <button
                        type="button"
                        onClick={clearAll}
                        className={buttonQuiet}
                    >
                        <X className="size-3.5" aria-hidden="true" />
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
