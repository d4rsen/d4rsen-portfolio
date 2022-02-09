import './JobsButton.scss'

const elbrus = {elbrus: true, home: false}
const home = {elbrus: false, home: true}

const JobsButton = ({text, active, setJobs}) => {
    const color = active === true ? 'active' : ''
    const newJobs = text === 'Elbrus' ? elbrus : home
    const setJobsHandler = e => setJobs(newJobs)

    return (
        <button onClick={setJobsHandler} className={`jobs__button ${color}`}>
            {text}
        </button>
    )
}

export default JobsButton