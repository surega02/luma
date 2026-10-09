import { useForm } from '@inertiajs/react';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, type FormEvent } from 'react';
import InputError from '@/components/input-error';
import {
    buttonPrimary,
    buttonSecondary,
    inputClasses,
    labelStamp,
} from '@/components/knowledge/stamp';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    CATEGORY_COLORS,
    CATEGORY_ICONS,
    CATEGORY_ICON_NAMES,
} from '@/components/categories/category-icon';
import { cn } from '@/lib/utils';
import {
    store as storeCategory,
    update as updateCategory,
} from '@/routes/categories';
import type { CategoryListItem } from '@/types';

type CategoryDraft = {
    name: string;
    color: string;
    icon: string;
};

const swatchClass =
    'flex size-8 items-center justify-center rounded-[3px] border transition-colors duration-150';

/**
 * One modal for both creating and editing a Category (PRD 15.3, 16).
 * Errors stay inside the modal and nothing is navigated away.
 */
export default function CategoryModal({
    open,
    category,
    onClose,
}: {
    open: boolean;
    category: CategoryListItem | null;
    onClose: () => void;
}) {
    const { data, setData, post, patch, processing, errors, clearErrors } =
        useForm<CategoryDraft>({
            name: '',
            color: CATEGORY_COLORS[0].value,
            icon: 'book',
        });

    useEffect(() => {
        if (!open) {
            return;
        }

        setData({
            name: category?.name ?? '',
            color: category?.color ?? CATEGORY_COLORS[0].value,
            icon: category?.icon ?? 'book',
        });
        clearErrors();
    }, [open, category]);

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: onClose,
        };

        if (category) {
            patch(updateCategory.url(category.id), options);

            return;
        }

        post(storeCategory.url(), options);
    };

    return (
        <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
            <DialogContent className="gap-5 rounded-[3px] border border-ink/30 bg-paper p-5 sm:max-w-lg">
                <DialogHeader className="gap-2 text-left">
                    <DialogTitle className="stamp text-[16px] tracking-[0.18em] text-ink">
                        {category ? 'Edit category' : 'New category'}
                    </DialogTitle>
                    <DialogDescription className="font-sans text-[16px] leading-relaxed text-ink-soft">
                        {category
                            ? 'Rename it or give it a new colour and icon.'
                            : 'A category groups the knowledge you are building.'}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={submit}
                    noValidate
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="category-name" className={labelStamp}>
                            Name
                        </label>
                        <input
                            id="category-name"
                            name="name"
                            maxLength={255}
                            value={data.name}
                            autoComplete="off"
                            aria-invalid={errors.name ? true : undefined}
                            aria-describedby={
                                errors.name ? 'category-name-error' : undefined
                            }
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            className={inputClasses(errors.name)}
                        />
                        <InputError
                            id="category-name-error"
                            message={errors.name}
                            className="mt-0.5"
                        />
                    </div>

                    <fieldset
                        className="flex flex-col gap-2"
                        aria-describedby={
                            errors.color ? 'category-color-error' : undefined
                        }
                    >
                        <legend className={labelStamp}>Colour</legend>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORY_COLORS.map((colour) => {
                                const selected = data.color === colour.value;

                                return (
                                    <button
                                        key={colour.value}
                                        type="button"
                                        aria-label={colour.name}
                                        aria-pressed={selected}
                                        onClick={() =>
                                            setData('color', colour.value)
                                        }
                                        className={cn(
                                            swatchClass,
                                            selected
                                                ? 'border-ink ring-2 ring-ink/25'
                                                : 'border-rule hover:border-ink/50',
                                        )}
                                        style={{
                                            backgroundColor: colour.value,
                                        }}
                                    >
                                        {selected && (
                                            <Check
                                                className="size-4 text-white"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <InputError
                            id="category-color-error"
                            message={errors.color}
                            className="mt-0.5"
                        />
                    </fieldset>

                    <fieldset
                        className="flex flex-col gap-2"
                        aria-describedby={
                            errors.icon ? 'category-icon-error' : undefined
                        }
                    >
                        <legend className={labelStamp}>Icon</legend>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORY_ICON_NAMES.map((icon) => {
                                const selected = data.icon === icon;

                                return (
                                    <button
                                        key={icon}
                                        type="button"
                                        aria-label={icon}
                                        aria-pressed={selected}
                                        onClick={() => setData('icon', icon)}
                                        className={cn(
                                            swatchClass,
                                            selected
                                                ? 'border-ink bg-mist'
                                                : 'border-rule bg-paper hover:border-ink/50',
                                        )}
                                    >
                                        <CategoryGlyph
                                            icon={icon}
                                            selected={selected}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                        <InputError
                            id="category-icon-error"
                            message={errors.icon}
                            className="mt-0.5"
                        />
                    </fieldset>

                    <DialogFooter className="gap-2 sm:justify-end">
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
                            {category ? 'Save changes' : 'Create category'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function CategoryGlyph({
    icon,
    selected,
}: {
    icon: string;
    selected: boolean;
}) {
    const Glyph = CATEGORY_ICONS[icon];

    if (!Glyph) {
        return null;
    }

    return (
        <Glyph
            className={cn('size-4', selected ? 'text-ink' : 'text-ink-soft')}
            aria-hidden="true"
        />
    );
}
