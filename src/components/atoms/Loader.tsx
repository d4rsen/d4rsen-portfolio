import React, { useEffect, useRef, useState } from 'react';
import { QuasarCore } from '../../space/QuasarCore';
import { COLLAPSE_MS, StarBirth } from '../../space/StarBirth';
import { placeQuasar, quasar } from '../../space/quasar';
import { Typewriter } from './Typewriter';

/** The quasar appears as the collapse flashes */
const FORM_AT_MS = COLLAPSE_MS + 50;
/** Status lines typed under the forming quasar: [text, appears at ms] */
const STATUS: [string, number][] = [
    ['> collapsing nebula…', 150],
    ['> igniting core…', COLLAPSE_MS - 250],
    ['> quasar online', FORM_AT_MS + 250]
];

/** Must match the leaving transition in _loader.scss */
export const LOADER_EXIT_MS = 900;

interface LoaderProps {
    leaving: boolean;
    onExited: () => void;
}

/**
 * Intro: a gas cloud collapses and ignites into the quasar. When the site is
 * ready the "camera" pulls back: the quasar shrinks and flies to where the
 * real one sits on the page, and the loader fades out over it.
 */
function Loader({ leaving, onExited }: LoaderProps) {
    const nebulaRef = useRef<HTMLCanvasElement>(null);
    const coreRef = useRef<HTMLCanvasElement>(null);
    const [formed, setFormed] = useState(false);
    const [statusLines, setStatusLines] = useState(0);

    useEffect(() => {
        if (!nebulaRef.current || !coreRef.current) return;
        const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        const touch = window.matchMedia?.('(hover: none)').matches ?? false;

        placeQuasar(window.innerWidth, window.innerHeight);
        const core = new QuasarCore(coreRef.current, { animate: !reducedMotion });
        core.resize();
        core.start();

        if (reducedMotion) {
            setFormed(true);
            setStatusLines(STATUS.length);
            return () => core.destroy();
        }

        const birth = new StarBirth(nebulaRef.current, touch ? 220 : 420);
        birth.play();
        const timer = window.setTimeout(() => setFormed(true), FORM_AT_MS);
        const statusTimers = STATUS.map(([, at], i) => window.setTimeout(() => setStatusLines(i + 1), at));

        return () => {
            core.destroy();
            birth.destroy();
            window.clearTimeout(timer);
            statusTimers.forEach((id) => window.clearTimeout(id));
        };
    }, []);

    useEffect(() => {
        if (!leaving) return;
        const timer = window.setTimeout(onExited, LOADER_EXIT_MS);
        return () => window.clearTimeout(timer);
    }, [leaving, onExited]);

    // Offset from the screen center to the quasar's place on the page
    const style = {
        '--quasar-dx': `${quasar.x - window.innerWidth / 2}px`,
        '--quasar-dy': `${quasar.y - window.innerHeight / 2}px`
    } as React.CSSProperties;

    return (
        <div
            className={`loader ${formed ? 'loader--formed' : ''} ${leaving ? 'loader--leaving' : ''}`}
            style={style}
            aria-label="Loading"
            role="status"
        >
            <canvas ref={nebulaRef} className="loader__nebula" />
            <div className="loader__quasar">
                <canvas ref={coreRef} />
            </div>
            <div className="loader__status" aria-hidden="true">
                {STATUS.slice(0, statusLines).map(([text]) => (
                    <Typewriter key={text} text={text} charMs={22} />
                ))}
            </div>
        </div>
    );
}

export default Loader;
