import { FC } from 'react';

interface ButtonProps {
    href: string;
    text: string;
    className?: string;
    target?: string;
}

const Button: FC<ButtonProps> = ({ text, href, className, target = '_blank' }) => {
    return (
        <a data-hover href={href} target={target} className={`button ${className}`} rel="noreferrer">
            {text}
        </a>
    );
};

export default Button;
