import React, { useEffect, useState } from 'react';

const FIRST_DELAY_MS = 2500;
const MIN_INTERVAL_MS = 4000;
const MAX_INTERVAL_MS = 9000;

interface Meteor {
    id: number;
    top: number;
    left: number;
    angle: number;
}

/** Every few seconds a meteor streaks across the sky */
export const ShootingStars = () => {
    const [meteors, setMeteors] = useState<Meteor[]>([]);

    useEffect(() => {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
        let timer = 0;
        let id = 0;

        const schedule = (delay: number) => {
            timer = window.setTimeout(() => {
                const fromLeft = Math.random() < 0.5;
                setMeteors((current) => [
                    ...current,
                    {
                        id: id++,
                        top: Math.random() * 45,
                        left: fromLeft ? Math.random() * 40 : 60 + Math.random() * 40,
                        // Always falling: down-right from the left half, down-left from the right
                        angle: fromLeft ? 20 + Math.random() * 20 : 140 + Math.random() * 20
                    }
                ]);
                schedule(MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS));
            }, delay);
        };

        schedule(FIRST_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <>
            {meteors.map(({ id, top, left, angle }) => (
                <div
                    key={id}
                    className="meteor"
                    style={{ top: `${top}vh`, left: `${left}vw`, transform: `rotate(${angle}deg)` }}
                    onAnimationEnd={() => setMeteors((current) => current.filter((m) => m.id !== id))}
                >
                    <div className="meteor__trail" />
                </div>
            ))}
        </>
    );
};
