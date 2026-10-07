import { LayoutGrid, Library, Tag, Trash2, UserRound } from 'lucide-react';
import { dashboard } from '@/routes';
import { index as categoriesIndex } from '@/routes/categories';
import { index as knowledgeIndex } from '@/routes/knowledge';
import { edit as editProfile } from '@/routes/profile';
import { index as trashIndex } from '@/routes/trash';
import type { NavItem } from '@/types';

/**
 * One source of truth for the primary navigation: the desktop sidebar, the
 * mobile sheet menu and the mobile bottom bar all render this list so the
 * five destinations (PRD 8) can never drift apart.
 */
export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Knowledge',
        href: knowledgeIndex(),
        icon: Library,
    },
    {
        title: 'Categories',
        href: categoriesIndex(),
        icon: Tag,
    },
    {
        title: 'Trash',
        href: trashIndex(),
        icon: Trash2,
    },
    {
        title: 'Profile',
        href: editProfile(),
        icon: UserRound,
        activePrefix: '/settings',
    },
];
