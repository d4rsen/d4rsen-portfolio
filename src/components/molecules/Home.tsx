import React from 'react';
import SkillsItem from '../atoms/SkillsItem';

function Home() {
    return (
        <>
            <div className="jobs__title title">
                <span>Self studying</span>
                <span className="title__company">{' Home'}</span>
            </div>
            <div className="jobs__subtitle">Whole life</div>
            <SkillsItem text="Eat" />
            <SkillsItem text="Sleep" />
            <SkillsItem text="Study" />
            <SkillsItem text="Code" />
            <SkillsItem text="Repeat" />
        </>
    );
}

export default Home;
