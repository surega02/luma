import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { BottomNav } from '@/components/bottom-nav';
import SkipLink from '@/components/skip-link';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <SkipLink />
            <AppSidebar />
            <AppContent
                id="main-content"
                variant="sidebar"
                className="min-w-0 overflow-x-clip pb-20 md:pb-0"
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            <BottomNav />
        </AppShell>
    );
}
