import React from "react"
import "./JobsButton.scss"

const elbrus = { elbrus: true, home: false, abt: false }
const abt = { elbrus: false, home: false, abt: true }
const home = { elbrus: false, home: true, abt: false }

function JobsButton({ text, active, setJobs }) {
    const color = active === true ? "active" : ""
    const newJobs = text === "Elbrus" ? elbrus : text === "ABT" ? abt : home
    const setJobsHandler = () => setJobs(newJobs)

    return (
        <button
            type="button"
            onClick={setJobsHandler}
            className={`jobs__button ${color}`}
        >
            {text}
        </button>
    )
}

export default JobsButton
