import React, { useMemo, useRef } from 'react';
import HeaderItem from '../atoms/HeaderItem';
import BurgerTemplate from '../molecules/BurgerTemplate';
import logoUrl from '../../assets/images/logo.png';
import { SecretTransmission } from '../atoms/SecretTransmission';
import { engageHyperspace } from '../space/Hyperspace';

/** Tapping the logo this many times quickly is the touch-screen Konami code */
const LOGO_TAPS = 5;
const LOGO_TAPS_WINDOW_MS = 1500;

function Header() {
    const url = useMemo(() => window.location.pathname, []);
    const taps = useRef<number[]>([]);

    const onLogoClick = () => {
        const now = Date.now();
        taps.current = [...taps.current.filter((t) => now - t < LOGO_TAPS_WINDOW_MS), now];
        if (taps.current.length < LOGO_TAPS) return;
        taps.current = [];
        engageHyperspace();
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header__left left">
                    <div className="left__logo fade5">
                        <a data-hover href="#" onClick={onLogoClick}>
                            <img src={logoUrl} alt="logo" className="left__img superfade" />
                        </a>
                    </div>
                </div>
                {url === '/' && (
                    <div className="header__right right">
                        <div className="right__list superfade">
                            <HeaderItem number="00." href="#" text="Greeting" />
                            <HeaderItem fade="fade1" href="#about" number="01." text="About" />
                            <HeaderItem fade="fade2" href="#jobs" number="02." text="Experience" />
                            <HeaderItem fade="fade4" href="#contact" number="03." text="Contact" />
                            <SecretTransmission
                                className="fade5"
                                text="Secret button"
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            />
                        </div>
                        <BurgerTemplate />
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
