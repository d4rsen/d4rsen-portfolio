import { FC, memo } from 'react';
import './Button.scss';

interface ButtonProps {
    href: string;
    text: string;
    className?: string;
    target?: string;
}

const Button: FC<ButtonProps> = ({ text, href, className, target = '_blank' }) => {
    return (
        <a href={href} target={target} className={`button ${className}`} rel="noreferrer">
            {text}
        </a>
    );
};

export default memo(Button);
