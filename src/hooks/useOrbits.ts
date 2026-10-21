import { RefObject, useEffect } from 'react';
import { requestDisruption } from '../space/debris';
import { GravityWell, getWells } from '../space/gravity';
import { getSystemCenter } from '../space/quasar';
import { getWaves, waveStrain } from '../space/waves';
import { useEffectsEnabled } from '../space/effects';

interface Orbit {
    /** Semi-major axis as a fraction of half the viewport width */
    size: number;
    /** Tilt of the orbit plane on screen, in degrees */
    tilt: number;
}

const ORBITS: Orbit[] = [
    { size: 0.42, tilt: -14 },
    { size: 0.64, tilt: -8 },
    { size: 0.86, tilt: -16 },
    { size: 1.08, tilt: -10 }
];
/** Which orbit each icon (in DOM order) travels on */
const ICON_ORBITS = [0, 0, 1, 1, 1, 2, 2, 2, 3, 3];
/** Semi-minor axis as a fraction of half the viewport height */
const ORBIT_HEIGHT = 0.6;
/** Kepler's third law: T ∝ a^1.5, so outer orbits are much slower */
const BASE_PERIOD_S = 80;

/** A black hole starts tugging at icons this many horizon radii away */
const PULL_RANGE = 24;
const PULL_STRENGTH = 14;
/** ...and swallows them at this distance */
const SWALLOW_RANGE = 3.5;
/** The icon itself vanishes quickly; its debris stream carries on on the canvas */
const SWALLOW_MS = 450;
const REAPPEAR_MS = 1500;
/** How hard a passing gravitational wave stretches/squeezes and shoves an icon */
const WAVE_STRETCH = 0.35;
const WAVE_SHOVE = 14;

const TAU = Math.PI * 2;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeInCubic = (t: number) => t ** 3;

interface Icon {
    el: HTMLElement;
    orbit: Orbit;
    phase: number;
    period: number;
    half: number;
    /** Color of its tidal debris stream */
    color: string;
    eatenBy: GravityWell | null;
    eatenAt: number;
    reappearAt: number;
}

const createIcons = (container: HTMLElement): Icon[] => {
    const elements = Array.from(container.querySelectorAll<HTMLElement>('.orbits__planet'));
    const perOrbit = ORBITS.map((_, i) => ICON_ORBITS.filter((orbit) => orbit === i).length);
    const seen = ORBITS.map(() => 0);

    return elements.map((el, i) => {
        const orbitIndex = ICON_ORBITS[i % ICON_ORBITS.length];
        const orbit = ORBITS[orbitIndex];
        // Spread icons evenly along their orbit, offsetting each orbit a bit
        const phase = (seen[orbitIndex]++ / perOrbit[orbitIndex]) * TAU + orbitIndex * 0.9;

        return {
            el,
            orbit,
            phase,
            period: BASE_PERIOD_S * orbit.size ** 1.5,
            half: el.offsetWidth / 2,
            color: el.dataset.color ?? '#64ffda',
            eatenBy: null,
            eatenAt: 0,
            reappearAt: -Infinity
        };
    });
};

/**
 * Tech icons orbiting the quasar like planets: elliptical orbits, near side
 * bigger and brighter, inner orbits faster. Black holes pull them in and
 * gravitational waves ripple through them.
 */
