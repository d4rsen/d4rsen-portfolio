import React from 'react';

interface SpaghettiTextProps {
    text: string;
    className?: string;
    /** Type the text in first: start after `delay` ms, `charMs` per character */
    typed?: { delay: number; charMs: number };
}

/**
 * Text split into individually animatable characters (words are kept
 * together so lines still wrap normally). Used on the 404 page, where each
 * character gets stretched and pulled into the quasar.
 */
export const SpaghettiText = ({ text, className, typed }: SpaghettiTextProps) => {
    let index = 0;
    return (
        <div className={`${className ?? ''} ${typed ? 'spaghetti--typed' : ''}`} aria-label={text}>
            {text.split(' ').map((word, w) => (
                <React.Fragment key={w}>
                    {w > 0 && ' '}
                    <span className="spaghetti__word" aria-hidden="true">
                        {word.split('').map((char, i) => {
                            // Spaces count too, so typing keeps a steady rhythm
                            const position = index++ + w;
                            return (
                                <span
                                    key={i}
                                    className="spaghetti__char"
                                    style={
                                        typed
                                            ? ({
                                                  '--type-delay': `${typed.delay + position * typed.charMs}ms`
                                              } as React.CSSProperties)
                                            : undefined
                                    }
                                >
                                    {char}
                                </span>
                            );
                        })}
                    </span>
                </React.Fragment>
            ))}
        </div>
    );
};
