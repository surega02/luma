/**
 * Luma is light-mode only in v1 (PRODUCT.md "Scope the MVP": light mode only
 * for MVP). There is no theme store, no cookie, no system-preference listener:
 * the resolved theme is a constant, so the .dark class cannot be re-applied at
 * runtime and dark-mode defects are structurally impossible.
 */
export type ResolvedAppearance = 'light';

export type UseAppearanceReturn = {
    readonly appearance: ResolvedAppearance;
    readonly resolvedAppearance: ResolvedAppearance;
};

export function useAppearance(): UseAppearanceReturn {
    return { appearance: 'light', resolvedAppearance: 'light' } as const;
}
