import React, { useState } from 'react'
import Elbrus from '../../common/Elbrus/Elbrus'
import Home from '../../common/Home/Home'
import JobsButton from '../../common/JobsButton/JobsButton'
import NumberedHeading from '../../common/NumberedHeading/NumberedHeading'
import './Jobs.scss'

const Jobs = () => {
    const [jobs, setJobs] = useState({
        elbrus: true,
        home: false
    })

    return (
        <div id="jobs" className="mainPage__jobs jobs">
            <NumberedHeading
                number={'02.'}
                text={'Where I’ve Worked'}
            />
            <div className="jobs__inner ">
                <div className="jobs__left fade2">
                    <JobsButton
                        jobs={jobs}
                        setJobs={setJobs}
                        text={'Elbrus'}
                        active={jobs.elbrus === true}
                    />
                    <JobsButton
                        jobs={jobs}
                        setJobs={setJobs}
                        text={'Home'}
                        active={jobs.home === true}
                    />
                </div>
                <div className="jobs__right fade3">
                    {jobs.elbrus
                        ? (<Elbrus/>)
                        : (<Home/>)
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs
