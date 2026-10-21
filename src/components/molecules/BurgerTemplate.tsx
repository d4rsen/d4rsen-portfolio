import React from 'react';
import { useMenu } from '../../store/MenuContext';
import HeaderLines from '../atoms/HeaderLines';
import Burger from '../organisms/Burger';

const BurgerTemplate = () => {
    const menu = useMenu();

    return (
        <>
            <Burger />
            <div onClick={menu.toggle} className={menu.open ? 'hamburger active fade3' : 'hamburger fade3'}>
                <HeaderLines />
            </div>
        </>
    );
};

export default BurgerTemplate;
