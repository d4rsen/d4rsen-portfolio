import { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import Router from '../components/router/Router'
import Footer from '../components/UI/Footer/Footer'
import Header from '../components/UI/Header/Header'
import Loader from '../components/UI/Loader/Loader'
import './App.scss'

function App() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        ReactGA.initialize('UA-219979405-1')
        ReactGA.pageview(window.location.pathname + window.location.search)
    }, [])

    if (isLoading) {
        return (<Loader setIsLoading={setIsLoading}/>)
    }

    return (
        <div className="wrapper">
            <div className="_main-container">
                <Header/>
                <main className="main">
                    <Router setIsLoading={setIsLoading}/>
                </main>
                <Footer/>
            </div>
        </div>
    )
}

export default App
