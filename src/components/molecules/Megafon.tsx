import React from 'react';
import { TelemetryLog } from '../atoms/TelemetryLog';

function Megafon() {
    return (
        <>
            <div className="jobs__title title">
                <span>Frontend developer</span>
                <span className="title__company">{' MegaFon'}</span>
            </div>
            <div className="jobs__subtitle">July 2022 - now</div>
            <TelemetryLog
                lines={[
                    'Develop beautiful projects',
                    'Work with my team && create new digital things',
                    'Communicate with other engineers, designers'
                ]}
            />
        </>
    );
}

export default Megafon;
