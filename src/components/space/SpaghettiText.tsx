import React from 'react';

interface SpaghettiTextProps {
    text: string;
    className?: string;
}

/**
 * Text split into individually animatable characters (words are kept
 * together so lines still wrap normally). Used on the 404 page, where each
 * character gets stretched and pulled into the quasar.
 */
export const SpaghettiText = ({ text, className }: SpaghettiTextProps) => (
    <div className={className} aria-label={text}>
        {text.split(' ').map((word, w) => (
            <React.Fragment key={w}>
                {w > 0 && ' '}
                <span className="spaghetti__word" aria-hidden="true">
                    {word.split('').map((char, i) => (
                        <span key={i} className="spaghetti__char">
                            {char}
                        </span>
                    ))}
                </span>
            </React.Fragment>
        ))}
    </div>
);
