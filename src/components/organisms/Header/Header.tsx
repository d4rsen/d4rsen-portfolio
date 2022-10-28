import React, { memo, useMemo } from 'react';
import Button from '../../atoms/Button/Button';
import HeaderItem from '../../atoms/HeaderItem/HeaderItem';
import BurgerTemplate from '../../molecules/BurgerTemplate/BurgerTemplate';
import './Header.scss';
import logoUrl from '../../../assets/images/logo.png'

function Header() {
    const url = useMemo(() => window.location.pathname, []);

    return (
        <header className="header">
            <div className="header-container">
                <div className="header__left left">
                    <div className="left__logo fade5">
                        <a data-hover href="#">
                            <img src={logoUrl} alt="logo" className="left__img superfade" />
                        </a>
                    </div>
                </div>
                {url === '/' && (
                    <div className="header__right right">
                        <div className="right__list superfade">
                            <HeaderItem fade="fade1" href="#about" number="01." text="About" />
                            <HeaderItem fade="fade2" href="#jobs" number="02." text="Experience" />
                            <HeaderItem fade="fade3" href="#projects" number="03." text="Work" />
                            <HeaderItem fade="fade4" href="#contact" number="04." text="Contact" />
                            <Button className="fade5" text="Resume" href="/resume.pdf" />
                        </div>
                        <BurgerTemplate />
                    </div>
                )}
            </div>
        </header>
    );
}

export default memo(Header);
