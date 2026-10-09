{{--
    Shared shell for Laravel's error pages: server-rendered, JS-free, and
    legible even when the Vite bundle is missing — the inline block is the
    floor, and @vite paints the world over it when the manifest exists.
--}}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex">
        <title>{{ $code }} — Luma</title>
        <style>
            html { background: #f7f5ee; }
            body { margin: 0; color: #2e2a26; font-family: Bitter, Georgia, 'Times New Roman', serif; }
            .shell { min-height: 100vh; display: flex; flex-direction: column; }
            .fallback-center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 4rem 1.5rem; text-align: center; }
            .fallback-code { font-family: 'Arial Narrow', Arial, sans-serif; font-weight: 700; font-size: clamp(3.5rem, 14vw, 6rem); line-height: 0.86; letter-spacing: 0.06em; margin: 0; text-align: center; }
        </style>
        @if (file_exists(public_path('build/manifest.json')))
            @vite(['resources/css/app.css'])
        @endif
    </head>
    <body class="bg-mist text-ink antialiased">
        <div class="shell">
            <header class="kraft border-b border-rule">
                <div class="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-4">
                    <a href="/" class="stamp text-[15px] tracking-[0.3em] text-ink">LUMA</a>
                    <span class="stamp hidden text-[11px] tracking-[0.24em] text-ink/75 sm:inline">LEARN. CAPTURE. GROW.</span>
                </div>
            </header>

            <main class="fallback-center">
                <div class="w-full max-w-xl text-center">
                    <h1 class="stamp fallback-code m-0 text-ink">
                        {{ $code }}<span class="sr-only"> — {{ $sr }}</span>
                    </h1>
                    <p class="mt-7 font-sans text-[24px] font-semibold leading-snug text-ink">{{ $heading }}</p>
                    <p class="mx-auto mt-3 max-w-[46ch] font-sans text-[16px] leading-relaxed text-ink-soft">{{ $body }}</p>
                    <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
                        <a href="{{ $primary_href ?? '/dashboard' }}" class="stamp inline-flex min-h-11 items-center justify-center rounded-[3px] bg-dill px-5 text-[11px] tracking-[0.14em] text-white transition-colors duration-200 hover:bg-dill-deep">{{ $primary_label ?? 'BACK TO DASHBOARD' }}</a>
                        <a href="/" class="stamp inline-flex min-h-11 items-center justify-center rounded-[3px] border border-ink/35 px-5 text-[11px] tracking-[0.14em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink/5">HOME</a>
                    </div>
                </div>
            </main>
        </div>
    </body>
</html>
