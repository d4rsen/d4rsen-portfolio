import { RefObject, useEffect } from 'react';

interface Point {
    x: number;
    y: number;
}

const HOVER_SELECTOR = '[data-hover]';
// Clicks on these don't spawn a black hole
const CLICKABLE_SELECTOR = `${HOVER_SELECTOR}, a, button, input, select, textarea, label, [role="button"], .hamburger`;
const HOVER_SCALE = 2.7;
const EXPLOSION_MS = 900;
const BLACKHOLE_LIFETIME_MS = 3000;

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const closest = (target: EventTarget | null, selector: string) =>
    target instanceof Element ? target.closest(selector) : null;

const closestHoverTarget = (target: EventTarget | null) => closest(target, HOVER_SELECTOR);

const spawnBlackHole = (x: number, y: number) => {
    const blackhole = document.createElement('blackhole');
    blackhole.classList.add('blackhole');
    blackhole.style.zIndex = '0';

    const megna = document.createElement('div');
    megna.classList.add('megna');

    const inner = document.createElement('div');
    inner.classList.add('black');

    blackhole.appendChild(megna);
    megna.appendChild(inner);

    const size = 20 + Math.random() * 80;
    blackhole.style.left = `${x}px`;
    blackhole.style.top = `${y}px`;
    blackhole.style.width = `${size}px`;
    blackhole.style.height = `${size}px`;
    document.body.appendChild(blackhole);

    setTimeout(() => blackhole.remove(), BLACKHOLE_LIFETIME_MS);
};

/**
 * Custom cursor: a dot that follows the mouse exactly, a circle that trails
 * behind it (and grows over [data-hover] elements), a pulsing ring, and
 * black holes spawned on every click.
 */
export const useCursor = (rootRef: RefObject<HTMLElement>) => {
    useEffect(() => {
        const root = rootRef.current;
        const dot = root?.querySelector<HTMLElement>('.cursor__inner--dot');
        const circle = root?.querySelector<HTMLElement>('.cursor__inner--circle');
        const pulse = root?.querySelector<HTMLElement>('.cursor');
        if (!dot || !circle || !pulse) return;

        const dotBounds = dot.getBoundingClientRect();
        const circleBounds = circle.getBoundingClientRect();

        const mouse: Point = { x: 0, y: 0 };
        const dotPos: Point = { x: 0, y: 0 };
        const circlePos: Point = { x: 0, y: 0 };
        let scale = 1;
        let opacity = 1;
        let lastScale = 1;
        let lastOpacity = 1;
        let rafId = 0;

        const render = () => {
            dotPos.x = mouse.x - dotBounds.width / 2;
            dotPos.y = mouse.y - dotBounds.height / 2;
            circlePos.x = lerp(circlePos.x, mouse.x - circleBounds.width / 2, 0.15);
            circlePos.y = lerp(circlePos.y, mouse.y - circleBounds.height / 2, 0.15);
            lastScale = lerp(lastScale, scale, 0.15);
            lastOpacity = lerp(lastOpacity, opacity, 0.1);

            dot.style.transform = `translateX(${dotPos.x}px) translateY(${dotPos.y}px)`;
            circle.style.transform = `translateX(${circlePos.x}px) translateY(${circlePos.y}px) scale(${lastScale})`;
            circle.style.opacity = String(lastOpacity);
            rafId = requestAnimationFrame(render);
        };

        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.pageX;
            mouse.y = e.pageY;
            pulse.style.left = `${e.clientX - 15}px`;
            pulse.style.top = `${e.clientY - 15}px`;
            pulse.style.display = 'block';
        };

        // Delegated, so links rendered after mount (route changes) work too
        const onMouseOver = (e: MouseEvent) => {
            const link = closestHoverTarget(e.target);
            if (link && !link.contains(e.relatedTarget as Node | null)) scale = HOVER_SCALE;
        };

        const onMouseOut = (e: MouseEvent) => {
            const link = closestHoverTarget(e.target);
            if (link && !link.contains(e.relatedTarget as Node | null)) scale = 1;
        };

        const onClick = (e: MouseEvent) => {
            if (closestHoverTarget(e.target)) {
                lastScale = 1;
                lastOpacity = 0;
            }

            pulse.classList.add('explosion');
            setTimeout(() => pulse.classList.remove('explosion'), EXPLOSION_MS);
            if (!closest(e.target, CLICKABLE_SELECTOR)) spawnBlackHole(e.clientX, e.clientY);
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseout', onMouseOut);
        document.addEventListener('click', onClick);
        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
            document.removeEventListener('click', onClick);
        };
    }, [rootRef]);
};
