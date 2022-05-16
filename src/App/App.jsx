import React, { useEffect, useState } from 'react'
import Bar from '../components/common/Bar/Bar'
import Background from '../components/layout/Background/Background'
import Footer from '../components/layout/Footer/Footer'
import Header from '../components/layout/Header/Header'
import Loader from '../components/layout/Loader/Loader'
import Router from '../router/Router'
import './App.scss'

function App() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 4000)
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
