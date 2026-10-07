import { cn } from '@/lib/utils';

function Bar({ className }: { className?: string }) {
    return (
        <div className={cn('animate-pulse rounded-[3px] bg-mist', className)} />
    );
}

/**
 * Placeholder for the Categories list while it re-sorts, shaped after the
 * category row so the rows fill in place (E10-F03).
 */
export default function CategoryListSkeleton({
    count = 5,
}: {
    count?: number;
}) {
    return (
        <ul
            role="status"
            aria-label="Loading categories"
            className="rounded-[3px] border border-rule bg-paper px-4"
        >
            <span className="sr-only">Loading categories…</span>

            {Array.from({ length: count }, (_, index) => (
                <li
                    key={index}
                    className="flex flex-wrap items-center gap-4 border-b border-rule py-3.5 last:border-b-0"
                >
                    <Bar className="size-8 shrink-0 rounded-[3px]" />

                    <Bar className="h-4 max-w-40 min-w-0 flex-1" />

                    <Bar className="ml-auto h-3 w-24" />

                    <div className="flex items-center gap-2">
                        <Bar className="h-7 w-14" />
                        <Bar className="h-7 w-14" />
                    </div>
                </li>
            ))}
        </ul>
    );
}
