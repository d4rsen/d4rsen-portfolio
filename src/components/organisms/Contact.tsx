import React from 'react';
import Button from '../atoms/Button';
import NumberedHeading from '../atoms/NumberedHeading';

const text =
    'Currently I’m looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I’ll try my best to get back to you!';

function Contact() {
    return (
        <div id="contact" className="mainPage__contact contact">
            <NumberedHeading number="03." text="What’s Next?" />
            <div className="contact__title">Get In Touch</div>
            <div className="contact__text">{text}</div>
            <div className="contact__buttons">
                <Button className="contactButton" text="Gmail" href="mailto:darsenungarlinov00@gmail.com" />
                <Button className="contactButton" text="GitHub" href="https://github.com/d4rsen" />
                <Button className="contactButton" text="Telegram" href="https://t.me/d4rse" />
                {/* TODO номер телефона скрываем в связи с обстоятельствами */}
            </div>
        </div>
    );
}

export default Contact;
