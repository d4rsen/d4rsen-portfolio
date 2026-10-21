import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { effectsEnabled } from '../../space/effects';

const DECODE_MS = 1700;
const NOISE_WIDTH = 160;
const NOISE_HEIGHT = 100;

interface SecretTransmissionProps {
    href: string;
    text: string;
    className?: string;
}

/** Static, then a signal locking in: drawn every frame while decoding */
const Decoder = ({ onDone }: { onDone: () => void }) => {
    const noiseRef = useRef<HTMLCanvasElement>(null);
    const waveRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const noise = noiseRef.current?.getContext('2d');
        const wave = waveRef.current?.getContext('2d');
        const start = performance.now();
        let rafId = 0;

        const frame = (now: number) => {
            const t = Math.min((now - start) / DECODE_MS, 1);

            if (noise) {
                const pixels = noise.createImageData(NOISE_WIDTH, NOISE_HEIGHT);
                for (let i = 0; i < pixels.data.length; i += 4) {
                    const v = Math.random() * 255;
                    pixels.data[i] = v * 0.6;
                    pixels.data[i + 1] = v;
                    pixels.data[i + 2] = v * 0.9;
                    pixels.data[i + 3] = 255;
                }
                noise.putImageData(pixels, 0, 0);
            }

            if (wave && waveRef.current) {
                const { width, height } = waveRef.current;
                wave.clearRect(0, 0, width, height);
                wave.strokeStyle = '#64ffda';
                wave.lineWidth = 2;
                wave.beginPath();
                for (let x = 0; x <= width; x += 3) {
                    // Noise fades out as the carrier wave locks in
                    const signal = Math.sin(x / 14 + now / 60) * height * 0.3 * t;
                    const jitter = (Math.random() - 0.5) * height * 0.6 * (1 - t);
                    const y = height / 2 + signal + jitter;
                    if (x === 0) wave.moveTo(x, y);
                    else wave.lineTo(x, y);
                }
                wave.stroke();
            }

            if (t < 1) rafId = requestAnimationFrame(frame);
            else onDone();
        };

        rafId = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(rafId);
    }, [onDone]);

    return createPortal(
        <div className="transmission" role="status" aria-live="polite">
            <canvas ref={noiseRef} className="transmission__noise" width={NOISE_WIDTH} height={NOISE_HEIGHT} />
            <div className="transmission__panel">
                <div className="transmission__line">INCOMING TRANSMISSION</div>
                <div className="transmission__line">SOURCE: UNKNOWN · 1987</div>
                <canvas ref={waveRef} className="transmission__wave" width={600} height={120} />
                <div className="transmission__line transmission__line--blink">DECODING…</div>
            </div>
        </div>,
        document.body
    );
};

/**
 * "Secret button": before opening the link, the site picks up an intercepted
 * radio transmission and decodes it
 */
export const SecretTransmission = ({ href, text, className }: SecretTransmissionProps) => {
    const [decoding, setDecoding] = useState(false);

    const open = () => {
        setDecoding(false);
        // Still within the click's user activation in most browsers; if a
        // popup blocker objects, just go there in this tab. ('noopener' can't
        // be passed as a feature: window.open would then always return null)
        const tab = window.open(href, '_blank');
        if (tab) tab.opener = null;
        else window.location.href = href;
    };

    return (
        <>
            <a
                data-hover
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`button ${className ?? ''}`}
                onClick={(e) => {
                    if (!effectsEnabled()) return;
                    e.preventDefault();
                    setDecoding(true);
                }}
            >
                {text}
            </a>
            {decoding && <Decoder onDone={open} />}
        </>
    );
};
