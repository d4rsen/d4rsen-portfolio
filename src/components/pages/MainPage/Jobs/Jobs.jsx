import React, { useState } from 'react'
import JobsButton from '../../../common/JobsButton/JobsButton'
import NumberedHeading from '../../../common/NumberedHeading/NumberedHeading'
import Elbrus from './Elbrus/Elbrus'
import Home from './Home/Home'
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
            <div className="jobs__inner">
                <div className="jobs__left">
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
                <div className="jobs__right">
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