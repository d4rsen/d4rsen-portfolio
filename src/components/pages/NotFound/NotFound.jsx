import React, { memo } from 'react'
import Button from '../../atoms/Button/Button'
import './NotFound.scss'

function NotFound() {
    return (
        <div className="notFound">
            <div className="notFound__title fade1">404</div>
            <div className="notFound__subtitle fade2">Page Not Found</div>
            <Button target="_self" text="Go Home" className="notFound__button fade3" href="/"/>
        </div>
    )
}

export default memo(NotFound)
