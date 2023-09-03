import { observer } from 'mobx-react-lite';
import React, { memo } from 'react';
import { menu } from '../../store/menu.store';
import BurgerItem from '../atoms/BurgerItem';
import Button from '../atoms/Button';

const Burger = observer(() => {
    return (
        <div className="right__burger burger ">
            <aside>
                <div className={menu.open ? 'burger__list active' : 'burger__list'}>
                    <BurgerItem number="01." href="#about" text="About" />
                    <BurgerItem number="02." href="#jobs" text="Experience" />
                    {/* <BurgerItem number="03." href="#projects" text="Work" /> */}
                    <BurgerItem number="03." href="#contact" text="Contact" />
                    {/* <Button className="" text="Resume" href="/resume.pdf" /> */}
                </div>
            </aside>
        </div>
    );
});

export default memo(Burger);
