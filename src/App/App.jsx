import { observer } from 'mobx-react-lite'
import React, { memo, useEffect, useState } from 'react'
import Footer from '../components/atoms/Footer/Footer'
import Loader from '../components/atoms/Loader/Loader'
import MusicPlayer from '../components/atoms/MusicPlayer/MusicPlayer'
import Background from '../components/molecules/Background/Background'
import Bar from '../components/molecules/Bar/Bar'
import Header from '../components/organisms/Header/Header'
import Router from '../router/Router'
import { menu } from '../store/menu'
import './App.scss'
import { init } from './canvas.js'

const App = observer(() => {
    const [isLoading, setIsLoading] = useState(true)

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
                <Header/>
                <main className={menu.open ? 'main--blur' : 'main'}>
                    <Router/>
                </main>
                <Bar/>
                <Footer/>
            </div>
        </div>
    )
})

export default memo(App)
