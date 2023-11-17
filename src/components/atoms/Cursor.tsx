import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { CursorFx, initBlackHoles } from './cursorClass';

export const Cursor = () => {
    const ref = useRef(null);
    const refHoles = useRef(null);

    useEffect(() => {
        refHoles.current = initBlackHoles();
        const cursor = new CursorFx(ref.current);
        // @ts-ignore
        [...document.querySelectorAll('[data-hover]')].forEach((link) => {
            link.addEventListener('mouseenter', () => cursor.enter());
            link.addEventListener('mouseleave', () => cursor.leave());
            link.addEventListener('click', () => cursor.click());
        });
    }, []);

    return (
        <div ref={ref} id="cursor">
            <div className="cursor__inner cursor__inner--circle" />
            <div className="cursor"></div>
            <div className="cursor__inner cursor__inner--dot" />
        </div>
    );
};
