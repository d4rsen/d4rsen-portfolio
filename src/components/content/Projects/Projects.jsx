import NumberedHeading from '../../common/NumberedHeading/NumberedHeading'
import OneProject from '../../common/OneProject/OneProject'
import {
    coliseumGitLink,
    coliseumImgSrc,
    coliseumItems,
    coliseumProjectLink,
    coliseumText,
    coliseumTitle,
    keyboardGitLink,
    keyboardImgSrc,
    keyboardItems,
    keyboardProjectLink,
    keyboardText,
    keyboardTitle
} from './consts'
import './Projects.scss'

const Projects = () => {
    return (
        <div id="projects" className="mainPage__projects projects">
            <NumberedHeading
                number={'03.'}
                text={'Some Things I’ve Built'}
            />
            <OneProject
                title={coliseumTitle}
                text={coliseumText}
                gitLink={coliseumGitLink}
                imgSrc={coliseumImgSrc}
                projectLink={coliseumProjectLink}
                stackItems={coliseumItems}
            />
            <OneProject
                title={keyboardTitle}
                text={keyboardText}
                gitLink={keyboardGitLink}
                imgSrc={keyboardImgSrc}
                projectLink={keyboardProjectLink}
                stackItems={keyboardItems}
            />
        </div>
    )
}

export default Projects
