import { Link2, UserRound } from 'lucide-react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import CategorySelector from './category-selector';
import RichTextEditor from './rich-text-editor';
import { inputClasses, labelStamp } from './stamp';

export type KnowledgeDraft = {
    title: string;
    definition: string;
    my_understanding: string;
    source: string;
    url: string;
    category_ids: number[];
};

/**
 * The same field stack serves Quick Capture and Quick Edit, so the two forms
 * never drift apart (E04-F02 / E05-F05).
 */
export default function KnowledgeFields({
    data,
    setData,
    errors,
}: {
    data: KnowledgeDraft;
    setData: (next: KnowledgeDraft) => void;
    errors: Record<string, string | undefined>;
}) {
    const patch = (partial: Partial<KnowledgeDraft>) =>
        setData({ ...data, ...partial });

    return (
        <div className="grid gap-4">
            <div className="grid gap-1.5">
                <Label htmlFor="knowledge-title" className={labelStamp}>
                    Title
                </Label>
                <input
                    id="knowledge-title"
                    type="text"
                    maxLength={255}
                    value={data.title}
                    placeholder="How to bake sourdough"
                    onChange={(event) => patch({ title: event.target.value })}
                    aria-invalid={errors.title ? true : undefined}
                    aria-describedby={
                        errors.title ? 'knowledge-title-error' : undefined
                    }
                    className={inputClasses(errors.title)}
                />
                <InputError
                    id="knowledge-title-error"
                    message={errors.title}
                    className="mt-0.5"
                />
            </div>

            <RichTextEditor
                id="knowledge-definition"
                label="Definition"
                placeholder="What does this mean, in your words?"
                value={data.definition}
                onChange={(html) => patch({ definition: html })}
                error={errors.definition}
            />

            <RichTextEditor
                id="knowledge-understanding"
                label="My Understanding"
                placeholder="What you have worked out so far (optional)"
                value={data.my_understanding}
                onChange={(html) => patch({ my_understanding: html })}
                error={errors.my_understanding}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                    <Label htmlFor="knowledge-source" className={labelStamp}>
                        Source
                    </Label>
                    <div className="relative">
                        <UserRound
                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft"
                            aria-hidden="true"
                        />
                        <input
                            id="knowledge-source"
                            type="text"
                            maxLength={255}
                            value={data.source}
                            placeholder="Ada Lovelace, 1843"
                            onChange={(event) =>
                                patch({ source: event.target.value })
                            }
                            aria-invalid={errors.source ? true : undefined}
                            aria-describedby={
                                errors.source
                                    ? 'knowledge-source-error'
                                    : undefined
                            }
                            className={inputClasses(errors.source, 'pl-9')}
                        />
                    </div>
                    <InputError
                        id="knowledge-source-error"
                        message={errors.source}
                        className="mt-0.5"
                    />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="knowledge-url" className={labelStamp}>
                        URL
                    </Label>
                    <div className="relative">
                        <Link2
                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft"
                            aria-hidden="true"
                        />
                        <input
                            id="knowledge-url"
                            type="text"
                            maxLength={2048}
                            value={data.url}
                            placeholder="https://example.com"
                            onChange={(event) =>
                                patch({ url: event.target.value })
                            }
                            aria-invalid={errors.url ? true : undefined}
                            aria-describedby={
                                errors.url ? 'knowledge-url-error' : undefined
                            }
                            className={inputClasses(errors.url, 'pl-9')}
                        />
                    </div>
                    <InputError
                        id="knowledge-url-error"
                        message={errors.url}
                        className="mt-0.5"
                    />
                </div>
            </div>

            <CategorySelector
                selectedIds={data.category_ids}
                onChange={(category_ids) => patch({ category_ids })}
                error={errors.category_ids ?? errors['category_ids.0']}
            />
        </div>
    );
}
