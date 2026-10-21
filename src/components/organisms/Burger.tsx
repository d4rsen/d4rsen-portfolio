import React from 'react';
import { useMenu } from '../../store/MenuContext';
import BurgerItem from '../atoms/BurgerItem';

const Burger = () => {
    const menu = useMenu();

    return (
        <div className="right__burger burger ">
            <aside>
                <div className={menu.open ? 'burger__list active' : 'burger__list'}>
                    <BurgerItem number="00." href="#" text="Greeting" />
                    <BurgerItem number="01." href="#about" text="About" />
                    <BurgerItem number="02." href="#jobs" text="Experience" />
                    {/*<BurgerItem number="03." href="#projects" text="Work" /> */}
                    <BurgerItem number="03." href="#contact" text="Contact" />
                    {/*<Button className="" text="Resume" href="/resume.pdf" /> */}
                </div>
            </aside>
        </div>
    );
};

export default Burger;
