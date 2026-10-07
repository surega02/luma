import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * True while Inertia is reloading the path the visitor is already on:
 * search, filter, sort, pagination and mutation redirects all land back on the
 * same URL, while navigation to another page does not. List surfaces use it to
 * swap in a skeleton instead of showing rows that are about to change, and
 * submit buttons use it for their loading state (E10-F03).
 */
export function usePagePending(): boolean {
    const [visits, setVisits] = useState(0);

    useEffect(() => {
        const offStart = router.on('start', ({ detail }) => {
            const target = new URL(
                String(detail.visit.url),
                window.location.origin,
            );

            if (target.pathname === window.location.pathname) {
                setVisits((count) => count + 1);
            }
        });

        const offFinish = router.on('finish', () => {
            setVisits((count) => Math.max(0, count - 1));
        });

        return () => {
            offStart();
            offFinish();
        };
    }, []);

    return visits > 0;
}
