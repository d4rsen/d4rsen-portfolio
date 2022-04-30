import React from 'react'
import './NotFound.scss'

function NotFound() {
    return (
        <div className='notFound'>
            <div className='notFound__title fade1'>
                404
            </div>
            <div className='notFound__subtitle fade2'>
                Page Not Found
            </div>
            <a className='notFound__button fade3' href='/src/pages'>
                Go Home
            </a>
        </div>
    )
}

export default NotFound
