import { useCallback, useState } from 'react';
import JobsButton from '../atoms/JobsButton';
import NumberedHeading from '../atoms/NumberedHeading';
import Abt from '../molecules/Abt';
import Megafon from '../molecules/Megafon';
import Home from '../molecules/Home';
import { MissionPatch } from '../atoms/MissionPatch';

// Each job is a mission in the log, numbered chronologically
const MISSIONS = {
    home: { number: '01', code: 'HOM', status: 'ONGOING' },
    abt: { number: '02', code: 'ABT', status: 'COMPLETED' },
    megafon: { number: '03', code: 'MGF', status: 'ACTIVE' }
};

function Jobs() {
    const [jobs, setJobs] = useState({
        abt: false,
        home: false,
        megafon: true
    });
    // Bumped on every switch to replay the warp jump
    const [jumps, setJumps] = useState(0);

    const jumpTo = useCallback((job: typeof jobs) => {
        setJobs(job);
        setJumps((count) => count + 1);
    }, []);
    const current = jobs.abt ? 'abt' : jobs.home ? 'home' : 'megafon';

    return (
        <div id="jobs" className="mainPage__jobs jobs">
            <NumberedHeading number="02." text="Where I’ve Worked" />
            <div className="jobs__inner ">
                <div className="jobs__left">
                    <JobsButton setJobs={jumpTo} text="MegaFon" active={jobs.megafon} />
                    <JobsButton setJobs={jumpTo} text="ABT" active={jobs.abt} />
                    <JobsButton setJobs={jumpTo} text="Home" active={jobs.home} />
                </div>
                <div className="jobs__right">
                    {jumps > 0 && <div key={jumps} className="jobs__warp" aria-hidden="true" />}
                    <div key={current} className={jumps > 0 ? 'jobs__panel jobs__panel--arrived' : 'jobs__panel'}>
                        <MissionPatch {...MISSIONS[current]} />
                        {jobs.abt ? <Abt /> : jobs.home ? <Home /> : <Megafon />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Jobs;
