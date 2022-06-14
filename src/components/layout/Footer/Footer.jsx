import React from "react"
import "./Footer.scss"

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <a
                    href="https://github.com/d4rsen/d4rsen-portfolio"
                    target="_blank"
                    className="footer__link"
                    rel="noreferrer"
                >
                    <div className="footer__title">
                        {"Made by < Darsen Ungarlinov />"}
                    </div>
                </a>
            </div>
        </footer>
    )
}

export default Footer
