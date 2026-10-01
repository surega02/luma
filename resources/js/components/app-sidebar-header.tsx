import { Sparkle } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useQuickCapture } from '@/components/knowledge/quick-capture-provider';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const openQuickCapture = useQuickCapture();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <button
                type="button"
                onClick={openQuickCapture}
                aria-label="Quick Capture"
                className="stamp inline-flex h-9 w-9 shrink-0 items-center justify-center gap-1.5 rounded-[3px] bg-dill px-0 text-[11px] tracking-[0.14em] text-white transition-colors duration-200 hover:bg-dill-deep sm:w-auto sm:px-3.5"
            >
                <Sparkle className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Quick Capture</span>
            </button>
        </header>
    );
}
