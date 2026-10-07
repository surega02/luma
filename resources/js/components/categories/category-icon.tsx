import {
    BookOpen,
    Brain,
    Briefcase,
    Calculator,
    Code,
    FlaskConical,
    Globe,
    Leaf,
    Music,
    Sparkles,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The icon vocabulary a Category can carry. Names live in the database,
 * so an unknown value still has to render something.
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
    book: BookOpen,
    brain: Brain,
    briefcase: Briefcase,
    calculator: Calculator,
    code: Code,
    flask: FlaskConical,
    globe: Globe,
    leaf: Leaf,
    music: Music,
    sparkles: Sparkles,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS);

/**
 * The colour swatches offered when creating or editing a Category.
 * Every value comes straight from the DESIGN.md palette.
 */
export const CATEGORY_COLORS: { name: string; value: string }[] = [
    { name: 'Dill', value: '#5C7F4A' },
    { name: 'Deep dill', value: '#3F5A33' },
    { name: 'Coral', value: '#F26882' },
    { name: 'Ruby', value: '#B21E4B' },
    { name: 'Kraft', value: '#CDAE86' },
    { name: 'Deep kraft', value: '#B08F63' },
    { name: 'Ink', value: '#2E2A26' },
    { name: 'Soft ink', value: '#5F5A50' },
];

/**
 * A glyph stays legible on both the pale and the deep swatches, so it
 * flips to ink instead of white when the colour is light.
 */
function readableInk(hex: string): string {
    const clean = hex.replace('#', '');

    if (clean.length !== 6) {
        return '#FFFFFF';
    }

    const channels = [0, 2, 4].map(
        (offset) => Number.parseInt(clean.slice(offset, offset + 2), 16) / 255,
    );
    const [red, green, blue] = channels;
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

    return luminance > 0.55 ? '#2E2A26' : '#FFFFFF';
}

export default function CategoryIcon({
    icon,
    color,
    className,
}: {
    icon: string;
    color: string;
    className?: string;
}) {
    const Glyph = CATEGORY_ICONS[icon] ?? Sparkles;

    return (
        <span
            className={cn(
                'inline-flex size-8 shrink-0 items-center justify-center rounded-[3px] border border-rule',
                className,
            )}
            style={{ backgroundColor: color }}
            aria-hidden="true"
        >
            <Glyph className="size-4" style={{ color: readableInk(color) }} />
        </span>
    );
}
