import React, { memo, useCallback, useMemo } from 'react'
import Button from '../../atoms/Button/Button'
import HeaderItem from '../../atoms/HeaderItem/HeaderItem'
import BurgerTemplate from '../../molecules/BurgerTemplate/BurgerTemplate'
import './Header.scss'

function Header({ menuOpen, setMenuOpen }) {
    const url = useMemo(() => window.location.pathname, [])

    const burgerHandler = useCallback(() => setMenuOpen((prev) => !prev), [setMenuOpen])

    return (
        <header className="header">
            <div className="header-container">
                <div className="header__left left">
                    <div className="left__logo fade5">
                        <a href="#">
                            <img
                                src="assets/images/logo.png"
                                alt="logo"
                                className="left__img superfade"
                            />
                        </a>
                    </div>
                </div>
                <div className="header__right right">
                    {url === '/' && (
                        <div className="right__list superfade">
                            <HeaderItem fade="fade1" href="#about" number="01." text="About"/>
                            <HeaderItem fade="fade2" href="#jobs" number="02." text="Experience"/>
                            <HeaderItem fade="fade3" href="#projects" number="03." text="Work"/>
                            <HeaderItem fade="fade4" href="#contact" number="04." text="Contact"/>
                            <Button className="fade5" text="Resume" href="/resume.pdf"/>
                        </div>
                    )}
                    <BurgerTemplate
                        burgerHandler={burgerHandler}
                        setMenuOpen={setMenuOpen}
                        menuOpen={menuOpen}
                    />
                </div>
            </div>
        </header>
    )
}

export default memo(Header)
