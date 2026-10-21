import React, { useRef } from 'react';
import { useCursor } from '../../hooks/useCursor';

export const Cursor = () => {
    const ref = useRef<HTMLDivElement>(null);
    useCursor(ref);

    return (
        <div ref={ref} id="cursor">
            <div className="cursor__inner cursor__inner--circle" />
            <div className="cursor"></div>
            <div className="cursor__inner cursor__inner--dot" />
        </div>
    );
};
