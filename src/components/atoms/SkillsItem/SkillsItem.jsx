import React, { memo } from 'react';
import './SkillsItem.scss';

function SkillsItem({ text }) {
    return <div className="skills__item">{text}</div>;
}

export default memo(SkillsItem);
