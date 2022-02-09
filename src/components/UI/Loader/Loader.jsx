import { useEffect } from 'react'
import './Loader.scss'

const Loader = ({setIsLoading}) => {
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1000)
    }, [setIsLoading])

    return (
        <div className="loader">
            <img src="assets/logo.png" alt="loader" className="loader__img"/>
        </div>
    )
}

export default Loader