import React from 'react';
import { VoyagerDistance } from './VoyagerDistance';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container">
                <a
                    data-hover
                    href="https://github.com/d4rsen/d4rsen-portfolio"
                    target="_blank"
                    className="footer__link"
                    rel="noreferrer"
                >
                    <div className="footer__title">{'Made by < Darsen Ungarlinov />'}</div>
                </a>
                <VoyagerDistance />
            </div>
        </footer>
    );
};

export default Footer;
