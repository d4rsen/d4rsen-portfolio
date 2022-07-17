import React, { memo, useEffect, useState } from 'react'
import Footer from '../components/atoms/Footer/Footer'
import Loader from '../components/atoms/Loader/Loader'
import MusicPlayer from '../components/atoms/MusicPlayer/MusicPlayer'
import Background from '../components/molecules/Background/Background'
import Bar from '../components/molecules/Bar/Bar'
import Header from '../components/organisms/Header/Header'
import Router from '../router/Router'
import './App.scss'
import { init } from './canvas.js'

function App() {
    const [isLoading, setIsLoading] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 4000)
        init()
    }, [])

    if (isLoading) {
        return <Loader/>
    }

    return (
        <div className="wrapper">
            <Background/>
            <MusicPlayer/>
            <div className="_main-container">
                <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
                <main className={menuOpen ? 'main--blur' : 'main'}>
                    <Router/>
                </main>
                <Bar/>
                <Footer/>
            </div>
        </div>
    )
}

export default memo(App)
