import React, { memo } from 'react'
import About from '../../components/content/About/About'
import Contact from '../../components/content/Contact/Contact'
import Hello from '../../components/content/Hello/Hello'
import Jobs from '../../components/content/Jobs/Jobs'
import Projects from '../../components/content/Projects/Projects'
import './MainPage.scss'

function MainPage() {
    return (
        <div className="mainPage">
            <div className="mainPage-container ">
                <Hello/>
                <About/>
                <Jobs/>
                <Projects/>
                <Contact/>
            </div>
        </div>
    )
}

export default memo(MainPage)
