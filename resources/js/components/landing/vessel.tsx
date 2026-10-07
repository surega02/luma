import { useEffect, useRef, useState } from 'react';
import { StatusMark } from './icons';

export type Stage = 'captured' | 'understood' | 'complete';

export type VesselItem = {
    title: string;
    day: number;
    stage: Stage;
    category: { name: string; ink: string };
    fill: number;
    definition: string;
    understanding?: string;
    insight?: string;
};

const stageIndex: Record<Stage, number> = {
    captured: 0,
    understood: 1,
    complete: 2,
};
const stageLabel: Record<Stage, string> = {
    captured: 'Captured',
    understood: 'Understood',
    complete: 'Complete',
};

export function Jar({
    fill,
    ink,
    className = '',
}: {
    fill: number;
    ink: string;
    className?: string;
}) {
    const bodyTop = 38;
    const bodyHeight = 188;
    const level =
        bodyTop + bodyHeight * (1 - Math.max(0.12, Math.min(1, fill)));

    return (
        <svg
            viewBox="0 0 160 232"
            className={className}
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <clipPath
                    id={`jarBody-${Math.round(fill * 100)}-${ink.slice(1)}`}
                >
                    <rect x="30" y="38" width="100" height="188" rx="18" />
                </clipPath>
                <linearGradient id="jarEdge" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#2e2a26" stopOpacity="0.17" />
                    <stop offset="0.13" stopColor="#2e2a26" stopOpacity="0" />
                    <stop
                        offset="0.46"
                        stopColor="#ffffff"
                        stopOpacity="0.12"
                    />
                    <stop offset="0.87" stopColor="#2e2a26" stopOpacity="0" />
                    <stop offset="1" stopColor="#2e2a26" stopOpacity="0.19" />
                </linearGradient>
                <linearGradient id="jarFoot" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0.58" stopColor="#2e2a26" stopOpacity="0" />
                    <stop offset="1" stopColor="#2e2a26" stopOpacity="0.24" />
                </linearGradient>
            </defs>

            {/* lid */}
            <rect x="45" y="5" width="70" height="17" rx="5" fill="#bdb6a6" />
            <rect x="45" y="5" width="70" height="6" rx="3" fill="#d3ccbc" />
            <rect
                x="45"
                y="16"
                width="70"
                height="6"
                rx="3"
                fill="#a49b8a"
                opacity="0.55"
            />
            {/* clamp wire */}
            <path
                d="M38 23h84"
                stroke="#a79e8c"
                strokeWidth="4.5"
                strokeLinecap="round"
            />
            {/* neck */}
            <rect
                x="54"
                y="25"
                width="52"
                height="16"
                fill="#dfe9e5"
                stroke="#b4c2bc"
                strokeWidth="2"
            />

            {/* glass body */}
            <rect
                x="30"
                y="38"
                width="100"
                height="188"
                rx="18"
                fill="#e6efeb"
                stroke="#b4c2bc"
                strokeWidth="2"
            />

            {/* contents */}
            <g
                clipPath={`url(#jarBody-${Math.round(fill * 100)}-${ink.slice(1)})`}
            >
                <rect
                    x="30"
                    y={level}
                    width="100"
                    height={226 - level}
                    fill={ink}
                    opacity="0.82"
                />
                <rect
                    x="30"
                    y={level}
                    width="100"
                    height="7"
                    fill="#ffffff"
                    opacity="0.32"
                />
            </g>

            {/* refraction: edge shading and the weight of the contents at the foot */}
            <g
                clipPath={`url(#jarBody-${Math.round(fill * 100)}-${ink.slice(1)})`}
            >
                <rect
                    x="30"
                    y="38"
                    width="100"
                    height="188"
                    fill="url(#jarEdge)"
                />
                <rect
                    x="30"
                    y="38"
                    width="100"
                    height="188"
                    fill="url(#jarFoot)"
                />
            </g>

            {/* glass highlight */}
            <rect
                x="41"
                y="54"
                width="9"
                height="152"
                rx="4.5"
                fill="#ffffff"
                opacity="0.5"
            />
            <rect
                x="117"
                y="66"
                width="4"
                height="120"
                rx="2"
                fill="#ffffff"
                opacity="0.3"
            />
        </svg>
    );
}

function StageDots({ stage, ink }: { stage: Stage; ink: string }) {
    const filled = stageIndex[stage] + 1;
    return (
        <span className="flex items-center gap-[3px]" aria-hidden="true">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="h-[6px] w-[6px] rounded-full border"
                    style={{
                        borderColor: i < filled ? ink : '#8a7c60',
                        backgroundColor: i < filled ? ink : 'transparent',
                    }}
                />
            ))}
        </span>
    );
}

