import React, { useEffect, useRef, useState } from 'react';
import { effectsEnabled, useEffectsEnabled } from '../../space/effects';

/** Pressing this key on its own jumps (the warp button shows it) */
const WARP_KEY = 'w';
/** Total length of the jump; must match .hyperspace animations in _hyperspace.scss */
export const JUMP_MS = 2200;
/** Stars stretch into lines until here, then the flash of arriving */
const ARRIVE_AT = 0.68;
const STAR_COUNT = 420;

const listeners = new Set<() => void>();

/** Jump to hyperspace from anywhere (the W key, the warp button, or tapping the logo) */
export const engageHyperspace = () => listeners.forEach((listener) => listener());

const drawJump = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = (canvas.width = window.innerWidth * dpr) / dpr;
    const height = (canvas.height = window.innerHeight * dpr) / dpr;
    ctx.scale(dpr, dpr);
    const cx = width / 2;
    const cy = height / 2;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000 + 50
    }));

    let rafId = 0;
    let start = 0;
    const frame = (now: number) => {
        start ||= now;
        const t = Math.min((now - start) / JUMP_MS, 1);
        // Speed ramps up hard, the way the stars stretch in the films
        const speed = t < ARRIVE_AT ? 4 + 260 * (t / ARRIVE_AT) ** 3 : 30 * (1 - t);

        ctx.clearRect(0, 0, width, height);
        ctx.lineCap = 'round';
        for (const star of stars) {
            const from = 300 / star.z;
            star.z -= speed;
            if (star.z < 1) star.z += 1000;
            const to = 300 / star.z;
            const alpha = Math.min(1, (1000 - star.z) / 400);
            ctx.strokeStyle = `rgba(214, 236, 255, ${alpha})`;
            ctx.lineWidth = Math.min(2.4, to * 1.2);
            ctx.beginPath();
            ctx.moveTo(cx + star.x * from, cy + star.y * from);
            ctx.lineTo(cx + star.x * to, cy + star.y * to);
            ctx.stroke();
        }
        if (t < 1) rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
};

/**
 * Pressing W (or the warp button) jumps the page to hyperspace. The stars
 * stretch into lines, a flash, and the site drops back out of warp.
 */
export const Hyperspace = () => {
    const [jumping, setJumping] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() !== WARP_KEY || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
            // Not while typing somewhere
            const target = e.target as HTMLElement | null;
            if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
            engageHyperspace();
        };
        const engage = () => effectsEnabled() && setJumping(true);
        listeners.add(engage);
        window.addEventListener('keydown', onKeyDown);
        return () => {
            listeners.delete(engage);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!jumping || !canvasRef.current) return;
        document.documentElement.classList.add('hyperspace');
        const stop = drawJump(canvasRef.current);
        const timer = window.setTimeout(() => setJumping(false), JUMP_MS);
        return () => {
            stop();
            window.clearTimeout(timer);
            document.documentElement.classList.remove('hyperspace');
        };
    }, [jumping]);

    return jumping ? (
        <div className="hyperspace__overlay" aria-hidden="true">
            <canvas ref={canvasRef} />
            <div className="hyperspace__flash" />
        </div>
    ) : null;
};

/** Pill next to the gravity toggle: says the jump exists and how to make it */
export const WarpButton = () => {
    const effects = useEffectsEnabled();
    if (!effects) return null;

    return (
        <button
            data-hover
            type="button"
            className="warp-button"
            title="Jump to hyperspace (or press W)"
            onClick={engageHyperspace}
        >
            <span className="warp-button__icon" aria-hidden="true" />
            <span className="warp-button__label">warp</span>
            <kbd className="warp-button__key">W</kbd>
        </button>
    );
};
