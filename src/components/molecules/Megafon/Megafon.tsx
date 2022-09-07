import React, { memo } from 'react';
import SkillsItem from '../../atoms/SkillsItem/SkillsItem';

function Megafon() {
    return (
        <>
            <div className="jobs__title title">
                <span>Frontend developer</span>
                <span className="title__company">{' MegaFon'}</span>
            </div>
            <div className="jobs__subtitle">July 2022 - now</div>
            <SkillsItem text="Develop beautiful projects" />
            <SkillsItem text="Work with my team && create new digital things" />
            <SkillsItem text="Communicate with other engineers, designers" />
        </>
    );
}

export default memo(Megafon);
