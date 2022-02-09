import NumberedHeading from '../../../common/NumberedHeading/NumberedHeading'
import {
    coliseumGitLink,
    coliseumImgSrc,
    coliseumItems,
    coliseumProjectLink,
    coliseumText,
    coliseumTitle,
    gameStoreGitLink,
    gameStoreImgSrc,
    gameStoreItems,
    gameStoreProjectLink,
    gameStoreText,
    gameStoreTitle
} from './consts'
import OneProject from './OneProject/OneProject'
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
                title={gameStoreTitle}
                text={gameStoreText}
                gitLink={gameStoreGitLink}
                imgSrc={gameStoreImgSrc}
                projectLink={gameStoreProjectLink}
                stackItems={gameStoreItems}
            />
        </div>
    )
}

export default Projects