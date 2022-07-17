import React, { memo } from 'react'
import About from '../../organisms/About/About'
import Contact from '../../organisms/Contact/Contact'
import Hello from '../../organisms/Hello/Hello'
import Jobs from '../../organisms/Jobs/Jobs'
import Projects from '../../organisms/Projects/Projects'
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
