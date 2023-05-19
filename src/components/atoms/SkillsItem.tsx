import React, { memo } from 'react';

interface SkillsItemProps {
    text: string;
}

function SkillsItem({ text }: SkillsItemProps) {
    return <div className="skills__item">{text}</div>;
}

export default memo(SkillsItem);
