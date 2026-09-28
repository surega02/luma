<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'light') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Luma is light-mode only in v1: the .dark class is never applied from a system preference --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "light" }}';

                if (appearance === 'dark') {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: #f7f5ee;
            }

            html.dark {
                background-color: #211d18;
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <!-- LUMA DIRECTION CONTRACT — seed 674610b6
             THESIS: storing is not learning; a captured item must visibly mature through understanding and insight. Refuses the category-default hero-plus-feature-grid.
             OWN-WORLD: The Brine Calendar. Mist #F7F5EE ground, ink #2E2A26, dill #5C7F4A fields, coral/ruby category inks, kraft label stock; Kaushan Script display, Oswald stamped caps, Bitter body; shelf rails, kraft bands, soft depth.
             STORY: a visitor sees knowledge as staged vessels on a shelf, follows capture-organize-retrieve-reflect, watches a vessel mature and open, then registers.
             FIRST VIEWPORT: label-plate nav; left, Learn. Capture. Grow. in script over the supporting copy with a solid dill Get Started block; right, a three-vessel shelf where one band flips to Definition / My Understanding / Insight.
             FORM: The Brine Calendar, challenger 3 of the dealt hand (seed 674610b6).
             FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->
        <x-inertia::app />
    </body>
</html>
