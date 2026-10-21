import { RefObject, useEffect } from 'react';

interface Point {
    x: number;
    y: number;
}

const HOVER_SELECTOR = '[data-hover]';
/** Voyager rests a little below-right of the pointer, so it never covers the target */
const REST_OFFSET: Point = { x: 26, y: 26 };
const FOLLOW = 0.1;
const HOVER_SCALE = 1.3;
/** Heading it settles to when the mouse stops, degrees */
const REST_HEADING = -25;
const SIGNAL_MS = 900;

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

/** Shortest way from one angle to another, so it never spins the long way round */
const lerpAngle = (from: number, to: number, n: number) => {
    const delta = ((((to - from) % 360) + 540) % 360) - 180;
    return from + delta * n;
};

const closestHoverTarget = (target: EventTarget | null) =>
    target instanceof Element ? target.closest(HOVER_SELECTOR) : null;

/**
 * Custom cursor: a precise dot, escorted by the Voyager probe. It trails the
 * pointer, turns to face where it's heading, grows over links and sends a
 * radio signal when one is clicked. Black holes on click live in BlackHoles.tsx.
 */
export const useCursor = (rootRef: RefObject<HTMLElement>) => {
    useEffect(() => {
        const root = rootRef.current;
        const dot = root?.querySelector<HTMLElement>('.cursor__inner--dot');
        const voyager = root?.querySelector<HTMLElement>('.cursor__voyager');
        if (!dot || !voyager) return;

        const dotHalf = dot.getBoundingClientRect().width / 2;
        const voyagerHalf = voyager.getBoundingClientRect().width / 2;

        const mouse: Point = { x: -100, y: -100 };
        const probe: Point = { x: -100, y: -100 };
        let heading = REST_HEADING;
        let scale = 1;
        let targetScale = 1;
        let rafId = 0;
        let signalTimer = 0;

        const render = () => {
            const tx = mouse.x + REST_OFFSET.x;
            const ty = mouse.y + REST_OFFSET.y;
            const vx = tx - probe.x;
            const vy = ty - probe.y;
            probe.x = lerp(probe.x, tx, FOLLOW);
            probe.y = lerp(probe.y, ty, FOLLOW);

            // Face the direction of travel; drift back to a resting pose when still
            const moving = Math.hypot(vx, vy) > 2;
            const target = moving ? (Math.atan2(vy, vx) * 180) / Math.PI + 90 : REST_HEADING;
            heading = lerpAngle(heading, target, moving ? 0.12 : 0.03);
            scale = lerp(scale, targetScale, 0.15);

            dot.style.transform = `translate3d(${mouse.x - dotHalf}px, ${mouse.y - dotHalf}px, 0)`;
            voyager.style.transform =
                `translate3d(${probe.x - voyagerHalf}px, ${probe.y - voyagerHalf}px, 0) ` +
                `rotate(${heading}deg) scale(${scale})`;
            rafId = requestAnimationFrame(render);
        };

        const onMouseMove = (e: MouseEvent) => {
            const first = mouse.x < 0;
            mouse.x = e.pageX;
            mouse.y = e.pageY;
            if (first) {
                probe.x = mouse.x + REST_OFFSET.x;
                probe.y = mouse.y + REST_OFFSET.y;
            }
        };

        // Delegated, so links rendered after mount (route changes) work too
        const onMouseOver = (e: MouseEvent) => {
            const link = closestHoverTarget(e.target);
            if (link && !link.contains(e.relatedTarget as Node | null)) targetScale = HOVER_SCALE;
        };

        const onMouseOut = (e: MouseEvent) => {
            const link = closestHoverTarget(e.target);
            if (link && !link.contains(e.relatedTarget as Node | null)) targetScale = 1;
        };

        const onClick = (e: MouseEvent) => {
            if (!closestHoverTarget(e.target)) return;
            // Restart the radio signal animation
            voyager.classList.remove('cursor__voyager--signal');
            void voyager.offsetWidth;
            voyager.classList.add('cursor__voyager--signal');
            window.clearTimeout(signalTimer);
            signalTimer = window.setTimeout(() => voyager.classList.remove('cursor__voyager--signal'), SIGNAL_MS);
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseout', onMouseOut);
        document.addEventListener('click', onClick);
        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            window.clearTimeout(signalTimer);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
            document.removeEventListener('click', onClick);
        };
    }, [rootRef]);
};
