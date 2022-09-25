import React, { memo } from 'react';
import NumberedHeading from '../../atoms/NumberedHeading/NumberedHeading';
import SkillsItem from '../../atoms/SkillsItem/SkillsItem';
import { darsenGitHub } from '../Projects/constants';
import './About.scss';

function About() {
    return (
        <div id='about' className='mainPage__about about'>
            <div className='about__left'>
                <NumberedHeading number='01.' text='About Me' />
                <p>Hello! My name is Darsen and I enjoy creating things that live on the internet.</p>
                <p>Here are a few technologies I’ve been working with recently:</p>
                <div className='about__skills skills'>
                    <SkillsItem text='JavaScript' />
                    <SkillsItem text='TypeScript' />
                    <SkillsItem text='React' />
                    <SkillsItem text='Node.js' />
                    <SkillsItem text='Redux' />
                    <SkillsItem text='Styled components' />
                    <SkillsItem text='Sass' />
                    <SkillsItem text='Storybook' />
                    <SkillsItem text='MobX' />
                    <SkillsItem text='Node.js' />
                </div>
            </div>
            <div className='about__right'>
                <a href={darsenGitHub} target='_blank' rel='noreferrer'>
                    <div className='about__wrapper'>
                        <div className='about__imageWrapper'>
                            <div className='about__imageBlocker'>
                                <img className='about__darsen' src='assets/images/darsen.jpeg' alt='darsen' />
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default memo(About);
