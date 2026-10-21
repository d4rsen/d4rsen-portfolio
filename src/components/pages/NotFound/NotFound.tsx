import React, { useEffect, useRef } from 'react';
import Button from '../../atoms/Button';
import { SpaghettiText } from '../../space/SpaghettiText';
import { Typewriter } from '../../atoms/Typewriter';
import { flareQuasar, getSystemCenter } from '../../../space/quasar';
import { useEffectsEnabled } from '../../../space/effects';

/** Must match the spaghettify animation duration in _not-found.scss */
const CYCLE_MS = 14000;
/** Characters closest to the quasar go first; the farthest this much later */
const SPREAD_MS = 2600;
/** Point in the cycle where a character reaches the quasar */
const ARRIVAL = 0.56;
/** The fade1-3 entrance animations move the text; measure once they're over */
const ENTRANCE_MS = 1600;

function NotFound() {
    const ref = useRef<HTMLDivElement>(null);
    const effects = useEffectsEnabled();

    useEffect(() => {
        const root = ref.current;
        if (!root || !effects) return;
        let flareTimer = 0;
        let flareInterval = 0;

        // Aim every character at the quasar: direction, distance and turn in line
        const aim = () => {
            const quasar = getSystemCenter(window.innerWidth, window.innerHeight);
            const chars = Array.from(root.querySelectorAll<HTMLElement>('.spaghetti__char'));
            const targets = chars.map((char) => {
                const rect = char.getBoundingClientRect();
                const dx = quasar.x - (rect.left + rect.width / 2);
                const dy = quasar.y - (rect.top + rect.height / 2);
                return { char, dx, dy, distance: Math.hypot(dx, dy) };
            });
            const near = Math.min(...targets.map((t) => t.distance));
            const far = Math.max(...targets.map((t) => t.distance));

            for (const { char, dx, dy, distance } of targets) {
                const delay = ((distance - near) / Math.max(far - near, 1)) * SPREAD_MS;
                char.style.setProperty('--dx', `${dx}px`);
                char.style.setProperty('--dy', `${dy}px`);
                char.style.setProperty('--angle', `${Math.atan2(dy, dx)}rad`);
                char.style.setProperty('--fall-delay', `${delay}ms`);
            }
            root.classList.add('notFound--falling');

            // The quasar flares as the last of the text falls in
            window.clearTimeout(flareTimer);
            window.clearInterval(flareInterval);
            flareTimer = window.setTimeout(
                () => {
                    flareQuasar();
                    flareInterval = window.setInterval(flareQuasar, CYCLE_MS);
                },
                SPREAD_MS + CYCLE_MS * ARRIVAL
            );
        };

        // Measure once the font and the entrance animations have settled
        let started = false;
        const startTimer = window.setTimeout(() => {
            started = true;
            aim();
        }, ENTRANCE_MS);
        const onResize = () => {
            if (!started) return;
            // Re-measure from the characters' resting positions
            root.classList.remove('notFound--falling');
            aim();
        };
        window.addEventListener('resize', onResize);

        return () => {
            window.clearTimeout(startTimer);
            window.removeEventListener('resize', onResize);
            window.clearTimeout(flareTimer);
            window.clearInterval(flareInterval);
            root.classList.remove('notFound--falling');
        };
    }, [effects]);

    return (
        <div ref={ref} className="notFound">
            <div className="notFound__signal">
                <Typewriter text="SIGNAL LOST" charMs={70} keepCaret />
            </div>
            <SpaghettiText text="404" className="notFound__title fade1" />
            <SpaghettiText text="Page Not Found" className="notFound__subtitle fade2" />
            <SpaghettiText
                text="It crossed the event horizon. Nothing comes back from there."
                className="notFound__caption fade2"
                typed={{ delay: 1200, charMs: 28 }}
            />
            <Button target="_self" text="Go Home" className="notFound__button notFound__capsule fade3" href="/" />
        </div>
    );
}

export default NotFound;
