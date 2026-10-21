import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useEffectsEnabled } from '../../space/effects';

const CHAR_MS = 16;
const LINE_PAUSE_MS = 220;
/** Lets the warp jump between jobs finish first */
const START_DELAY_MS = 450;

interface TelemetryLogProps {
    lines: string[];
}

/**
 * Lines typed out one after another, character by character, like incoming
 * telemetry. Starts once the log scrolls into view; the full text is laid out
 * (invisibly) from the start, so nothing jumps while typing.
 */
export const TelemetryLog = ({ lines }: TelemetryLogProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const effects = useEffectsEnabled();
    const [elapsed, setElapsed] = useState(-1);

    // When each line starts typing, ms from the start of the log
    const starts = useMemo(() => {
        let t = START_DELAY_MS;
        return lines.map((line) => {
            const start = t;
            t += line.length * CHAR_MS + LINE_PAUSE_MS;
            return start;
        });
    }, [lines]);
    const total = starts[starts.length - 1] + lines[lines.length - 1].length * CHAR_MS;

    useEffect(() => {
        const root = ref.current;
        if (!root || !effects) return;
        let rafId = 0;
        let begin = 0;

        const tick = (now: number) => {
            begin ||= now;
            const t = now - begin;
            setElapsed(t);
            if (t < total) rafId = requestAnimationFrame(tick);
        };

        const start = () => {
            setElapsed(0);
            rafId = requestAnimationFrame(tick);
        };

        if (!('IntersectionObserver' in window)) {
            start();
            return () => cancelAnimationFrame(rafId);
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                start();
            },
            { threshold: 0.3 }
        );
        observer.observe(root);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(rafId);
        };
    }, [effects, total]);

    const done = !effects || elapsed >= total;

    return (
        <div ref={ref} className="telemetry">
            {lines.map((line, i) => {
                const shown = done ? line.length : Math.max(0, Math.floor((elapsed - starts[i]) / CHAR_MS));
                const typing = !done && elapsed >= starts[i] && shown < line.length;
                const last = i === lines.length - 1;
                return (
                    <div key={i} className="skills__item telemetry__line" aria-label={line}>
                        <span aria-hidden="true">{line.slice(0, shown)}</span>
                        {(typing || (done && last)) && <span className="telemetry__caret" aria-hidden="true" />}
                        <span className="telemetry__rest" aria-hidden="true">
                            {line.slice(shown)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
