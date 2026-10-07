import { Link } from '@inertiajs/react';
import { mainNavItems } from '@/components/nav-items';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';

/**
 * Mobile bottom navigation (PRD 8): the five primary destinations stay one
 * tap away below the md breakpoint, with safe-area padding so the bar clears
 * the iOS home indicator.
 */
export function BottomNav() {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    const isActive = (item: (typeof mainNavItems)[number]) =>
        item.activePrefix
            ? isCurrentUrl(item.activePrefix, undefined, true)
            : isCurrentOrParentUrl(item.href);

    return (
        <nav
            aria-label="Primary"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 backdrop-blur-sm md:hidden"
        >
            <ul
                className="grid grid-cols-5"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                {mainNavItems.map((item) => {
                    const active = isActive(item);

                    return (
                        <li key={item.title}>
                            <Link
                                href={item.href}
                                prefetch
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'flex min-h-14 flex-col items-center justify-center gap-1 px-1 pt-1.5 pb-1 text-ink-soft transition-colors duration-150 hover:text-ink',
                                    active && 'text-dill-deep',
                                )}
                            >
                                {item.icon && (
                                    <item.icon
                                        className="size-5"
                                        aria-hidden="true"
                                    />
                                )}
                                <span className="stamp text-[11px] leading-none tracking-[0.1em]">
                                    {item.title}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
