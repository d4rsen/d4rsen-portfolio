import NumberedHeading from '../../common/NumberedHeading/NumberedHeading'
import SkillsItem from '../../common/SkillsItem/SkillsItem'
import './About.scss'

const About = () => {
    return (
        <div id="about" className="mainPage__about about">
            <div className="about__left">
                <NumberedHeading
                    number={'01.'}
                    text={'About Me'}
                />
                <p>
                    Hello! My name is Darsen and I enjoy creating things that live on the internet.
                </p>
                <p>
                    Here are a few technologies I’ve been working with recently:
                </p>
                <div className="about__skills skills">
                    <SkillsItem text={'JavaScript (ES6)'}/>
                    <SkillsItem text={'JavaScript (ES5)'}/>
                    <SkillsItem text={'React'}/>
                    <SkillsItem text={'Node.js'}/>
                    <SkillsItem text={'Redux'}/>
                    <SkillsItem text={'Express'}/>
                    <SkillsItem text={'HTML'}/>
                    <SkillsItem text={'Socket.io'}/>
                    <SkillsItem text={'CSS'}/>
                    <SkillsItem text={'PostgreSQL'}/>
                    <SkillsItem text={'Sass'}/>
                    <SkillsItem text={'JsonWebToken'}/>
                </div>
            </div>
            <div className="about__right">
                <div className="about__wrapper">
                    <div className="about__imageWrapper">
                        <div className="about__imageBlocker">
                            <img className="about__darsen" src="assets/darsen.jpeg" alt="darsen"/>
                        </div>
                        <div className="about__hidden"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About