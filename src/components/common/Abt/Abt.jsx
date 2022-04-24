import React from 'react'
import SkillsItem from '../SkillsItem/SkillsItem'

const Abt = () => {
    return (<>
        <div className="jobs__title title">
            <span>
                Junior developer
            </span>
            <span className="title__company">
                {' Alpha Business Technologies'}
            </span>
        </div>
        <div className="jobs__subtitle">
            Sep 2022 - Present
        </div>
        <SkillsItem
            text={'Write modern, performant, maintainable code for a diverse array of client and internal projects'}/>
        <SkillsItem
            text={
                'Work with a variety of platforms, frameworks, and content management systems such as JavaScript, TypeScript, React'
            }/>
        <SkillsItem
            text={'Communicate with multi-disciplinary teams of engineers, designers, producers, and clients on a daily basis'}/>
    </>)
}

export default Abt
