import { memo } from 'react'

const HeaderItem = ({ fade, href, number, text }) => {
    return (
        <div className={`right__item item ${fade}`}>
            <a href={href}>
                <div className="item__number">{number}</div>
                <div className="item__text">{text}</div>
            </a>
        </div>
    )
}

export default memo(HeaderItem)

