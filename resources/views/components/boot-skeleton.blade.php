@props(['component'])

{{--
    Cold-load skeleton (E10-F03). Rendered before React boots so the first
    paint already looks like the page that is coming; app.tsx removes it once
    the interface is mounted.
--}}
<div
    id="boot-skeleton"
    role="status"
    aria-live="polite"
    aria-label="Loading Luma"
    class="fixed inset-0 z-50 overflow-hidden bg-mist"
>
    {{-- Desktop rail --}}
    <div class="absolute inset-y-0 left-0 hidden w-64 flex-col gap-7 border-r border-rule bg-paper px-4 py-5 md:flex">
        <div class="h-6 w-24 animate-pulse rounded-[3px] bg-mist"></div>

        <div class="flex flex-col gap-3.5">
            <div class="h-3 w-28 animate-pulse rounded-[3px] bg-mist"></div>
            <div class="h-3 w-24 animate-pulse rounded-[3px] bg-mist"></div>
            <div class="h-3 w-32 animate-pulse rounded-[3px] bg-mist"></div>
            <div class="h-3 w-20 animate-pulse rounded-[3px] bg-mist"></div>
            <div class="h-3 w-24 animate-pulse rounded-[3px] bg-mist"></div>
        </div>

        <div class="mt-auto h-8 w-full animate-pulse rounded-[3px] bg-mist"></div>
    </div>

    <div class="flex h-full flex-col md:pl-64">
        {{-- Header --}}
        <div class="flex h-14 shrink-0 items-center gap-3 border-b border-rule bg-paper px-4 md:px-6">
            <div class="h-3 w-32 animate-pulse rounded-[3px] bg-mist"></div>
            <div class="ml-auto h-8 w-28 animate-pulse rounded-[3px] bg-mist"></div>
        </div>

        {{-- Page body, shaped after the page being requested --}}
        <div class="mx-auto w-full max-w-5xl flex-1 overflow-hidden px-4 pt-8 pb-24 md:px-6 md:pb-8">
            @switch($component)

                @case('dashboard')
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col gap-2 border-b border-rule pb-5">
                            <div class="h-3 w-28 animate-pulse rounded-[3px] bg-mist"></div>
                            <div class="h-6 w-44 animate-pulse rounded-[3px] bg-mist"></div>
                            <div class="h-3.5 w-36 animate-pulse rounded-[3px] bg-mist"></div>
                        </div>

                        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            @for ($card = 0; $card < 4; $card++)
                                <div class="flex flex-col gap-2 rounded-[3px] border border-rule bg-paper px-4 py-3.5">
                                    <div class="h-3 w-20 animate-pulse rounded-[3px] bg-mist"></div>
                                    <div class="h-8 w-16 animate-pulse rounded-[3px] bg-mist"></div>
                                </div>
                            @endfor
                        </div>

                        <div class="rounded-[3px] border border-rule bg-paper p-4">
                            <div class="mb-4 h-3 w-36 animate-pulse rounded-[3px] bg-mist"></div>
                            <div class="h-[250px] w-full animate-pulse rounded-[3px] bg-mist"></div>
                        </div>

                        <div class="grid gap-7 lg:grid-cols-2">
                            @for ($list = 0; $list < 2; $list++)
                                <div class="rounded-[3px] border border-rule bg-paper">
                                    <div class="m-4 h-3 w-32 animate-pulse rounded-[3px] bg-mist"></div>
                                    @for ($row = 0; $row < 4; $row++)
                                        <div class="flex items-center gap-3 border-t border-rule px-4 py-3">
                                            <div class="h-3.5 w-40 animate-pulse rounded-[3px] bg-mist"></div>
                                            <div class="ml-auto h-3 w-16 animate-pulse rounded-[3px] bg-mist"></div>
                                        </div>
                                    @endfor
                                </div>
                            @endfor
                        </div>
                    </div>
                    @break

                @case('knowledge/index')
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col gap-2 border-b border-rule pb-5">
                            <div class="h-3 w-32 animate-pulse rounded-[3px] bg-mist"></div>
                            <div class="h-6 w-40 animate-pulse rounded-[3px] bg-mist"></div>
                            <div class="h-3.5 w-44 animate-pulse rounded-[3px] bg-mist"></div>
                        </div>

                        <div class="flex flex-col gap-3 border-b border-rule pb-4">
                            <div class="flex flex-wrap items-center gap-2">
                                <div class="h-10 min-w-0 flex-1 animate-pulse rounded-[3px] border border-input bg-paper"></div>
                                <div class="h-10 w-20 animate-pulse rounded-[3px] border border-ink/35 bg-paper"></div>
                            </div>
                            <div class="flex flex-wrap items-center gap-2">
                                <div class="h-7 w-32 animate-pulse rounded-[3px] border border-ink/35 bg-paper"></div>
                                <div class="h-7 w-32 animate-pulse rounded-[3px] border border-input bg-paper"></div>
                            </div>
                        </div>

                        <div class="grid gap-4 lg:grid-cols-2">
                            @for ($card = 0; $card < 4; $card++)
                                <div class="flex flex-col gap-3 rounded-[3px] border border-rule bg-paper p-4">
                                    <div class="flex items-start justify-between gap-3">
                                        <div class="h-6 w-2/5 animate-pulse rounded-[3px] bg-mist"></div>
                                        <div class="h-4 w-16 animate-pulse rounded-[3px] bg-mist"></div>
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <div class="h-3.5 w-full animate-pulse rounded-[3px] bg-mist"></div>
                                        <div class="h-3.5 w-4/5 animate-pulse rounded-[3px] bg-mist"></div>
                                    </div>
                                    <div class="rule-dotted" aria-hidden="true"></div>
                                    <div class="flex items-center justify-between gap-3">
                                        <div class="flex items-center gap-2">
                                            <div class="h-5 w-20 animate-pulse rounded-[3px] bg-mist"></div>
                                            <div class="h-3.5 w-16 animate-pulse rounded-[3px] bg-mist"></div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <div class="h-5 w-14 animate-pulse rounded-[3px] bg-mist"></div>
                                            <div class="h-5 w-14 animate-pulse rounded-[3px] bg-mist"></div>
                                        </div>
                                    </div>
                                </div>
                            @endfor
                        </div>
                    </div>
                    @break

                @case('categories/index')
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col gap-2 border-b border-rule pb-5">
                            <div class="h-3 w-32 animate-pulse rounded-[3px] bg-mist"></div>
                            <div class="h-6 w-40 animate-pulse rounded-[3px] bg-mist"></div>
                            <div class="h-3.5 w-24 animate-pulse rounded-[3px] bg-mist"></div>
                        </div>

                        <div class="h-7 w-40 animate-pulse rounded-[3px] border border-input bg-paper"></div>

                        <ul class="rounded-[3px] border border-rule bg-paper px-4">
                            @for ($row = 0; $row < 5; $row++)
                                <li class="flex flex-wrap items-center gap-4 border-b border-rule py-3.5 last:border-b-0">
                                    <div class="size-8 animate-pulse rounded-[3px] bg-mist"></div>
                                    <div class="h-4 min-w-0 max-w-40 flex-1 animate-pulse rounded-[3px] bg-mist"></div>
                                    <div class="ml-auto h-3 w-24 animate-pulse rounded-[3px] bg-mist"></div>
                                    <div class="flex items-center gap-2">
                                        <div class="h-7 w-14 animate-pulse rounded-[3px] border border-ink/35 bg-paper"></div>
                                        <div class="h-7 w-14 animate-pulse rounded-[3px] border border-ruby/45 bg-paper"></div>
                                    </div>
                                </li>
                            @endfor
                        </ul>
                    </div>
                    @break

                @default
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col gap-2 border-b border-rule pb-5">
                            <div class="h-3 w-32 animate-pulse rounded-[3px] bg-mist"></div>
                            <div class="h-6 w-48 animate-pulse rounded-[3px] bg-mist"></div>
                        </div>
                        <div class="flex flex-col gap-3">
                            <div class="h-3.5 w-full animate-pulse rounded-[3px] bg-mist"></div>
                            <div class="h-3.5 w-11/12 animate-pulse rounded-[3px] bg-mist"></div>
                            <div class="h-3.5 w-3/4 animate-pulse rounded-[3px] bg-mist"></div>
                        </div>
                        <div class="h-40 w-full animate-pulse rounded-[3px] border border-rule bg-paper"></div>
                    </div>

            @endswitch
        </div>
    </div>

    {{-- Mobile bottom navigation --}}
    <div class="absolute inset-x-0 bottom-0 grid h-16 grid-cols-5 items-start gap-3 border-t border-rule bg-paper px-4 pt-4 md:hidden">
        <div class="h-4 w-full animate-pulse rounded-[3px] bg-mist"></div>
        <div class="h-4 w-full animate-pulse rounded-[3px] bg-mist"></div>
        <div class="h-4 w-full animate-pulse rounded-[3px] bg-mist"></div>
        <div class="h-4 w-full animate-pulse rounded-[3px] bg-mist"></div>
        <div class="h-4 w-full animate-pulse rounded-[3px] bg-mist"></div>
    </div>
</div>
