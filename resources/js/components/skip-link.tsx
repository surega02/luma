/**
 * First focusable element on every page: lets keyboard and screen-reader users
 * jump past the sidebar / masthead straight to the content region.
 */
export default function SkipLink({
    target = 'main-content',
}: {
    target?: string;
}) {
    return (
        <a
            href={`#${target}`}
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-[3px] focus:bg-dill focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-dill-deep"
        >
            Skip to content
        </a>
    );
}
