import React, { memo } from 'react';

interface NumberedHeadingProps {
    number: string | number;
    text: string;
}

function NumberedHeading({ number, text }: NumberedHeadingProps) {
    return (
        <div className="numbered-heading">
            <div className="numbered-heading__number">{number}</div>
            <div className="numbered-heading__text">{text}</div>
        </div>
    );
}

export default memo(NumberedHeading);
