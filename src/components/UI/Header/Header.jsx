import { useState } from 'react'
import Button from '../../common/Button/Button'
import Burger from '../Burger/Burger'
import './Header.scss'

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const burgerHandler = e => setMenuOpen(!menuOpen)

    return (
        <header className="header">
            <div className="header-container">
                <div className="header__left left">
                    <div className="left__logo">
                        <a href="/">
                            <img src="assets/logo.png" alt="logo" className="left__img"/>
                        </a>
                    </div>
                </div>
                <div className="header__right right">
                    <div className="right__list">
                        <div className="right__item item">
                            <a href="#about">
                                <div className="item__number">
                                    01.
                                </div>
                                <div className="item__text">
                                    About
                                </div>
                            </a>
                        </div>
                        <div className="right__item item">
                            <a href="#jobs">
                                <div className="item__number">
                                    02.
                                </div>
                                <div className="item__text">
                                    Experience
                                </div>
                            </a>
                        </div>
                        <div className="right__item item">
                            <a href="#projects">
                                <div className="item__number">
                                    03.
                                </div>
                                <div className="item__text">
                                    Work
                                </div>
                            </a>
                        </div>
                        <div className="right__item item">
                            <a href="#contact">
                                <div className="item__number">
                                    04.
                                </div>
                                <div className="item__text">
                                    Contact
                                </div>
                            </a>
                        </div>
                        <Button
                            text={'Resume'}
                            href={'https://hh.ru/resume/57aeb169ff099c631e0039ed1f627468636c74'}
                        />
                    </div>
                    <Burger menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
                    <div onClick={burgerHandler} className={menuOpen ? 'hamburger active' : 'hamburger'}>
                        <span className="line1"/>
                        <span className="line2"/>
                        <span className="line3"/>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header