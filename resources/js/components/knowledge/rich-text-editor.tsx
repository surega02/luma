import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Bold, Italic, Link2, List, ListOrdered, Unlink } from 'lucide-react';
import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';
import { labelStamp } from './stamp';

type Props = {
    id: string;
    label: string;
    value: string;
    onChange: (html: string) => void;
    error?: string;
    placeholder?: string;
};

function withProtocol(url: string): string {
    if (/^[a-z][a-z0-9+.-]*:/i.test(url)) {
        return url;
    }

    return `https://${url}`;
}

/**
 * Tiptap surface for Definition and My Understanding: the MVP toolbar is
 * bold, italic, bullet list, numbered list and link — nothing else.
 */
export default function RichTextEditor({
    id,
    label,
    value,
    onChange,
    error,
    placeholder,
}: Props) {
    const [linkOpen, setLinkOpen] = useState(false);
    const [linkValue, setLinkValue] = useState('');

    const editor = useEditor(
        {
            extensions: [
                StarterKit.configure({
                    link: {
                        openOnClick: false,
                        autolink: false,
                        HTMLAttributes: {
                            rel: 'noopener noreferrer',
                            target: '_blank',
                        },
                    },
                }),
                Placeholder.configure({ placeholder: placeholder ?? '' }),
            ],
            content: value,
            editorProps: {
                attributes: {
                    id,
                    'aria-label': label,
                    class: 'rt-editor__content',
                },
            },
            onUpdate: ({ editor: current }) => {
                onChange(current.getHTML());
            },
        },
        [],
    );

    // The form can change the draft without a keystroke (closing Quick
    // Capture, discarding an edit), so follow the controlled value.
    useEffect(() => {
        if (!editor || editor.isDestroyed) {
            return;
        }

        if (value !== editor.getHTML()) {
            editor.commands.setContent(value ?? '', { emitUpdate: false });
        }
    }, [editor, value]);

    const openLinkEditor = () => {
        if (!editor) {
            return;
        }

        setLinkValue(editor.getAttributes('link').href ?? '');
        setLinkOpen(true);
    };

    const applyLink = () => {
        if (!editor) {
            return;
        }

        const href = linkValue.trim();

        if (href === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: withProtocol(href) })
                .run();
        }

        setLinkOpen(false);
    };

    const cancelLink = () => {
        setLinkOpen(false);
        editor?.chain().focus().run();
    };

    const onLinkKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            applyLink();
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            cancelLink();
        }
    };

    const toolButton = (
        active: boolean,
        label: string,
        icon: ReactNode,
        onClick: () => void,
        disabled = false,
    ) => (
        <button
            type="button"
            aria-label={label}
            aria-pressed={active}
            title={label}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onClick}
            className={cn(
                'inline-flex size-7 items-center justify-center rounded-[2px] text-ink-soft transition-colors duration-150 hover:bg-ink/5 hover:text-ink disabled:pointer-events-none disabled:opacity-40',
                active && 'bg-ink/10 text-ink',
            )}
        >
            {icon}
        </button>
    );

    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className={labelStamp}>
                {label}
            </label>

            <div
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={cn(
                    'rt-editor rounded-[3px] border bg-paper transition-colors',
                    error
                        ? 'border-ruby focus-within:border-ruby'
                        : 'border-input focus-within:border-dill-deep',
                )}
            >
                <div className="flex flex-wrap items-center gap-1 border-b border-rule px-2 py-1.5">
                    {toolButton(
                        editor?.isActive('bold') ?? false,
                        'Bold',
                        <Bold className="size-3.5" />,
                        () => editor?.chain().focus().toggleBold().run(),
                        !editor,
                    )}
                    {toolButton(
                        editor?.isActive('italic') ?? false,
                        'Italic',
                        <Italic className="size-3.5" />,
                        () => editor?.chain().focus().toggleItalic().run(),
                        !editor,
                    )}
                    {toolButton(
                        editor?.isActive('bulletList') ?? false,
                        'Bullet list',
                        <List className="size-3.5" />,
                        () => editor?.chain().focus().toggleBulletList().run(),
                        !editor,
                    )}
                    {toolButton(
                        editor?.isActive('orderedList') ?? false,
                        'Numbered list',
                        <ListOrdered className="size-3.5" />,
                        () => editor?.chain().focus().toggleOrderedList().run(),
                        !editor,
                    )}

                    <span
                        className="mx-1 h-4 w-px bg-rule"
                        aria-hidden="true"
                    />

                    {editor?.isActive('link')
                        ? toolButton(
                              true,
                              'Remove link',
                              <Unlink className="size-3.5" />,
                              () =>
                                  editor
                                      .chain()
                                      .focus()
                                      .extendMarkRange('link')
                                      .unsetLink()
                                      .run(),
                          )
                        : toolButton(
                              false,
                              'Add link',
                              <Link2 className="size-3.5" />,
                              openLinkEditor,
                              !editor,
                          )}
                </div>

                {linkOpen && (
                    <div className="flex items-center gap-2 border-b border-rule bg-mist px-2 py-1.5">
                        <input
                            type="text"
                            value={linkValue}
                            autoFocus
                            placeholder="https://"
                            aria-label="Link address"
                            onChange={(event) =>
                                setLinkValue(event.target.value)
                            }
                            onKeyDown={onLinkKeyDown}
                            className="h-7 min-w-0 flex-1 rounded-[2px] border border-input bg-paper px-2 text-[16px] text-ink placeholder:text-ink-soft"
                        />
                        <button
                            type="button"
                            onClick={applyLink}
                            className="stamp rounded-[2px] bg-dill px-2 py-1 text-[11px] tracking-[0.14em] text-white transition-colors hover:bg-dill-deep"
                        >
                            Apply
                        </button>
                        <button
                            type="button"
                            onClick={cancelLink}
                            className="stamp rounded-[2px] px-2 py-1 text-[11px] tracking-[0.14em] text-ink-soft transition-colors hover:text-ink"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                <EditorContent editor={editor} />
            </div>

            <InputError id={`${id}-error`} message={error} className="mt-0.5" />
        </div>
    );
}
