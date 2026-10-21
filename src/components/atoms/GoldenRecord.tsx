import React, { useEffect, useRef } from 'react';

/**
 * The 14 pulsars of the cover's map: direction (degrees) and relative
 * distance from the Sun. Stylized, like the original's binary-coded lines.
 */
const PULSARS: [number, number][] = [
    [8, 0.92],
    [27, 0.55],
    [44, 0.8],
    [71, 0.38],
    [96, 0.7],
    [118, 0.48],
    [141, 0.95],
    [163, 0.6],
    [196, 0.84],
    [221, 0.42],
    [248, 0.74],
    [281, 0.58],
    [305, 0.9],
    [332, 0.5]
];
/** The long line: the direction and distance to the center of the galaxy */
const GALACTIC_CENTER: [number, number] = [0, 1.25];
const MAP_RADIUS = 46;

const toPoint = (angle: number, length: number) => {
    const rad = (angle * Math.PI) / 180;
    return [Math.cos(rad) * length * MAP_RADIUS, -Math.sin(rad) * length * MAP_RADIUS];
};

/** The record's cover, engraved with how to play it and where it came from */
const Cover = () => (
    <svg viewBox="0 0 300 300" className="golden-record__cover" role="img" aria-label="Golden Record cover">
        <defs>
            <radialGradient id="gold" cx="40%" cy="35%" r="75%">
                <stop offset="0" stopColor="#fbe7a1" />
                <stop offset="0.55" stopColor="#d4a640" />
                <stop offset="1" stopColor="#8a6418" />
            </radialGradient>
        </defs>
        <circle cx="150" cy="150" r="146" fill="url(#gold)" />
        <g fill="none" stroke="#5c430f" strokeWidth="1.1" strokeLinecap="round">
            {/* Top left: the record and stylus seen from above, with its playing time */}
            <circle cx="85" cy="90" r="36" />
            <circle cx="85" cy="90" r="5" />
            <path d="M 85 42 L 120 70" />
            <path d="M 52 52 h 4 M 60 52 h 2 M 64 52 h 4 M 72 52 h 2 M 76 52 h 2" />
            {/* Top right: the record side on, and the first lines of the picture signal */}
            <ellipse cx="215" cy="90" rx="38" ry="6" />
            <path d="M 180 80 l 70 0 M 186 104 l 6 -8 l 6 8 l 6 -8 l 6 8 l 6 -8 l 6 8 l 6 -8 l 6 8" />
            {/* Bottom left: the pulsar map, our address in the galaxy */}
            <g transform="translate(92 212)">
                {PULSARS.map(([angle, length]) => {
                    const [x, y] = toPoint(angle, length);
                    return <line key={angle} x1="0" y1="0" x2={x} y2={y} strokeWidth="0.9" />;
                })}
                <line x1="0" y1="0" x2={toPoint(...GALACTIC_CENTER)[0]} y2="0" strokeWidth="0.9" />
                <circle r="2" fill="#5c430f" />
            </g>
            {/* Bottom right: hydrogen's two spin states, the unit of time and length */}
            <circle cx="198" cy="214" r="9" />
            <circle cx="198" cy="214" r="1.6" fill="#5c430f" />
            <circle cx="240" cy="214" r="9" />
            <circle cx="240" cy="214" r="1.6" fill="#5c430f" />
            <path d="M 207 214 L 231 214 M 219 207 v 14" />
        </g>
        <circle cx="150" cy="150" r="146" fill="none" stroke="#fff3c4" strokeOpacity="0.4" />
    </svg>
);

interface GoldenRecordProps {
    onClose: () => void;
}

/** Voyager's Golden Record, opened from the distance counter in the footer */
export const GoldenRecord = ({ onClose }: GoldenRecordProps) => {
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        closeRef.current?.focus();
        const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            previous?.focus?.();
        };
    }, [onClose]);

    return (
        <div
            className="golden-record"
            role="dialog"
            aria-modal="true"
            aria-labelledby="golden-record-title"
            onClick={onClose}
        >
            <div className="golden-record__panel" onClick={(e) => e.stopPropagation()}>
                <button ref={closeRef} data-hover className="golden-record__close" onClick={onClose} aria-label="Close">
                    ×
                </button>
                <Cover />
                <h2 id="golden-record-title" className="golden-record__title">
                    The Golden Record
                </h2>
                <p className="golden-record__text">
                    Voyager 1 carries a gold-plated record: sounds and pictures of Earth, greetings in 55 languages and
                    music from Bach to Chuck Berry. The cover shows how to play it, and the pulsar map in the corner
                    points back home, timed in ticks of the hydrogen atom.
                </p>
            </div>
        </div>
    );
};
