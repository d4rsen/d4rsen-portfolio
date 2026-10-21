import React, { useEffect, useRef, useState } from 'react';
import { useEffectsEnabled } from '../../space/effects';
import {
    STAR_LAYERS,
    TwinklingStar,
    moveSkyLayer,
    renderGalaxy,
    renderStarLayer,
    setSkyCanvases
} from '../../space/sky';
import { ShootingStars } from './ShootingStars';
import { Constellations } from './Constellations';

/** Parallax depth of each star layer (fraction of the scroll it follows): far to near */
const STAR_DEPTHS = [0.012, 0.025, 0.045];
const GALAXY_DEPTH = 0.006;
const CONSTELLATION_DEPTH = 0.009;
/** Room for the constellations to drift, they don't tile either */
const CONSTELLATION_EXTRA = 160;
/** Room for the galaxy to drift, it doesn't tile */
const GALAXY_EXTRA = 120;
/** How many of the brightest stars twinkle */
const TWINKLING = 22;
/** Horizontal sway with the mouse, px for the nearest layer */
const MOUSE_SWAY = 14;
/** Extra width on each side so the sway never shows an edge */
const PADDING = 24;
/** Fraction of the remaining distance covered per frame: the sky glides, never jerks */
const EASING = 0.08;
/** Mobile browsers change the viewport height when the URL bar hides; ignore that */
const RESIZE_THRESHOLD = 120;
/** Degrees of tilt for the full sway on phones */
const TILT_RANGE = 20;

interface Twinkling {
    stars: TwinklingStar[];
    period: number;
}

/**
 * The night sky: a Milky Way band, nebulae and three depths of stars, drawn
 * once. Scrolling, the mouse or tilting the phone only shift the pre-drawn
 * layers (parallax),
 * so nothing is redrawn per frame.
 */
