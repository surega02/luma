import { BadgeCheck, CircleDashed, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KnowledgeStatus } from '@/types';

const STATUS: Record<
    KnowledgeStatus,
    {
        label: string;
        icon: typeof CircleDashed;
        chip: string;
        iconClass: string;
    }
> = {
    captured: {
        label: 'Captured',
        icon: CircleDashed,
        chip: 'border border-rule bg-muted text-ink-soft',
        iconClass: 'text-ink-soft',
    },
    understood: {
        label: 'Understood',
        icon: CircleDot,
        chip: 'border border-dill/35 bg-glass text-dill-deep',
        iconClass: 'text-dill-deep',
    },
    complete: {
        label: 'Complete',
        icon: BadgeCheck,
        chip: 'kraft ticket text-ink',
        iconClass: 'text-dill-deep',
    },
};

/**
 * Status is system-generated, so the chip reads as a stamp on the record:
 * icon + stamped label, tinted by how far the knowledge has matured.
 */
export default function StatusBadge({
    status,
    className,
}: {
    status: KnowledgeStatus;
    className?: string;
}) {
    const { label, icon: Icon, chip, iconClass } = STATUS[status];

    return (
        <span
            data-status={status}
            className={cn(
                'stamp inline-flex items-center gap-1.5 rounded-[2px] px-2 py-1 text-[11px] tracking-[0.14em]',
                chip,
                className,
            )}
        >
            <Icon className={cn('size-3', iconClass)} aria-hidden="true" />
            {label}
        </span>
    );
}
