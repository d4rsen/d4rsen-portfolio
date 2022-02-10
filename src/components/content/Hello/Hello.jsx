import Button from '../../common/Button/Button'
import './Hello.scss'

const Hello = () => {
    return (
        <div id="hello" className="mainPage__hello hello">
            <div className="hello__uptitle">
                Hi, my name is
            </div>
            <div className="hello__title">
                Darsen Ungarlinov
            </div>
            <div className="hello__undertitle">
                I build things for the web.
            </div>
            <div className="hello__text">
                I’m a fullstack JavaScript developer specializing in building (and occasionally designing) exceptional
                digital
                experiences. Currently, I’m focused on learning new technologies, such as Angular, Vue, TypeScript
            </div>
            <div className="hello__button">
                <Button
                    text={'Check out my GitHub!'}
                    href={'https://github.com/d4rsen'}
                />
            </div>
        </div>
    )
}

export default Hello