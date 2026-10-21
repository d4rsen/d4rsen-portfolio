import React, { useMemo, useState } from 'react';
import Button from '../atoms/Button';
import NumberedHeading from '../atoms/NumberedHeading';
import { Typewriter } from '../atoms/Typewriter';
import { signalDelay } from '../../space/signal';

const text =
    'Currently I’m looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I’ll try my best to get back to you!';

function Contact() {
    const [signal, setSignal] = useState(false);
    const [transmitted, setTransmitted] = useState(false);
    const delay = useMemo(() => {
        const { vacuumMs, fiberMs } = signalDelay();
        const ms = (n: number) => (n < 1 ? '<1' : n.toFixed(1));
        return `▸ signal delay to my inbox ≈ ${ms(vacuumMs)} ms at light speed, ~${ms(fiberMs)} ms by fiber`;
    }, []);

    return (
        <div id="contact" className="mainPage__contact contact">
            <NumberedHeading number="03." text="What’s Next?" />
            <div className="contact__title">Get In Touch</div>
            <div className="contact__signal">
                <Typewriter text="▸ OUTGOING TRANSMISSION" charMs={35} onDone={() => setSignal(true)} />
            </div>
            <div className="contact__text">
                {signal && <Typewriter text={text} charMs={18} onDone={() => setTransmitted(true)} />}
                {!signal && <span className="typewriter__rest">{text}</span>}
            </div>
            {/* The channels open once the message has gone out */}
            <div className={`contact__buttons ${transmitted ? 'contact__buttons--open' : ''}`}>
                <Button className="contactButton" text="Gmail" href="mailto:darsenungarlinov00@gmail.com" />
                <Button className="contactButton" text="GitHub" href="https://github.com/d4rsen" />
                <Button className="contactButton" text="Telegram" href="https://t.me/d4rse" />
                {/* TODO номер телефона скрываем в связи с обстоятельствами */}
            </div>
            <div className="contact__delay">
                {transmitted ? (
                    <Typewriter text={delay} charMs={14} delay={600} />
                ) : (
                    <span className="typewriter__rest">{delay}</span>
                )}
            </div>
        </div>
    );
}

export default Contact;
