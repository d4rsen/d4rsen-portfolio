import React, { useEffect, useMemo, useState } from 'react';
import { ProjectedConstellation, makeProjector, projectSky } from '../../space/constellations';
import { PLANETS, moonLitPath, moonPhase, moonPosition, planetPosition } from '../../space/planets';
import { useTypewriter } from '../atoms/Typewriter';

/** The sky turns ~0.25° a minute; re-project once a minute */
const REFRESH_MS = 60_000;
/** How close the mouse must be to a star to light up its constellation */
const HOVER_RADIUS = 45;

const starRadius = (mag: number) => Math.max(0.8, 2.6 - mag * 0.45);
const MOON_RADIUS = 12;
/** Keeps the Moon this far inside the screen edges */
const MOON_MARGIN = 120;

interface Body {
    name: string;
    x: number;
    y: number;
    radius: number;
    color: string;
}

/**
 * Pulls a point towards the screen center along the same direction until it
 * fits on screen: the screen only shows the sky above ~45°, so the Moon is
 * usually beyond the edge, but it stays in its real direction
 */
const keepOnScreen = (x: number, y: number, width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const dx = x - cx;
    const dy = y - cy;
    const scale = Math.min(
        1,
        Math.abs(dx) > 0 ? (cx - MOON_MARGIN) / Math.abs(dx) : 1,
        Math.abs(dy) > 0 ? (cy - MOON_MARGIN) / Math.abs(dy) : 1
    );
    return { x: cx + dx * scale, y: cy + dy * scale, pinned: scale < 1 };
};

/** The planets above the horizon right now, and the Moon (always shown, see keepOnScreen) */
const projectBodies = (width: number, height: number, date: Date) => {
    const project = makeProjector(width, height, date);
    const planets: Body[] = [];
    for (const planet of PLANETS) {
        const { ra, dec } = planetPosition(planet, date);
        const { x, y, altitude } = project(ra, dec);
        if (altitude > 0)
            planets.push({ name: planet.name, x, y, radius: starRadius(planet.mag) * 0.8, color: planet.color });
    }
    const moonAt = moonPosition(date);
    const projected = project(moonAt.ra, moonAt.dec);
    const moon = {
        name: 'Moon',
        ...keepOnScreen(projected.x, projected.y, width, height),
        belowHorizon: projected.altitude < 0,
        radius: MOON_RADIUS,
        ...moonPhase(date)
    };
    return { planets, moon };
};

/**
 * Real constellations as they stand above the visitor right now: faint lines
 * on the sky, names fading in when the mouse comes close
 */
export const Constellations = () => {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [now, setNow] = useState(() => new Date());
    const [active, setActive] = useState<string | null>(null);

    const sky = useMemo<ProjectedConstellation[]>(() => projectSky(size.width, size.height, now), [size, now]);
    const { planets, moon } = useMemo(() => projectBodies(size.width, size.height, now), [size, now]);
    const activeText =
        active === 'Moon'
            ? `Moon · ${Math.round(moon.illuminated * 100)}% lit${moon.belowHorizon ? ' · below horizon' : ''}`
            : active;
    // The name of the hovered object is typed out, like a planetarium caption
    const typed = useTypewriter(activeText?.length ?? 0, !!active, { charMs: 45, restartKey: active });

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
        const near = (x: number, y: number, e: MouseEvent) => Math.hypot(x - e.clientX, y - e.clientY) < HOVER_RADIUS;
        const onMouseMove = (e: MouseEvent) => {
            const body = [...planets, moon].find((b) => near(b.x, b.y, e));
            const hit = sky.find((constellation) =>
                Object.values(constellation.stars).some((star) => near(star.x, star.y, e))
            );
            setActive(body?.name ?? hit?.name ?? null);
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [sky, planets, moon]);

    const label = (name: string) => (active === name && activeText ? activeText.slice(0, typed) : name);

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
                            {label(name)}
                        </text>
                    </g>
                );
            })}
            {planets.map(({ name, x, y, radius, color }) => (
                <g
                    key={name}
                    className={`constellations__planet ${active === name ? 'constellations__figure--active' : ''}`}
                >
                    <circle cx={x} cy={y} r={radius * 3} style={{ fill: color }} className="constellations__halo" />
                    <circle cx={x} cy={y} r={radius} style={{ fill: color }} />
                    <text x={x} y={y + 18}>
                        {label(name)}
                    </text>
                </g>
            ))}
            {
                <g
                    className={`constellations__moon ${moon.belowHorizon ? 'constellations__moon--set' : ''} ${
                        active === 'Moon' ? 'constellations__figure--active' : ''
                    }`}
                >
                    <g transform={`translate(${moon.x} ${moon.y})`}>
                        <circle r={moon.radius * 2.6} className="constellations__halo" />
                        <circle r={moon.radius} className="constellations__moon-dark" />
                        <path d={moonLitPath(moon.radius, moon.illuminated, moon.waxing)} />
                    </g>
                    <text x={moon.x} y={moon.y + moon.radius + 16}>
                        {label('Moon')}
                    </text>
                </g>
            }
        </svg>
    );
};
