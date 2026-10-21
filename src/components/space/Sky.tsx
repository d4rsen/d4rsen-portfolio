import React, { useEffect, useRef, useState } from 'react';
import { STAR_LAYERS, TwinklingStar, renderGalaxy, renderStarLayer } from '../../space/sky';
import { ShootingStars } from './ShootingStars';

/** Parallax depth of each star layer (fraction of the scroll it follows): far to near */
const STAR_DEPTHS = [0.012, 0.025, 0.045];
const GALAXY_DEPTH = 0.006;
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

interface Twinkling {
    stars: TwinklingStar[];
    period: number;
}

/**
 * The night sky: a Milky Way band, nebulae and three depths of stars, drawn
 * once. Scrolling and the mouse only shift the pre-drawn layers (parallax),
 * so nothing is redrawn per frame.
 */
export const Sky = () => {
    const galaxyRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const hostRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [twinkling, setTwinkling] = useState<Twinkling>({ stars: [], period: 0 });

    useEffect(() => {
        const galaxy = galaxyRef.current;
        if (!galaxy) return;
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;

        let width = 0;
        let height = 0;

        const build = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            const canvasWidth = width + PADDING * 2;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            galaxy.replaceChildren(renderGalaxy(canvasWidth, height, GALAXY_EXTRA));
            const stars: TwinklingStar[] = [];
            STAR_LAYERS.forEach((spec, i) => {
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
            });
            setTwinkling({ stars, period: height });
        };

        const target = { scroll: window.scrollY, mx: 0, my: 0 };
        const current = { ...target };
        let rafId = 0;

        const render = () => {
            let settled = true;
            for (const key of ['scroll', 'mx', 'my'] as const) {
                current[key] += (target[key] - current[key]) * EASING;
                if (Math.abs(target[key] - current[key]) > 0.1) settled = false;
                else current[key] = target[key];
            }

            STAR_DEPTHS.forEach((depth, i) => {
                const layer = layerRefs.current[i];
                if (!layer) return;
                // Layers are periodic with the viewport height: loop seamlessly
                const offset = (current.scroll * depth) % height;
                const sway = (depth / STAR_DEPTHS[2]) * MOUSE_SWAY;
                layer.style.transform = `translate3d(${current.mx * sway}px, ${-offset + current.my * sway}px, 0)`;
            });
            const galaxyOffset = Math.min(current.scroll * GALAXY_DEPTH, GALAXY_EXTRA);
            const galaxySway = (GALAXY_DEPTH / STAR_DEPTHS[2]) * MOUSE_SWAY;
            galaxy.style.transform = `translate3d(${current.mx * galaxySway}px, ${-galaxyOffset}px, 0)`;

            rafId = settled ? 0 : requestAnimationFrame(render);
        };

        const wake = () => {
            if (!rafId) rafId = requestAnimationFrame(render);
        };

        const onScroll = () => {
            target.scroll = window.scrollY;
            wake();
        };

        // -1..1 from the screen center
        const onMouseMove = (e: MouseEvent) => {
            target.mx = (e.clientX / width) * 2 - 1;
            target.my = (e.clientY / height) * 2 - 1;
            wake();
        };

        let resizeTimer = 0;
        const onResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                const widthChanged = window.innerWidth !== width;
                const heightChanged = Math.abs(window.innerHeight - height) > RESIZE_THRESHOLD;
                if (!widthChanged && !heightChanged) return;
                build();
                wake();
            }, 250);
        };

        build();
        render();
        window.addEventListener('resize', onResize);
        if (!reducedMotion) {
            window.addEventListener('scroll', onScroll, { passive: true });
            if (finePointer) window.addEventListener('mousemove', onMouseMove);
        }

        return () => {
            cancelAnimationFrame(rafId);
            window.clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <div className="sky" aria-hidden="true">
            <div id="c" />
            <div ref={galaxyRef} className="sky__layer" />
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
