import About from '../../content/About/About'
import Contact from '../../content/Contact/Contact'
import Hello from '../../content/Hello/Hello'
import Jobs from '../../content/Jobs/Jobs'
import Projects from '../../content/Projects/Projects'
import './MainPage.scss'

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