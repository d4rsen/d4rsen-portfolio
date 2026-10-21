import React, { useEffect, useRef } from 'react';
import { BlackHoleField } from '../../space/BlackHoleField';
import { useEffectsEnabled } from '../../space/effects';
import { unlockSpaceSound } from '../../space/sound';

// Clicks on these don't spawn a black hole
const CLICKABLE_SELECTOR =
    '[data-hover], a, button, input, select, textarea, label, [role="button"], [role="dialog"], .hamburger';
/** On touch screens a black hole needs a long press, so taps and scrolling stay normal */
const LONG_PRESS_MS = 450;
const LONG_PRESS_SLOP = 10;

const isClickable = (target: EventTarget | null) => target instanceof Element && !!target.closest(CLICKABLE_SELECTOR);

export const BlackHoles = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    const effects = useEffectsEnabled();

    useEffect(() => {
        if (!ref.current || !effects) return;
        const field = new BlackHoleField(ref.current);
        const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;

        const onClick = (e: MouseEvent) => {
            if (isClickable(e.target)) return;
            unlockSpaceSound();
            field.spawn(e.clientX, e.clientY);
        };

        let pressTimer = 0;
        let start: { x: number; y: number } | null = null;
        let spawnedByPress = false;

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length !== 1 || isClickable(e.target)) return;
            const touch = e.touches[0];
            start = { x: touch.clientX, y: touch.clientY };
            pressTimer = window.setTimeout(() => {
                if (!start) return;
                spawnedByPress = true;
                field.spawn(start.x, start.y);
                // A long press would otherwise also start selecting text
                window.getSelection()?.removeAllRanges();
                start = null;
            }, LONG_PRESS_MS);
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!start) return;
            const touch = e.touches[0];
            if (Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > LONG_PRESS_SLOP) cancelPress();
        };

        const cancelPress = () => {
            start = null;
            window.clearTimeout(pressTimer);
        };

        // Lifting the finger is what browsers (iOS especially) count as a
        // gesture that may start audio, so the merger chirp is unlocked here
        const onTouchEnd = () => {
            if (spawnedByPress) unlockSpaceSound();
            spawnedByPress = false;
            cancelPress();
        };

        if (finePointer) {
            document.addEventListener('click', onClick);
        } else {
            document.addEventListener('touchstart', onTouchStart, { passive: true });
            document.addEventListener('touchmove', onTouchMove, { passive: true });
            document.addEventListener('touchend', onTouchEnd);
            document.addEventListener('touchcancel', cancelPress);
        }

        return () => {
            cancelPress();
            document.removeEventListener('click', onClick);
            document.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            document.removeEventListener('touchcancel', cancelPress);
            field.destroy();
        };
    }, [effects]);

    return <canvas ref={ref} className="black-holes" aria-hidden="true" />;
};
