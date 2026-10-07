import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CategoryIcon from '@/components/categories/category-icon';
import CategoryModal from '@/components/categories/category-modal';
import CategoryListSkeleton from '@/components/loading/category-list-skeleton';
import ConfirmDialog from '@/components/knowledge/confirm-dialog';
import {
    buttonDanger,
    buttonPrimary,
    buttonSecondary,
    labelStamp,
} from '@/components/knowledge/stamp';
import { usePagePending } from '@/hooks/use-page-pending';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    destroy as destroyCategory,
    index as categoriesIndex,
} from '@/routes/categories';
import type { CategoryListItem } from '@/types';

type CategorySort = 'az' | 'newest' | 'most_knowledge';

const SORT_LABELS: Record<CategorySort, string> = {
    az: 'A–Z',
    newest: 'Newest',
    most_knowledge: 'Most knowledge',
};

const SORTS = Object.keys(SORT_LABELS) as CategorySort[];

export default function CategoriesIndex() {
    const { categories, sorting } = usePage<{
        categories: CategoryListItem[];
        sorting: { current: string };
    }>().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<CategoryListItem | null>(null);
    const [pendingDelete, setPendingDelete] = useState<CategoryListItem | null>(
        null,
    );
    const refreshing = usePagePending();

    const openCreate = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (category: CategoryListItem) => {
        setEditing(category);
        setModalOpen(true);
    };

    const changeSort = (value: string) => {
        const sort = (
            SORTS.includes(value as CategorySort) ? value : 'az'
        ) as CategorySort;

        router.get(
            categoriesIndex.url({
                query: sort === 'az' ? undefined : { sort },
            }),
            undefined,
            {
                only: ['categories', 'sorting'],
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const deleteDescription = (() => {
        if (!pendingDelete) {
            return '';
        }

        if (pendingDelete.knowledge_count === 0) {
            return 'No knowledge uses this category yet. Delete it?';
        }

        const items =
            pendingDelete.knowledge_count === 1
                ? '1 knowledge item'
                : `${pendingDelete.knowledge_count} knowledge items`;

        return `This category is used by ${items}. Delete it? The knowledge stays, it just loses this category.`;
    })();

    return (
        <>
            <Head title="Categories" />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-6">
                <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-5">
                    <div className="flex flex-col gap-1.5">
                        <span className={labelStamp}>Your categories</span>
                        <h1 className="font-sans text-[24px] leading-tight font-semibold text-ink">
                            Categories
                        </h1>
                        <p className="text-[16px] text-ink-soft">
                            {categories.length}{' '}
                            {categories.length === 1
                                ? 'category'
                                : 'categories'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                        className={buttonPrimary}
                    >
                        <Plus className="size-3.5" aria-hidden="true" />
                        New category
                    </button>
                </header>

                {categories.length === 0 ? (
                    <div className="kraft flex flex-col items-start gap-3 rounded-[3px] border border-rule px-6 py-10">
                        <h2 className="font-sans text-[24px] font-semibold text-ink">
                            No categories yet.
                        </h2>
                        <p className="max-w-md text-[16px] leading-relaxed text-ink/85">
                            Categories keep related knowledge together, and you
                            can add as many as you need to one record.
                        </p>
                        <button
                            type="button"
                            onClick={openCreate}
                            className={buttonPrimary}
                        >
                            <Plus className="size-3.5" aria-hidden="true" />
                            New category
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <span className={labelStamp}>Sort</span>
                            <Select
                                value={sorting.current}
                                onValueChange={changeSort}
                            >
                                <SelectTrigger
                                    aria-label="Sort categories"
                                    className="h-10 w-auto gap-2 rounded-[3px] border border-input bg-paper pr-8 text-[16px] text-ink"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORTS.map((value) => (
                                        <SelectItem key={value} value={value}>
                                            {SORT_LABELS[value]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {refreshing ? (
                            <CategoryListSkeleton />
                        ) : (
                            <ul className="rounded-[3px] border border-rule bg-paper px-4">
                                {categories.map((category) => (
                                    <li
                                        key={category.id}
                                        className="flex flex-wrap items-center gap-4 border-b border-rule py-3.5 last:border-b-0"
                                    >
                                        <CategoryIcon
                                            icon={category.icon}
                                            color={category.color}
                                        />

                                        <span className="min-w-0 flex-1 font-serif text-[16px] font-semibold text-ink">
                                            {category.name}
                                        </span>

                                        <span className="text-[11px] text-ink-soft">
                                            {category.knowledge_count === 1
                                                ? '1 knowledge item'
                                                : `${category.knowledge_count} knowledge items`}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEdit(category)
                                                }
                                                className={buttonSecondary}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPendingDelete(category)
                                                }
                                                className={buttonDanger}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>

            <CategoryModal
                open={modalOpen}
                category={editing}
                onClose={() => setModalOpen(false)}
            />

            <ConfirmDialog
                open={pendingDelete !== null}
                title="Delete this category?"
                description={deleteDescription}
                confirmLabel="Delete"
                cancelLabel="Keep it"
                destructive
                onCancel={() => setPendingDelete(null)}
                onConfirm={() => {
                    if (!pendingDelete) {
                        return;
                    }

                    router.delete(destroyCategory.url(pendingDelete.id), {
                        onFinish: () => setPendingDelete(null),
                    });
                }}
            />
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: categoriesIndex(),
        },
    ],
};
