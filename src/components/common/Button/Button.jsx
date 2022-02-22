import './Button.scss'

const Button = ({text, href, className}) => {
    return (
        <a href={href} target="_blank" className={`button ${className}`} rel="noreferrer">
            {text}
        </a>
    )
}

export default Button
