import { observer } from 'mobx-react-lite';
import React, { FC, memo, useCallback } from 'react';
import { menu } from '../../../store/menu';

interface BurgerItemProps {
    href: string;
    number: string;
    text: string;
}

const BurgerItem: FC<BurgerItemProps> = observer(({ href, number, text }) => {
    const closeHandler = useCallback(() => {
        menu.setMenu(false);
    }, []);

    return (
        <div role="navigation" onClick={closeHandler} className="burger__item item ">
            <a data-hover href={href}>
                <div className="item__number">{number}</div>
                <div className="item__text">{text}</div>
            </a>
        </div>
    );
});

export default memo(BurgerItem);
