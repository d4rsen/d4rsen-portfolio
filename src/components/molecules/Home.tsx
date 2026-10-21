import React from 'react';
import { TelemetryLog } from '../atoms/TelemetryLog';

function Home() {
    return (
        <>
            <div className="jobs__title title">
                <span>Self studying</span>
                <span className="title__company">{' Home'}</span>
            </div>
            <div className="jobs__subtitle">Whole life</div>
            <TelemetryLog lines={['Eat', 'Sleep', 'Study', 'Code', 'Repeat']} />
        </>
    );
}

export default Home;
