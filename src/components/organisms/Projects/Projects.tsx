import React, { memo } from 'react';
import NumberedHeading from '../../atoms/NumberedHeading/NumberedHeading';
import OneProject from '../OneProject/OneProject';
import * as CONSTANTS from './constants';
import './Projects.scss';
import coliseumImgSrc from  '../../../assets/images/coliseum.jpg';
import jsonImgSrc from  '../../../assets/images/json.png';
import gradientImgSrc from  '../../../assets/images/gradient.jpg';
import translateImgSrc from  '../../../assets/images/translate.jpg';

function Projects() {
    return (
        <div id="projects" className="mainPage__projects projects">
            <NumberedHeading number="03." text="Some Things I’ve Built" />
            <OneProject
                title={CONSTANTS.coliseumTitle}
                text={CONSTANTS.coliseumText}
                gitLink={CONSTANTS.coliseumGitLink}
                imgSrc={coliseumImgSrc}
                projectLink={CONSTANTS.coliseumProjectLink}
                stackItems={CONSTANTS.coliseumItems}
            />
            <OneProject
                title={CONSTANTS.jsonTitle}
                text={CONSTANTS.jsonText}
                gitLink={CONSTANTS.jsonGitLink}
                imgSrc={jsonImgSrc}
                projectLink={CONSTANTS.jsonProjectLink}
                stackItems={CONSTANTS.jsonItems}
            />
            <OneProject
                title={CONSTANTS.gradientTitle}
                text={CONSTANTS.gradientText}
                gitLink={CONSTANTS.gradientGitLink}
                imgSrc={gradientImgSrc}
                projectLink={CONSTANTS.gradientProjectLink}
                stackItems={CONSTANTS.gradientItems}
            />
            <OneProject
                title={CONSTANTS.translateTitle}
                text={CONSTANTS.translateText}
                gitLink={CONSTANTS.translateGitLink}
                imgSrc={translateImgSrc}
                projectLink={CONSTANTS.translateProjectLink}
                stackItems={CONSTANTS.translateItems}
            />
        </div>
    );
}

export default memo(Projects);
