import React, { useState } from 'react';
import JobsButton from '../atoms/JobsButton';
import NumberedHeading from '../atoms/NumberedHeading';
import Abt from '../molecules/Abt';
import Elbrus from '../molecules/Elbrus';
import Megafon from '../molecules/Megafon';
import Home from '../molecules/Home';

function Jobs() {
    const [jobs, setJobs] = useState({
        abt: false,
        home: false,
        elbrus: false,
        megafon: true
    });

    return (
        <div id="jobs" className="mainPage__jobs jobs">
            <NumberedHeading number="02." text="Where I’ve Worked" />
            <div className="jobs__inner ">
                <div className="jobs__left">
                    <JobsButton setJobs={setJobs} text="MegaFon" active={jobs.megafon} />
                    <JobsButton setJobs={setJobs} text="Elbrus" active={jobs.elbrus} />
                    <JobsButton setJobs={setJobs} text="ABT" active={jobs.abt} />
                    <JobsButton setJobs={setJobs} text="Home" active={jobs.home} />
                </div>
                <div className="jobs__right">
                    {jobs.abt ? <Abt /> : jobs.elbrus ? <Elbrus /> : jobs.home ? <Home /> : <Megafon />}
                </div>
            </div>
        </div>
    );
}

export default Jobs;
