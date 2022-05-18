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
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1000)
    }, [])

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className='wrapper'>
            <Background />
            <div className='_main-container'>
                <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <main className={menuOpen ? 'main--blur' : 'main'}>
                    <Router />
                </main>
                <Bar />
                <Footer />
            </div>
        </div>
    )
}

export default App
