import About from './About/About'
import Contact from './Contact/Contact'
import Hello from './Hello/Hello'
import Jobs from './Jobs/Jobs'
import './MainPage.scss'
import Projects from './Projects/Projects'

const MainPage = () => {

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

export default MainPage