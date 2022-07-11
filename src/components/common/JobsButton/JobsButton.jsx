import React, { memo, useCallback, useMemo } from 'react'
import './JobsButton.scss'

const elbrus = { elbrus: true, home: false, abt: false }
const abt = { elbrus: false, home: false, abt: true }
const home = { elbrus: false, home: true, abt: false }

function JobsButton({ text, active, setJobs }) {
    const color = useMemo(() => active ? 'active' : '', [active])
    const newJobs = useMemo(() => text === 'Elbrus' ? elbrus : text === 'ABT' ? abt : home, [text])
    const setJobsHandler = useCallback(() => setJobs(newJobs), [newJobs, setJobs])

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

export default memo(JobsButton)
