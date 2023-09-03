import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { menu } from '../../store/menu.store';
import HeaderLines from '../atoms/HeaderLines';
import Burger from '../organisms/Burger';

const BurgerTemplate = observer(() => {
    const burgerHandler = useCallback(() => {
        menu.open = !menu.open;
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

export default BurgerTemplate;
