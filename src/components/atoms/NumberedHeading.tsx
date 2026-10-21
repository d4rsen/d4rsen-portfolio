import React, { useEffect, useRef, useState } from 'react';

interface NumberedHeadingProps {
    number: string | number;
    text: string;
}

/**
 * Section heading styled like a star catalog entry; when it scrolls into view
 * a probe draws the line next to it like a trajectory.
 */
function NumberedHeading({ number, text }: NumberedHeadingProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (!('IntersectionObserver' in window)) {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setVisible(true);
                observer.disconnect();
            },
            { threshold: 0.6 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`numbered-heading ${visible ? 'numbered-heading--visible' : ''}`}>
            <div className="numbered-heading__number">
                <span className="numbered-heading__catalog">NGC</span>
                {String(number).replace(/\.$/, '')}
            </div>
            <div className="numbered-heading__text">{text}</div>
            <div className="numbered-heading__trajectory" aria-hidden="true">
                <span className="numbered-heading__probe" />
            </div>
        </div>
    );
}

export default NumberedHeading;
