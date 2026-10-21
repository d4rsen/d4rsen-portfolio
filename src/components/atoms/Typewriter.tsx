import React, { useEffect, useRef, useState } from 'react';
import { useEffectsEnabled } from '../../space/effects';

const CHAR_MS = 28;

/**
 * Types `length` characters one by one once `active` turns true; returns how
 * many are visible. Everything shows at once when effects are off.
 */
export const useTypewriter = (
    length: number,
    active: boolean,
    { charMs = CHAR_MS, delay = 0, restartKey }: { charMs?: number; delay?: number; restartKey?: unknown } = {}
) => {
    const effects = useEffectsEnabled();
    const [shown, setShown] = useState(0);

    useEffect(() => {
        setShown(0);
        if (!effects || !active) return;
        let rafId = 0;
        let begin = 0;
        const tick = (now: number) => {
            begin ||= now;
            const count = Math.max(0, Math.floor((now - begin - delay) / charMs));
            setShown(Math.min(count, length));
            if (count < length) rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [effects, active, length, charMs, delay, restartKey]);

    return effects ? shown : length;
};

/** True once the element has scrolled into view */
export const useSeen = <T extends Element>(threshold = 0.4) => {
    const ref = useRef<T>(null);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (!('IntersectionObserver' in window)) {
            setSeen(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setSeen(true);
                observer.disconnect();
            },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, seen] as const;
};

interface TypewriterProps {
    text: string;
    className?: string;
    /** Wait this long after it's visible before typing */
    delay?: number;
    charMs?: number;
    /** Keep the caret blinking after typing is done */
    keepCaret?: boolean;
    onDone?: () => void;
}

/**
 * Text typed out character by character with a blinking caret, starting when
 * it scrolls into view. The rest of the text is laid out invisibly from the
 * start, so the layout never jumps.
 */
export const Typewriter = ({ text, className, delay, charMs, keepCaret, onDone }: TypewriterProps) => {
    const [ref, seen] = useSeen<HTMLSpanElement>();
    const shown = useTypewriter(text.length, seen, { delay, charMs });
    const done = shown >= text.length;
    const reported = useRef(false);

    useEffect(() => {
        if (!done || reported.current) return;
        reported.current = true;
        onDone?.();
    }, [done, onDone]);

    return (
        <span ref={ref} className={`typewriter ${className ?? ''}`} aria-label={text}>
            <span aria-hidden="true">{text.slice(0, shown)}</span>
            {(seen && !done) || (done && keepCaret) ? <span className="typewriter__caret" aria-hidden="true" /> : null}
            <span className="typewriter__rest" aria-hidden="true">
                {text.slice(shown)}
            </span>
        </span>
    );
};
