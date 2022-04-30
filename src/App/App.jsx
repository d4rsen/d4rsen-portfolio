import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import Bar from '../components/common/Bar/Bar'
import Router from '../components/router/Router'
import Background from '../components/UI/Background/Background'
import Footer from '../components/UI/Footer/Footer'
import Header from '../components/UI/Header/Header'
import Loader from '../components/UI/Loader/Loader'
import './App.scss'

function App() {
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 4000)
        ReactGA.initialize('UA-219979405-1')
        ReactGA.pageview(window.location.pathname + window.location.search)
    }, [])

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className='wrapper'>
            <Background />
            <div className='_main-container'>
                <Header />
                <main className='main'>
                    <Router />
                </main>
                <Bar />
                <Footer />
            </div>
        </div>
    )
}

export default App
