import { cn } from '@/lib/utils';

/**
 * Renders stored rich text. The server sanitizes definition and understanding
 * HTML down to the MVP allowlist before it is ever stored (tech design §29),
 * so this surface only has to carry the world's typography.
 */
export default function RichText({
    html,
    className,
}: {
    html: string | null | undefined;
    className?: string;
}) {
    if (!html) {
        return null;
    }

    return (
        <div
            className={cn('rt-prose', className)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
