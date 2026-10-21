import React from 'react';
import { Typewriter } from '../atoms/Typewriter';
import Button from '../atoms/Button';

function Hello() {
    return (
        <div id="hello" className="mainPage__hello hello superfade">
            <div className="hello__uptitle fade1">Hi, my name is</div>
            <div className="hello__title fade2">Darsen Ungarlinov</div>
            <div className="hello__undertitle fade3">
                <Typewriter text="I build things for the web." delay={1300} charMs={55} keepCaret />
            </div>
            <div className="hello__text fade4">
                I’m a frontend JavaScript/TypeScript developer specializing in building exceptional digital experiences.
                Currently, I’m focused on learning new technologies and my job
            </div>
            <div className="hello__button fade5">
                <Button text="Check out my GitHub!" href="https://github.com/d4rsen" />
            </div>
        </div>
    );
}

export default Hello;
