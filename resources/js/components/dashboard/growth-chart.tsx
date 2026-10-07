import type { GrowthPoint } from '@/types';

const WIDTH = 720;
const HEIGHT = 250;
const PAD = { top: 18, right: 46, bottom: 32, left: 46 };

/**
 * 30-day Knowledge growth: bars for "created per day", a line for the
 * cumulative total (PRD 27.2). Drawn as plain SVG so the dashboard ships
 * without a chart dependency.
 */
export default function GrowthChart({ points }: { points: GrowthPoint[] }) {
    if (points.length === 0) {
        return null;
    }

    const innerWidth = WIDTH - PAD.left - PAD.right;
    const innerHeight = HEIGHT - PAD.top - PAD.bottom;
    const maxCreated = Math.max(1, ...points.map((point) => point.created));
    const maxCumulative = Math.max(
        1,
        ...points.map((point) => point.cumulative),
    );

    const slot = innerWidth / points.length;
    const barWidth = Math.max(3, slot - 4);
    const baseline = PAD.top + innerHeight;
    const centerX = (index: number) => PAD.left + index * slot + slot / 2;
    const cumulativeY = (value: number) =>
        baseline - (value / maxCumulative) * innerHeight;

    const linePath = points
        .map(
            (point, index) =>
                `${index === 0 ? 'M' : 'L'} ${centerX(index).toFixed(2)} ${cumulativeY(point.cumulative).toFixed(2)}`,
        )
        .join(' ');

    const gridLines = [0, 0.25, 0.5, 0.75, 1];
    const axisLabel = (max: number, ratio: number): number =>
        Math.round(max * (1 - ratio));
    // Rounding can repeat a value on a small axis (2, 2, 1, 1, 0): keep the
    // first occurrence of each label only.
    const axisLabels = (max: number) => {
        const seen = new Set<number>();

        return gridLines.map((ratio) => {
            const value = axisLabel(max, ratio);

            if (seen.has(value)) {
                return null;
            }

            seen.add(value);

            return value;
        });
    };
    const createdLabels = axisLabels(maxCreated);
    const cumulativeLabels = axisLabels(maxCumulative);

    const labelIndexes = [
        0,
        Math.floor(points.length / 3),
        Math.floor((points.length * 2) / 3),
        points.length - 1,
    ].filter((value, index, all) => all.indexOf(value) === index);

    const created = points.reduce((sum, point) => sum + point.created, 0);
    const last = points[points.length - 1];

    return (
        <div className="flex flex-col gap-3">
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="h-[250px] w-full"
                role="img"
                aria-label={`Knowledge growth for the last ${points.length} days: ${created} created, cumulative total ${last.cumulative}.`}
            >
                {gridLines.map((ratio, lineIndex) => {
                    const y = PAD.top + ratio * innerHeight;
                    const createdLabel = createdLabels[lineIndex];
                    const cumulativeLabel = cumulativeLabels[lineIndex];

                    return (
                        <g key={ratio}>
                            <line
                                x1={PAD.left}
                                x2={WIDTH - PAD.right}
                                y1={y}
                                y2={y}
                                className="stroke-rule"
                                strokeDasharray="2 4"
                                strokeWidth="1"
                            />
                            {createdLabel !== null && (
                                <text
                                    x={PAD.left - 8}
                                    y={y + 3}
                                    textAnchor="end"
                                    className="fill-dill-deep text-[11px]"
                                >
                                    {createdLabel}
                                </text>
                            )}
                            {cumulativeLabel !== null && (
                                <text
                                    x={WIDTH - PAD.right + 8}
                                    y={y + 3}
                                    textAnchor="start"
                                    className="fill-ink-soft text-[11px]"
                                >
                                    {cumulativeLabel}
                                </text>
                            )}
                        </g>
                    );
                })}

                {points.map((point, index) => {
                    const height = (point.created / maxCreated) * innerHeight;
                    const x = centerX(index) - barWidth / 2;

                    return (
                        <rect
                            key={point.date}
                            x={x}
                            y={baseline - height}
                            width={barWidth}
                            height={Math.max(height, point.created > 0 ? 2 : 0)}
                            className="fill-dill"
                            fillOpacity="0.85"
                            rx="1"
                        />
                    );
                })}

                <path
                    d={linePath}
                    fill="none"
                    className="stroke-ink"
                    strokeWidth="1.75"
                    strokeLinejoin="round"
                />

                <line
                    x1={PAD.left}
                    x2={WIDTH - PAD.right}
                    y1={baseline}
                    y2={baseline}
                    className="stroke-rule"
                    strokeWidth="1"
                />

                {labelIndexes.map((index) => (
                    <text
                        key={index}
                        x={centerX(index)}
                        y={HEIGHT - 10}
                        textAnchor="middle"
                        className="fill-ink-soft text-[11px]"
                    >
                        {formatDay(points[index]?.date ?? '')}
                    </text>
                ))}
            </svg>

            <div className="flex flex-wrap items-center gap-4">
                <span className="stamp inline-flex items-center gap-1.5 text-[11px] tracking-[0.14em] text-ink-soft">
                    <span
                        className="size-2.5 rounded-[1px] bg-dill"
                        aria-hidden="true"
                    />
                    Created per day
                </span>
                <span className="stamp inline-flex items-center gap-1.5 text-[11px] tracking-[0.14em] text-ink-soft">
                    <span className="h-0.5 w-4 bg-ink" aria-hidden="true" />
                    Cumulative total
                </span>
            </div>
        </div>
    );
}

/**
 * "02 Oct" from an ISO date, without a date library.
 */
function formatDay(iso: string): string {
    const date = new Date(`${iso}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
    });
}
