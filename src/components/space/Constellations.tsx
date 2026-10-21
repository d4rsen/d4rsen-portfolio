import React, { useEffect, useMemo, useState } from 'react';
import { ProjectedConstellation, projectSky } from '../../space/constellations';
import { useTypewriter } from '../atoms/Typewriter';

/** The sky turns ~0.25° a minute; re-project once a minute */
const REFRESH_MS = 60_000;
/** How close the mouse must be to a star to light up its constellation */
const HOVER_RADIUS = 45;

const starRadius = (mag: number) => Math.max(0.8, 2.6 - mag * 0.45);

/**
 * Real constellations as they stand above the visitor right now: faint lines
 * on the sky, names fading in when the mouse comes close
 */
export const Constellations = () => {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [now, setNow] = useState(() => new Date());
    const [active, setActive] = useState<string | null>(null);
    // The name of the hovered constellation is typed out, like a planetarium caption
    const typed = useTypewriter(active?.length ?? 0, !!active, { charMs: 45, restartKey: active });

    const sky = useMemo<ProjectedConstellation[]>(() => projectSky(size.width, size.height, now), [size, now]);

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), REFRESH_MS);
        const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', onResize);
        return () => {
            window.clearInterval(timer);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    useEffect(() => {
        if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;
        const onMouseMove = (e: MouseEvent) => {
            const hit = sky.find((constellation) =>
                Object.values(constellation.stars).some(
                    (star) => Math.hypot(star.x - e.clientX, star.y - e.clientY) < HOVER_RADIUS
                )
            );
            setActive(hit?.name ?? null);
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [sky]);

    return (
        <svg className="constellations" width={size.width} height={size.height} aria-hidden="true">
            {sky.map(({ name, stars, lines }) => {
                const points = Object.values(stars);
                // Label under the constellation's lowest star
                const labelX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
                const labelY = Math.max(...points.map((p) => p.y)) + 22;
                return (
                    <g
                        key={name}
                        className={`constellations__figure ${active === name ? 'constellations__figure--active' : ''}`}
                    >
                        {lines.map(([a, b]) => (
                            <line key={`${a}-${b}`} x1={stars[a].x} y1={stars[a].y} x2={stars[b].x} y2={stars[b].y} />
                        ))}
                        {points.map((star, i) => (
                            <circle key={i} cx={star.x} cy={star.y} r={starRadius(star.mag)} />
                        ))}
                        <text x={labelX} y={labelY}>
                            {active === name ? name.slice(0, typed) : name}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};
