import React, { FC } from 'react';
import { useMenu } from '../../store/MenuContext';

interface BurgerItemProps {
    href: string;
    number: string;
    text: string;
}

const BurgerItem: FC<BurgerItemProps> = ({ href, number, text }) => {
    const { setOpen } = useMenu();

    return (
        <div role="navigation" onClick={() => setOpen(false)} className="burger__item item ">
            <a data-hover href={href}>
                <div className="item__number">{number}</div>
                <div className="item__text">{text}</div>
            </a>
        </div>
    );
};

export default BurgerItem;
