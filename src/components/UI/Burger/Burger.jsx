import Button from '../../common/Button/Button'
import './Burger.scss'

const Burger = ({menuOpen, setMenuOpen}) => {
    const closeHandler = e => setMenuOpen(false)

    return (
        <div className={'right__burger burger '}>
            <aside>
                <div className={menuOpen ? 'burger__list active' : 'burger__list'}>
                    <div onClick={closeHandler} className="burger__item item ">
                        <a href="#about">
                            <div className="item__number">
                                01.
                            </div>
                            <div className="item__text">
                                About
                            </div>
                        </a>
                    </div>
                    <div onClick={closeHandler} className="burger__item item ">
                        <a href="#jobs">
                            <div className="item__number">
                                02.
                            </div>
                            <div className="item__text">
                                Experience
                            </div>
                        </a>
                    </div>
                    <div onClick={closeHandler} className="burger__item item ">
                        <a href="#projects">
                            <div className="item__number">
                                03.
                            </div>
                            <div className="item__text">
                                Work
                            </div>
                        </a>
                    </div>
                    <div onClick={closeHandler} className="burger__item item ">
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
                        className=""
                        text={'Resume'}
                        href={'/resume.pdf'}
                    />
                </div>

            </aside>
        </div>
    )
}

export default Burger
