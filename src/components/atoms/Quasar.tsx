import React, { useEffect, useRef } from 'react';
import { QuasarCore } from '../../space/QuasarCore';
import { useEffectsEnabled } from '../../space/effects';
import { onQuasarFeed, placeQuasar, quasar } from '../../space/quasar';

const FLARE_MS = 2500;
const JETS_ANGLE = (quasar.tilt * 180) / Math.PI;
const KNOT_COUNT = 12;
/**
 * Blobs of plasma shot out along each jet in quick succession. Durations and
 * sizes vary a little so the stream doesn't look mechanical.
 */
const KNOTS = Array.from({ length: KNOT_COUNT }, (_, i) => {
    const duration = 1.6 + ((i * 7) % 5) * 0.2;
    return {
        duration,
        // Spread evenly over the cycle, so knots are already in flight on load
        delay: -(i / KNOT_COUNT) * duration,
        size: 0.55 + ((i * 5) % 4) * 0.18
    };
});

const Jet = ({ side }: { side: 'approaching' | 'receding' }) => (
    <div className={`quasar__jet quasar__jet--${side}`}>
        <div className="quasar__jet-cone" />
        <div className="quasar__jet-spine" />
        {KNOTS.map(({ duration, delay, size }, i) => (
            <div
                key={i}
                className="quasar__knot"
                style={
                    {
                        animationDuration: `${duration}s`,
                        animationDelay: `${delay}s`,
                        '--knot-size': size
                    } as React.CSSProperties
                }
            />
        ))}
        <div className="quasar__ejecta" />
    </div>
);

/**
 * Supermassive black hole at the center of the orbits, with relativistic jets
 * along its spin axis. Flares up whenever a black hole merges into it.
 */
export const Quasar = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const effects = useEffectsEnabled();

    useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        if (!root || !canvas) return;

        const core = new QuasarCore(canvas, { animate: effects });
        let flareTimer = 0;

        const place = () => {
            placeQuasar(window.innerWidth, window.innerHeight);
            root.style.transform = `translate3d(${quasar.x}px, ${quasar.y}px, 0)`;
            root.style.setProperty('--quasar-radius', `${quasar.radius}px`);
            core.resize();
        };

        const unsubscribe = onQuasarFeed(() => {
            place();
            core.flare();
            // Restart the flare animations if one is already running
            root.classList.remove('quasar--flare');
            void root.offsetWidth;
            root.classList.add('quasar--flare');
            window.clearTimeout(flareTimer);
            flareTimer = window.setTimeout(() => root.classList.remove('quasar--flare'), FLARE_MS);
        });

        place();
        core.start();
        window.addEventListener('resize', place);

        return () => {
            core.destroy();
            unsubscribe();
            window.clearTimeout(flareTimer);
            window.removeEventListener('resize', place);
        };
    }, [effects]);

    return (
        <div ref={rootRef} className="quasar" aria-hidden="true">
            <div className="quasar__glow" />
            <div className="quasar__axis" style={{ transform: `rotate(${JETS_ANGLE}deg)` }}>
                <div className="quasar__precession">
                    <div className="quasar__jets">
                        <Jet side="approaching" />
                        <Jet side="receding" />
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} className="quasar__core" />
        </div>
    );
};
