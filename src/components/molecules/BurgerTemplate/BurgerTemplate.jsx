import React, { memo } from 'react'
import HeaderLines from '../../atoms/HeaderLines/HeaderLines'
import Burger from '../../organisms/Burger/Burger'

const BurgerTemplate = ({ menuOpen, setMenuOpen, burgerHandler }) => {
    return (
        <>
            <Burger menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
            <div
                onClick={burgerHandler}
                className={menuOpen ? 'hamburger active fade3' : 'hamburger fade3'}
            >
                <HeaderLines/>
            </div>
        </>
    )
}

export default memo(BurgerTemplate)
