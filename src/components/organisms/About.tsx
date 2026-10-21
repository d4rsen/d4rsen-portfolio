import React from 'react';
import NumberedHeading from '../atoms/NumberedHeading';
import SkillsItem from '../atoms/SkillsItem';
import { SkillsConstellation } from '../molecules/SkillsConstellation';
import { darsenGitHub } from './constants';
import darsenUrl from '../../assets/images/darsen.webp';

function About() {
    return (
        <div id="about" className="mainPage__about about">
            <div className="about__left">
                <NumberedHeading number="01." text="About Me" />
                <p>Hello! My name is Darsen and I enjoy creating things that live on the internet.</p>
                <p>Here are a few technologies I’ve been working with recently:</p>
                <SkillsConstellation>
                    <SkillsItem star text="JavaScript" />
                    <SkillsItem star text="TypeScript" />
                    <SkillsItem star text="React" />
                    <SkillsItem star text="Node.js" />
                    <SkillsItem star text="Redux" />
                    <SkillsItem star text="Styled components" />
                    <SkillsItem star text="Sass" />
                    <SkillsItem star text="Storybook" />
                    <SkillsItem star text="MobX" />
                    <SkillsItem star text="Html5" />
                    <SkillsItem star text="CSS3" />
                    <SkillsItem star text="Vite" />
                    <SkillsItem star text="Leaflet" />
                    <SkillsItem star text="Git" />
                </SkillsConstellation>
            </div>
            <div className="about__right">
                <div className="about__lens" aria-hidden="true" />
                <a data-hover href={darsenGitHub} target="_blank" rel="noreferrer">
                    <div className="about__wrapper">
                        <div className="about__imageWrapper">
                            <div className="about__imageBlocker">
                                <img className="about__darsen" src={darsenUrl} alt="darsen" />
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default About;
