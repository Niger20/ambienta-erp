import { useState } from 'react';

/* ─────────── Beautiful Interactive SVG Line Chart ─────────── */
export const LineChartSVG = ({ data, xKey: _xKey, yKey, title, strokeColor, areaColor }: any) => {
    const width = 500;
    const height = 240;
    const padding = 45;

    const yValues = data.map((d: any) => Number(d[yKey]));
    const maxY = Math.max(...yValues, 10) * 1.15;
    const minY = 0;

    const points = data.map((d: any, i: number) => {
        const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2);
        const ratio = (Number(d[yKey]) - minY) / (maxY - minY || 1);
        const y = height - padding - ratio * (height - padding * 2);
        return { x, y, item: d };
    });

    const linePath = points.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
        : '';

    const [activePoint, setActivePoint] = useState<any>(null);

    return (
        <div className="card" style={{ flex: 1, minWidth: '320px', position: 'relative' }}>
            <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>{title}</h4>
            <div style={{ position: 'relative', width: '100%' }}>
                <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id={`grad-${yKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={areaColor} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={areaColor} stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                        const y = padding + ratio * (height - padding * 2);
                        const val = maxY - ratio * (maxY - minY);
                        return (
                            <g key={ratio} opacity="0.12">
                                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--text-secondary)" strokeWidth="1" strokeDasharray="3 3" />
                                <text x={padding - 6} y={y + 3} textAnchor="end" fontSize="9" fill="var(--text-secondary)" fontFamily="var(--font-sans)">
                                    {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Area gradient fill */}
                    {areaPath && <path d={areaPath} fill={`url(#grad-${yKey})`} />}

                    {/* Stroke line */}
                    {linePath && <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                    {/* Points and hover hitboxes */}
                    {points.map((p: any, i: number) => {
                        const dateObj = new Date(p.item.dateStr + 'T00:00:00');
                        const labelX = dateObj.toLocaleDateString('es-NI', { day: 'numeric', month: 'short' });
                        const isFirstOrLast = i === 0 || i === points.length - 1;
                        const showLabel = isFirstOrLast || i % Math.ceil(points.length / 5) === 0;

                        return (
                            <g key={i}>
                                {showLabel && (
                                    <text x={p.x} y={height - padding + 15} textAnchor="middle" fontSize="9" fill="var(--text-secondary)" opacity="0.6">
                                        {labelX}
                                    </text>
                                )}

                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={activePoint?.index === i ? "6" : "3.5"}
                                    fill={strokeColor}
                                    stroke="var(--bg-card)"
                                    strokeWidth="1.5"
                                    style={{ transition: 'r 0.15s' }}
                                />

                                <rect
                                    x={p.x - 12}
                                    y={padding}
                                    width="24"
                                    height={height - padding * 2}
                                    fill="transparent"
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={() => setActivePoint({ index: i, ...p })}
                                    onMouseLeave={() => setActivePoint(null)}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Dynamic Tooltip */}
                {activePoint && (
                    <div style={{
                        position: 'absolute',
                        left: `${(activePoint.x / width) * 100}%`,
                        top: `${(activePoint.y / height) * 100 - 15}%`,
                        transform: 'translate(-50%, -100%)',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.4rem 0.6rem',
                        fontSize: '0.75rem',
                        boxShadow: 'var(--shadow-md)',
                        pointerEvents: 'none',
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                        color: 'var(--text-primary)'
                    }}>
                        <div style={{ fontWeight: 600 }}>{new Date(activePoint.item.dateStr + 'T00:00:00').toLocaleDateString('es-NI', { dateStyle: 'medium' })}</div>
                        <div style={{ color: strokeColor, fontWeight: 700, marginTop: '0.15rem' }}>
                            {yKey === 'total' ? `C$ ${Number(activePoint.item.total).toFixed(2)}` : `${Number(activePoint.item.stock).toFixed(0)} u.`}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
