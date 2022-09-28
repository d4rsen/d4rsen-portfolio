import React, { FC, memo, useCallback, useMemo } from 'react';
import './JobsButton.scss';

interface JobI {
    elbrus: boolean;
    abt: boolean;
    home: boolean;
    megafon: boolean;
}

interface JobsButtonProps {
    active: boolean;
    text: string;
    setJobs: (job: JobI) => void;
}

const elbrus: JobI = { elbrus: true, home: false, abt: false, megafon: false };
const abt: JobI = { elbrus: false, home: false, abt: true, megafon: false };
const home: JobI = { elbrus: false, home: true, abt: false, megafon: false };
const megafon: JobI = { elbrus: false, home: false, abt: false, megafon: true };

const JobsButton: FC<JobsButtonProps> = ({ text, active, setJobs }) => {
    const color = useMemo(() => (active ? 'active' : ''), [active]);
    const newJobs = useMemo(
        () => (text === 'Elbrus' ? elbrus : text === 'ABT' ? abt : text === 'Home' ? home : megafon),
        [text]
    );
    const setJobsHandler = useCallback(() => setJobs(newJobs), [newJobs, setJobs]);

    return (
        <button data-hover type="button" onClick={setJobsHandler} className={`jobs__button ${color}`}>
            {text}
        </button>
    );
};

export default memo(JobsButton);
