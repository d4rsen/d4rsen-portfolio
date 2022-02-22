import './NumberedHeading.scss'

const NumberedHeading = ({number, text}) => {
    return (
        <div className="numbered-heading fade1">
            <div className="numbered-heading__number">
                {number}
            </div>
            <div className="numbered-heading__text">
                {text}
            </div>
        </div>
    )
}

export default NumberedHeading
