import React, { memo } from 'react';
import SkillsItem from '../../atoms/SkillsItem/SkillsItem';

const Elbrus = () => {
    return (
        <>
            <div className="jobs__title title">
                <span>JavaScript Mentor</span>
                <span className="title__company">{' Elbrus Coding Bootcamp'}</span>
            </div>
            <div className="jobs__subtitle">Apr 2022 - July 2022</div>
            <SkillsItem text="Teach students and help them to master new technologies" />
            <SkillsItem text="Code Review, practice and theory" />
            <SkillsItem text="Communicate with team to make study much better" />
        </>
    );
};

export default memo(Elbrus);
