import React, { memo } from 'react'
import Button from '../../common/Button/Button'
import NumberedHeading from '../../common/NumberedHeading/NumberedHeading'
import './Contact.scss'

const text =
    'Currently I’m looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I’ll try my best to get back to you!'

function Contact() {
    return (
        <div id="contact" className="mainPage__contact contact">
            <NumberedHeading number="04." text="What’s Next?"/>
            <div className="contact__title">Get In Touch</div>
            <div className="contact__text">{text}</div>
            <div className="contact__buttons">
                <Button
                    text="Gmail"
                    href="mailto:darsenungarlinov00@gmail.com"
                />
                <Button text="GitHub" href="https://github.com/d4rsen"/>
                <Button text="Telegram" href="https://t.me/d4rse"/>
                <Button text="+79052418527" href="tel:+79052418527"/>
            </div>
        </div>
    )
}

export default memo(Contact)
