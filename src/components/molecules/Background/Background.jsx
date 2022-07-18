import React, { memo } from 'react'
import './Background.scss'

const Background = () => {
    return (
        <>
            <div className="cube">
                <img src="assets/svg/react.svg" alt="react"/>
            </div>
            <div className="cube">
                <img src="assets/svg/redux.svg" alt="redux"/>
            </div>
            <div className="cube">
                <img src="assets/svg/javascript.svg" alt="javascript"/>
            </div>
            <div className="cube">
                <img src="assets/svg/nodejs.svg" alt="nodejs"/>
            </div>
            <div className="cube">
                <img src="assets/svg/typescript.svg" alt="typescript"/>
            </div>
            <div className="cube">
                <img src="assets/svg/reactquery.svg" alt="reactquery"/>
            </div>
            <div className="cube">
                <img src="assets/svg/css.svg" alt="css"/>
            </div>
            <div className="cube">
                <img src="assets/svg/socket-io.svg" alt="docker"/>
            </div>
            <div className="cube">
                <img src="assets/svg/html.svg" alt="html"/>
            </div>
            <div className="cube">
                <img src="assets/svg/sass.svg" alt="sass"/>
            </div>
        </>
    )
}

export default memo(Background)
