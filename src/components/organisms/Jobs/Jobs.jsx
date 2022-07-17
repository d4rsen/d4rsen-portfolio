import React, { memo, useState } from 'react'
import JobsButton from '../../atoms/JobsButton/JobsButton'
import NumberedHeading from '../../atoms/NumberedHeading/NumberedHeading'
import Abt from '../../molecules/Abt/Abt'
import Home from '../../molecules/Home/Home'
import './Jobs.scss'

function Jobs() {
    const [jobs, setJobs] = useState({
        abt: true,
        home: false,
    })

    return (
        <div id="jobs" className="mainPage__jobs jobs">
            <NumberedHeading number="02." text="Where I’ve Worked"/>
            <div className="jobs__inner ">
                <div className="jobs__left">
                    <JobsButton
                        jobs={jobs}
                        setJobs={setJobs}
                        text="ABT"
                        active={jobs.abt === true}
                    />
                    <JobsButton
                        jobs={jobs}
                        setJobs={setJobs}
                        text="Home"
                        active={jobs.home === true}
                    />
                </div>
                <div className="jobs__right">
                    {jobs.abt ? <Abt/> : <Home/>}
                </div>
            </div>
        </div>
    )
}

export default memo(Jobs)
