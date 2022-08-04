import { memo } from 'react';
import './Button.scss';

function Button({ text, href, className, target = '_blank' }) {
    return (
        <a href={href} target={target} className={`button ${className}`} rel="noreferrer">
            {text}
        </a>
    );
}

export default memo(Button);
