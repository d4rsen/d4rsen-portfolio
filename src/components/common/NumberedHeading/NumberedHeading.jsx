import React from 'react'
import './NumberedHeading.scss'

function NumberedHeading({ number, text }) {
    return (
        <div className='numbered-heading'>
            <div className='numbered-heading__number'>
                {number}
            </div>
            <div className='numbered-heading__text'>
                {text}
            </div>
        </div>
    )
}

export default NumberedHeading
