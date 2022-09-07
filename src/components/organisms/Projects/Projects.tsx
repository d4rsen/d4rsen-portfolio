import React, { memo } from 'react';
import NumberedHeading from '../../atoms/NumberedHeading/NumberedHeading';
import OneProject from '../OneProject/OneProject';
import * as CONSTANTS from './constants';
import './Projects.scss';

function Projects() {
    return (
        <div id="projects" className="mainPage__projects projects">
            <NumberedHeading number="03." text="Some Things I’ve Built" />
            <OneProject
                title={CONSTANTS.coliseumTitle}
                text={CONSTANTS.coliseumText}
                gitLink={CONSTANTS.coliseumGitLink}
                imgSrc={CONSTANTS.coliseumImgSrc}
                projectLink={CONSTANTS.coliseumProjectLink}
                stackItems={CONSTANTS.coliseumItems}
            />
            <OneProject
                title={CONSTANTS.jsonTitle}
                text={CONSTANTS.jsonText}
                gitLink={CONSTANTS.jsonGitLink}
                imgSrc={CONSTANTS.jsonImgSrc}
                projectLink={CONSTANTS.jsonProjectLink}
                stackItems={CONSTANTS.jsonItems}
            />
            <OneProject
                title={CONSTANTS.gradientTitle}
                text={CONSTANTS.gradientText}
                gitLink={CONSTANTS.gradientGitLink}
                imgSrc={CONSTANTS.gradientImgSrc}
                projectLink={CONSTANTS.gradientProjectLink}
                stackItems={CONSTANTS.gradientItems}
            />
            <OneProject
                title={CONSTANTS.translateTitle}
                text={CONSTANTS.translateText}
                gitLink={CONSTANTS.translateGitLink}
                imgSrc={CONSTANTS.translateImgSrc}
                projectLink={CONSTANTS.translateProjectLink}
                stackItems={CONSTANTS.translateItems}
            />
        </div>
    );
}

export default memo(Projects);
