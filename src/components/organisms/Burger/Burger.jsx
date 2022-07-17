import React, { memo, useCallback } from 'react'
import Button from '../../atoms/Button/Button'
import './Burger.scss'

const Burger = memo(({ menuOpen, setMenuOpen }) => {
    const closeHandler = useCallback(() => setMenuOpen(false), [setMenuOpen])

    return (
        <div className="right__burger burger ">
            <aside>
                <div
                    className={
                        menuOpen ? 'burger__list active' : 'burger__list'
                    }
                >
                    <div
                        role="navigation"
                        onClick={closeHandler}
                        className="burger__item item "
                    >
                        <a href="src/components/organisms/Burger/Burger#about">
                            <div className="item__number">01.</div>
                            <div className="item__text">About</div>
                        </a>
                    </div>
                    <div
                        role="navigation"
                        onClick={closeHandler}
                        className="burger__item item "
                    >
                        <a href="src/components/organisms/Burger/Burger#jobs">
                            <div className="item__number">02.</div>
                            <div className="item__text">Experience</div>
                        </a>
                    </div>
                    <div
                        role="navigation"
                        onClick={closeHandler}
                        className="burger__item item "
                    >
                        <a href="src/components/organisms/Burger/Burger#projects">
                            <div className="item__number">03.</div>
                            <div className="item__text">Work</div>
                        </a>
                    </div>
                    <div
                        role="navigation"
                        onClick={closeHandler}
                        className="burger__item item "
                    >
                        <a href="src/components/organisms/Burger/Burger#contact">
                            <div className="item__number">04.</div>
                            <div className="item__text">Contact</div>
                        </a>
                    </div>
                    <Button className="" text="Resume" href="/resume.pdf"/>
                </div>
            </aside>
        </div>
    )
})

export default Burger
