import { observer } from 'mobx-react-lite';
import React, { memo, useCallback } from 'react';
import { menu } from '../../../store/menu';
import HeaderLines from '../../atoms/HeaderLines/HeaderLines';
import Burger from '../../organisms/Burger/Burger';

const BurgerTemplate = observer(() => {
    const burgerHandler = useCallback(() => {
        menu.setMenu(!menu.open);
    }, []);

    return (
        <>
            <Burger />
            <div onClick={burgerHandler} className={menu.open ? 'hamburger active fade3' : 'hamburger fade3'}>
                <HeaderLines />
            </div>
        </>
    );
});

export default memo(BurgerTemplate);
