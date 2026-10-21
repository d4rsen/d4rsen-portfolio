import React from 'react';

interface SkillsItemProps {
    text: string;
    /** Marks the item with a star (used for the skills constellation) */
    star?: boolean;
}

function SkillsItem({ text, star }: SkillsItemProps) {
    return (
        <div className={`skills__item ${star ? 'skills__item--star' : ''}`}>
            {star && <span className="skills__star" aria-hidden="true" />}
            {text}
        </div>
    );
}

export default SkillsItem;