export const Sky = () => {
    const galaxyRef = useRef<HTMLDivElement>(null);
    const constellationsRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const hostRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [twinkling, setTwinkling] = useState<Twinkling>({ stars: [], period: 0 });
    const size = useRef({ width: 0, height: 0 });
    /** Lets a rebuild re-apply the current parallax to the new layers */
    const onRebuild = useRef(() => {});
    const effects = useEffectsEnabled();

    // Draw the sky once (and again only if the screen size really changes)
    useEffect(() => {
        const galaxy = galaxyRef.current;
        if (!galaxy) return;

        const build = () => {
            const { width, height } = (size.current = { width: window.innerWidth, height: window.innerHeight });
            const canvasWidth = width + PADDING * 2;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            const galaxyCanvas = renderGalaxy(canvasWidth, height, GALAXY_EXTRA);
            galaxy.replaceChildren(galaxyCanvas);
            const stars: TwinklingStar[] = [];
            const layers = STAR_LAYERS.map((spec, i) => {
                const nearest = i === STAR_LAYERS.length - 1;
                // Faint dots look fine at 1x; only the bright layer needs full resolution
                const canvas = renderStarLayer(
                    spec,
                    canvasWidth,
                    height,
                    nearest ? dpr : 1,
                    stars,
                    nearest ? TWINKLING : 0
                );
                hostRefs.current[i]?.replaceChildren(canvas);
                return canvas;
            });
            setSkyCanvases(galaxyCanvas, layers, -PADDING);
            setTwinkling({ stars, period: height });
            onRebuild.current();
        };

        let resizeTimer = 0;
        const onResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                const widthChanged = window.innerWidth !== size.current.width;
                const heightChanged = Math.abs(window.innerHeight - size.current.height) > RESIZE_THRESHOLD;
                if (widthChanged || heightChanged) build();
            }, 250);
        };

        build();
        window.addEventListener('resize', onResize);
        return () => {
            window.clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    // Parallax: scrolling, the mouse, or tilting the phone shift the drawn layers
    useEffect(() => {
        const galaxy = galaxyRef.current;
        if (!galaxy) return;
        const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;

        const target = { scroll: effects ? window.scrollY : 0, mx: 0, my: 0 };
        const current = { ...target };
        let rafId = 0;

        const render = () => {
            let settled = true;
            for (const key of ['scroll', 'mx', 'my'] as const) {
                current[key] += (target[key] - current[key]) * EASING;
                if (Math.abs(target[key] - current[key]) > 0.1) settled = false;
                else current[key] = target[key];
            }

            const { height } = size.current;
            STAR_DEPTHS.forEach((depth, i) => {
                const layer = layerRefs.current[i];
                if (!layer) return;
                // Layers are periodic with the viewport height: loop seamlessly
                const x = current.mx * (depth / STAR_DEPTHS[2]) * MOUSE_SWAY;
                const y = -((current.scroll * depth) % height) + current.my * (depth / STAR_DEPTHS[2]) * MOUSE_SWAY;
                layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                moveSkyLayer(i + 1, x, y);
            });
            const galaxyX = current.mx * (GALAXY_DEPTH / STAR_DEPTHS[2]) * MOUSE_SWAY;
            const galaxyY = -Math.min(current.scroll * GALAXY_DEPTH, GALAXY_EXTRA);
            galaxy.style.transform = `translate3d(${galaxyX}px, ${galaxyY}px, 0)`;
            moveSkyLayer(0, galaxyX, galaxyY);
            if (constellationsRef.current) {
                const x = current.mx * (CONSTELLATION_DEPTH / STAR_DEPTHS[2]) * MOUSE_SWAY;
                const y = -Math.min(current.scroll * CONSTELLATION_DEPTH, CONSTELLATION_EXTRA);
                constellationsRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            }

            rafId = settled ? 0 : requestAnimationFrame(render);
        };

        const wake = () => {
            if (!rafId) rafId = requestAnimationFrame(render);
        };
        onRebuild.current = wake;

        const onScroll = () => {
            target.scroll = window.scrollY;
            wake();
        };

        // -1..1 from the screen center
        const onMouseMove = (e: MouseEvent) => {
            target.mx = (e.clientX / size.current.width) * 2 - 1;
            target.my = (e.clientY / size.current.height) * 2 - 1;
            wake();
        };

        // On phones, tilting the device moves the sky (relative to how it was first held)
        let baseline: { beta: number; gamma: number } | null = null;
        const onOrientation = (e: DeviceOrientationEvent) => {
            if (e.beta === null || e.gamma === null) return;
            baseline ??= { beta: e.beta, gamma: e.gamma };
            const clamp = (n: number) => Math.max(-1, Math.min(1, n / TILT_RANGE));
            target.mx = clamp(e.gamma - baseline.gamma);
            target.my = clamp(e.beta - baseline.beta);
            wake();
        };
        const listenToTilt = () => window.addEventListener('deviceorientation', onOrientation);
        // iOS only hands out orientation after the user allows it, from a tap
        const askForTilt = () => {
            const request = (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
                .requestPermission;
            request?.()
                .then((state) => state === 'granted' && listenToTilt())
                .catch(() => {});
        };

        render();
        if (effects) {
            window.addEventListener('scroll', onScroll, { passive: true });
            if (finePointer) {
                window.addEventListener('mousemove', onMouseMove);
            } else if ('DeviceOrientationEvent' in window) {
                if ('requestPermission' in DeviceOrientationEvent) {
                    window.addEventListener('touchend', askForTilt, { once: true });
                } else {
                    listenToTilt();
                }
            }
        }

        return () => {
            cancelAnimationFrame(rafId);
            onRebuild.current = () => {};
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchend', askForTilt);
            window.removeEventListener('deviceorientation', onOrientation);
        };
    }, [effects]);

    return (
        <div className="sky" aria-hidden="true">
            <div id="c" />
            <div ref={galaxyRef} className="sky__layer" />
            <div ref={constellationsRef} className="sky__layer sky__constellations">
                <Constellations />
            </div>
            {STAR_LAYERS.map((_, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        layerRefs.current[i] = el;
                    }}
                    className="sky__layer"
                >
                    <div
                        ref={(el) => {
                            hostRefs.current[i] = el;
                        }}
                    />
                    {i === STAR_LAYERS.length - 1 &&
                        // Twice, one period apart, to match the tiled canvas
                        [0, twinkling.period].map((dy) =>
                            twinkling.stars.map(({ x, y, size, color }, j) => (
                                <div
                                    key={`${dy}-${j}`}
                                    className="sky__twinkle"
                                    style={
                                        {
                                            left: x,
                                            top: y + dy,
                                            '--size': `${size * 6}px`,
                                            '--color': color,
                                            animationDuration: `${2.5 + ((j * 7) % 10) * 0.4}s`,
                                            animationDelay: `${-((j * 13) % 10) * 0.5}s`
                                        } as React.CSSProperties
                                    }
                                />
                            ))
                        )}
                </div>
            ))}
            <ShootingStars />
        </div>
    );
};
