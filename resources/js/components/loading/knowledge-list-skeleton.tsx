import { cardSurface } from '@/components/knowledge/stamp';
import { cn } from '@/lib/utils';

function Bar({ className }: { className?: string }) {
    return (
        <div className={cn('animate-pulse rounded-[3px] bg-mist', className)} />
    );
}

/**
 * Placeholder for the Knowledge grid while the list reloads, shaped after
 * KnowledgeCard so the swap never shifts the layout (E10-F03).
 */
export default function KnowledgeListSkeleton({
    count = 4,
}: {
    count?: number;
}) {
    return (
        <div
            role="status"
            aria-label="Loading knowledge"
            className="grid gap-4 lg:grid-cols-2"
        >
            <span className="sr-only">Loading knowledge…</span>

            {Array.from({ length: count }, (_, index) => (
                <div
                    key={index}
                    className={cn(cardSurface, 'flex flex-col gap-3 p-4')}
                >
                    <div className="flex items-start justify-between gap-3">
                        <Bar className="h-6 w-2/5" />
                        <Bar className="mt-1 h-4 w-16" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Bar className="h-3.5 w-full" />
                        <Bar className="h-3.5 w-4/5" />
                    </div>

                    <div className="rule-dotted" aria-hidden="true" />

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Bar className="h-5 w-20" />
                            <Bar className="h-3.5 w-16" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Bar className="h-5 w-12" />
                            <Bar className="h-5 w-12" />
                            <Bar className="h-5 w-14" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
