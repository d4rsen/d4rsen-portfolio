import React, { memo } from 'react';
import NumberedHeading from '../../atoms/NumberedHeading/NumberedHeading';
import OneProject from '../OneProject/OneProject';
import {
    coliseumGitLink,
    coliseumImgSrc,
    coliseumItems,
    coliseumProjectLink,
    coliseumText,
    coliseumTitle,
    gradientGitLink,
    gradientImgSrc,
    gradientItems,
    gradientProjectLink,
    gradientText,
    gradientTitle,
    jsonGitLink,
    jsonImgSrc,
    jsonItems,
    jsonProjectLink,
    jsonText,
    jsonTitle,
    translateGitLink,
    translateImgSrc,
    translateItems,
    translateProjectLink,
    translateText,
    translateTitle
} from './constants';
import './Projects.scss';

function Projects() {
    return (
        <div id="projects" className="mainPage__projects projects">
            <NumberedHeading number="03." text="Some Things I’ve Built" />
            <OneProject
                title={coliseumTitle}
                text={coliseumText}
                gitLink={coliseumGitLink}
                imgSrc={coliseumImgSrc}
                projectLink={coliseumProjectLink}
                stackItems={coliseumItems}
            />
            <OneProject
                title={jsonTitle}
                text={jsonText}
                gitLink={jsonGitLink}
                imgSrc={jsonImgSrc}
                projectLink={jsonProjectLink}
                stackItems={jsonItems}
            />
            <OneProject
                title={gradientTitle}
                text={gradientText}
                gitLink={gradientGitLink}
                imgSrc={gradientImgSrc}
                projectLink={gradientProjectLink}
                stackItems={gradientItems}
            />
            <OneProject
                title={translateTitle}
                text={translateText}
                gitLink={translateGitLink}
                imgSrc={translateImgSrc}
                projectLink={translateProjectLink}
                stackItems={translateItems}
            />
        </div>
    );
}

export default memo(Projects);
