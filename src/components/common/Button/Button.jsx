import './Button.scss'

const Button = ({text, href}) => {
    return (
        <a href={href} target="_blank" className="button" rel="noreferrer">
            {text}
        </a>
    )
}

export default Button