export const useOrbits = (containerRef: RefObject<HTMLElement>) => {
    const effects = useEffectsEnabled();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const reducedMotion = !effects;
        const icons = createIcons(container);
        let width = window.innerWidth;
        let height = window.innerHeight;
        let rafId = 0;
        const start = performance.now();

        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            icons.forEach((icon) => (icon.half = icon.el.offsetWidth / 2));
            if (reducedMotion) render(start);
        };

        const render = (now: number) => {
            const t = reducedMotion ? 0 : (now - start) / 1000;
            const { x: cx, y: cy } = getSystemCenter(width, height);
            const wells = getWells();
            const waves = getWaves(now);

            for (const icon of icons) {
                const { orbit } = icon;
                const angle = icon.phase + (TAU * t) / icon.period;
                const a = (orbit.size * width) / 2;
                const b = ((orbit.size * height) / 2) * ORBIT_HEIGHT;
                const ex = Math.cos(angle) * a;
                const ey = Math.sin(angle) * b;
                const tilt = (orbit.tilt * Math.PI) / 180;

                let x = cx + ex * Math.cos(tilt) - ey * Math.sin(tilt);
                let y = cy + ex * Math.sin(tilt) + ey * Math.cos(tilt);
                // Bottom of the ellipse is the near side of the orbit
                const depth = (Math.sin(angle) + 1) / 2;
                let scale = 0.5 + 0.5 * depth;
                let opacity = 0.25 + 0.5 * depth;
                let stretch = 1;
                let rotation = Math.sin(angle * 2) * 8;

                if (icon.eatenBy && !wells.has(icon.eatenBy)) {
                    // The black hole evaporated: put the icon back on its orbit
                    icon.eatenBy = null;
                    icon.reappearAt = now;
                }

                if (icon.eatenBy) {
                    const well = icon.eatenBy;
                    const p = clamp01((now - icon.eatenAt) / SWALLOW_MS);
                    const k = easeInCubic(p);
                    rotation = (Math.atan2(well.y - y, well.x - x) * 180) / Math.PI;
                    x += (well.x - x) * k;
                    y += (well.y - y) * k;
                    // Tidal forces stretch it towards the hole as it falls in
                    stretch = 1 + 4 * p;
                    scale *= 1 - p;
                    opacity *= 1 - p;
                } else {
                    for (const well of wells) {
                        if (well.radius <= 0) continue;
                        const dx = well.x - x;
                        const dy = well.y - y;
                        const distance = Math.hypot(dx, dy) || 1;
                        const range = well.radius * PULL_RANGE;
                        if (distance >= range) continue;

                        const pull = Math.min(distance, (1 - distance / range) ** 2 * well.radius * PULL_STRENGTH);
                        x += (dx / distance) * pull;
                        y += (dy / distance) * pull;

                        // Pulled close enough to cross the point of no return
                        if (distance - pull < well.radius * SWALLOW_RANGE) {
                            icon.eatenBy = well;
                            icon.eatenAt = now;
                            // Torn apart by tides (spaghettification)
                            requestDisruption({ host: well, x, y, color: icon.color, size: icon.half * 2 * scale });
                            break;
                        }
                    }

                    const reappear = clamp01((now - icon.reappearAt) / REAPPEAR_MS);
                    scale *= reappear;
                    opacity *= reappear;
                }

                // Gravitational waves stretch space along one axis and squeeze
                // it along the other ("plus" polarization)
                let strain = 0;
                for (const wave of waves) {
                    const h = waveStrain(wave, x, y, now);
                    if (!h) continue;
                    const distance = Math.hypot(x - wave.x, y - wave.y) || 1;
                    x += ((x - wave.x) / distance) * h * WAVE_SHOVE;
                    y += ((y - wave.y) / distance) * h * WAVE_SHOVE;
                    strain += h;
                }
                const scaleX = scale * stretch * (1 + strain * WAVE_STRETCH);
                const scaleY = (scale / Math.sqrt(stretch)) * (1 - strain * WAVE_STRETCH);

                icon.el.style.transform =
                    `translate3d(${x - icon.half}px, ${y - icon.half}px, 0) ` +
                    `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
                icon.el.style.opacity = String(opacity);
                // The quasar sits at z-index 2: far side of the orbit passes behind it
                icon.el.style.zIndex = depth > 0.5 ? '3' : '1';
            }

            if (!reducedMotion) rafId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', onResize);
        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', onResize);
        };
    }, [containerRef, effects]);
};
