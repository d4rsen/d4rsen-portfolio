import './NotFound.scss'

const NotFound = () => {
    return (
        <div className="notFound">
            <div className="notFound__title">
                404
            </div>
            <div className="notFound__subtitle">
                Page Not Found
            </div>
            <a className="notFound__button" href="/">
                Go Home
            </a>
        </div>
    )
}

export default NotFound