function AnatomyCard({ item }: { item: VesselItem }) {
    const rows: Array<{ label: string; value?: string }> = [
        { label: 'Definition', value: item.definition },
        { label: 'My Understanding', value: item.understanding },
        { label: 'Insight', value: item.insight },
    ];

    return (
        <div className="h-full w-full rounded-[3px] shadow-[0_10px_24px_-14px_rgba(46,42,38,0.7)]">
            <div className="kraft ticket h-full w-full overflow-hidden rounded-[3px] px-3 py-3 text-ink">
                <dl className="flex h-full flex-col justify-between gap-2">
                    {rows.map((row) => (
                        <div key={row.label} className="min-w-0">
                            <dt className="stamp text-[8px] text-ink/85">
                                {row.label}
                            </dt>
                            <dd className="mt-[2px] line-clamp-2 text-[10.5px] leading-[1.32] text-ink">
                                {row.value ?? (
                                    <span className="text-ink/85 italic">
                                        not written yet
                                    </span>
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}

export function BandFront({ item, stage }: { item: VesselItem; stage: Stage }) {
    return (
        <div className="w-full rounded-[3px] shadow-[0_8px_18px_-12px_rgba(46,42,38,0.75)]">
            <div className="kraft ticket w-full rounded-[3px] px-2.5 py-2 text-ink">
                <div
                    className="h-[3px] w-full rounded-full"
                    style={{ backgroundColor: item.category.ink }}
                />
                <p className="stamp mt-1.5 text-[11.5px] leading-[1.15] tracking-[0.03em] sm:text-[13px]">
                    {item.title}
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-1.5">
                    <span className="stamp text-[11px] tracking-[0.08em] text-ink/85">
                        Day {item.day}
                    </span>
                    <StageDots stage={stage} ink={item.category.ink} />
                </div>
                <p className="stamp mt-1 flex items-center gap-1 text-[9.5px] tracking-[0.13em] text-ink/85">
                    <StatusMark state={stage} className="h-[10px] w-[10px]" />
                    {stageLabel[stage]}
                </p>
            </div>
        </div>
    );
}

export function Vessel({
    item,
    autoFlip = false,
    openInitially = false,
    flipable = true,
}: {
    item: VesselItem;
    autoFlip?: boolean;
    openInitially?: boolean;
    flipable?: boolean;
}) {
    const [stage, setStage] = useState<Stage>(
        autoFlip ? 'understood' : item.stage,
    );
    const [flipped, setFlipped] = useState(openInitially);
    const hostRef = useRef<HTMLDivElement | null>(null);
    const timers = useRef<number[]>([]);

    useEffect(() => {
        if (!autoFlip || openInitially) {
            if (!autoFlip) setStage(item.stage);
            return;
        }

        const node = hostRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                observer.disconnect();
                timers.current.push(
                    window.setTimeout(() => setFlipped(true), 700),
                );
                timers.current.push(
                    window.setTimeout(() => setStage(item.stage), 1700),
                );
            },
            { threshold: 0.45 },
        );

        observer.observe(node);
        return () => {
            observer.disconnect();
            timers.current.forEach((t) => window.clearTimeout(t));
            timers.current = [];
        };
    }, [autoFlip, item.stage, openInitially]);

    return (
        <div ref={hostRef} className="relative w-full">
            <div className="relative mx-auto aspect-[160/232] w-full max-w-[200px]">
                <Jar
                    fill={stage === 'complete' ? item.fill : item.fill * 0.78}
                    ink={item.category.ink}
                    className="absolute inset-0 h-full w-full"
                />

                <div className="absolute inset-x-[4%] top-[31%] bottom-[5%] [perspective:1400px]">
                    <div
                        className="relative h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]"
                        style={{
                            transform: flipped
                                ? 'rotateY(180deg)'
                                : 'rotateY(0deg)',
                        }}
                    >
                        <div
                            className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]"
                            aria-hidden={flipped}
                        >
                            <BandFront item={item} stage={stage} />
                        </div>
                        <div
                            className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]"
                            aria-hidden={!flipped}
                        >
                            <AnatomyCard item={item} />
                        </div>
                    </div>
                </div>
            </div>

            {flipable && (
                <button
                    type="button"
                    onClick={() => setFlipped((v) => !v)}
                    aria-expanded={flipped}
                    className="stamp mx-auto mt-3 block cursor-pointer rounded-[3px] border border-ink/25 px-3 py-1.5 text-[9.5px] tracking-[0.14em] text-ink transition-colors hover:border-ink/60 hover:bg-ink/5"
                >
                    {flipped ? 'Close the label' : 'Peek inside'}
                </button>
            )}
        </div>
    );
}

export function AnatomyPanel({ item }: { item: VesselItem }) {
    return <AnatomyCard item={item} />;
}
