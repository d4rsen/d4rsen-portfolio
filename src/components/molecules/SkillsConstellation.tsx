import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface SkillsConstellationProps {
    children: ReactNode;
}

/**
 * Wraps the skills grid and links the stars next to each skill into a
 * constellation, drawn when the list scrolls into view. Each column becomes a
 * chain, joined at the bottom.
 */
export const SkillsConstellation = ({ children }: SkillsConstellationProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [path, setPath] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const root = ref.current;
        if (!root) return;

        const measure = () => {
            const box = root.getBoundingClientRect();
            const stars = Array.from(root.querySelectorAll('.skills__star')).map((star) => {
                const rect = star.getBoundingClientRect();
                return { x: rect.left + rect.width / 2 - box.left, y: rect.top + rect.height / 2 - box.top };
            });
            // Group into columns by x, each sorted top to bottom
            const columns: { x: number; y: number }[][] = [];
            for (const star of stars) {
                const column = columns.find((c) => Math.abs(c[0].x - star.x) < 20);
                if (column) column.push(star);
                else columns.push([star]);
            }
            columns.forEach((column) => column.sort((a, b) => a.y - b.y));
            // Down the first column, up the next one, and so on
            const points = columns.flatMap((column, i) => (i % 2 ? [...column].reverse() : column));
            setPath(points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
        };

        measure();
        const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
        resizeObserver?.observe(root);

        const intersectionObserver =
            'IntersectionObserver' in window
                ? new IntersectionObserver(
                      ([entry]) => {
                          if (!entry.isIntersecting) return;
                          setVisible(true);
                          intersectionObserver?.disconnect();
                      },
                      { threshold: 0.5 }
                  )
                : null;
        if (intersectionObserver) intersectionObserver.observe(root);
        else setVisible(true);

        return () => {
            resizeObserver?.disconnect();
            intersectionObserver?.disconnect();
        };
    }, []);

    return (
        <div ref={ref} className={`about__skills skills constellation ${visible ? 'constellation--visible' : ''}`}>
            <svg className="constellation__lines" aria-hidden="true">
                <path d={path} pathLength={1} />
            </svg>
            {children}
        </div>
    );
};
