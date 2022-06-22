import React from "react"
import SkillsItem from "../SkillsItem/SkillsItem"

function Abt() {
    return (
        <>
            <div className="jobs__title title">
                <span>Middle Frontend developer</span>
                <span className="title__company">
                    {" Alpha Business Technologies"}
                </span>
            </div>
            <div className="jobs__subtitle">July 2021 - Now</div>
            <SkillsItem
                text="Write modern, performant, maintainable code for a diverse array of client and internal projects" />
            <SkillsItem
                text="Work with a variety of platforms, frameworks, and content management systems such as JavaScript, TypeScript, React" />
            <SkillsItem
                text="Communicate with multi-disciplinary teams of engineers, designers, producers, and clients on a daily basis" />
        </>
    )
}

export default Abt
