import React, { memo, useCallback, useMemo } from 'react'
import Button from '../../atoms/Button/Button'
import Burger from '../Burger/Burger'
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
                            <div className="right__item item fade1">
                                <a href="#about">
                                    <div className="item__number">01.</div>
                                    <div className="item__text">About</div>
                                </a>
                            </div>
                            <div className="right__item item fade2">
                                <a href="#jobs">
                                    <div className="item__number">02.</div>
                                    <div className="item__text">Experience</div>
                                </a>
                            </div>
                            <div className="right__item item fade3">
                                <a href="#projects">
                                    <div className="item__number">03.</div>
                                    <div className="item__text">Work</div>
                                </a>
                            </div>
                            <div className="right__item item fade4">
                                <a href="#contact">
                                    <div className="item__number">04.</div>
                                    <div className="item__text">Contact</div>
                                </a>
                            </div>
                        </div>
                    )}
                    <Button
                        className="fade5"
                        text="Resume"
                        href="/resume.pdf"
                    />
                    <Burger menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
                    <div
                        onClick={burgerHandler}
                        className={
                            menuOpen
                                ? 'hamburger active fade3'
                                : 'hamburger fade3'
                        }
                    >
                        <span className="line1 superfade "/>
                        <span className="line2 superfade"/>
                        <span className="line3 superfade"/>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default memo(Header)
