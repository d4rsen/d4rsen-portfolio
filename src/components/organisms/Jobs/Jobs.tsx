import React, { memo, useState } from 'react';
import JobsButton from '../../atoms/JobsButton/JobsButton';
import NumberedHeading from '../../atoms/NumberedHeading/NumberedHeading';
import Abt from '../../molecules/Abt/Abt';
import Elbrus from '../../molecules/Elbrus/Elbrus';
import './Jobs.scss';
import Megafon from '../../molecules/Megafon/Megafon';

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
                </div>
                <div className="jobs__right">{jobs.abt ? <Abt /> : jobs.elbrus ? <Elbrus /> : <Megafon />}</div>
            </div>
        </div>
    );
}

export default memo(Jobs);
