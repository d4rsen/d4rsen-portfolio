import React, { useEffect, useRef } from 'react';
import { BlackHoleField } from '../../space/BlackHoleField';

// Clicks on these don't spawn a black hole
const CLICKABLE_SELECTOR = '[data-hover], a, button, input, select, textarea, label, [role="button"], .hamburger';

export const BlackHoles = () => {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const field = new BlackHoleField(ref.current);

        const onClick = (e: MouseEvent) => {
            if (e.target instanceof Element && e.target.closest(CLICKABLE_SELECTOR)) return;
            field.spawn(e.clientX, e.clientY);
        };

        document.addEventListener('click', onClick);
        return () => {
            document.removeEventListener('click', onClick);
            field.destroy();
        };
    }, []);

    return <canvas ref={ref} className="black-holes" aria-hidden="true" />;
};
