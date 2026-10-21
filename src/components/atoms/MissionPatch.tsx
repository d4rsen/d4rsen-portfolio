import React from 'react';

interface MissionPatchProps {
    number: string;
    code: string;
    status: string;
}

/** Mission patch and status line heading a job in the experience log */
export const MissionPatch = ({ number, code, status }: MissionPatchProps) => (
    <div className="mission">
        <div className="mission__patch" aria-hidden="true">
            <span className="mission__code">{code}</span>
        </div>
        <div className="mission__meta">
            <div className="mission__number">MISSION {number}</div>
            <div className="mission__status">
                <span className="mission__light" /> STATUS: {status}
            </div>
        </div>
    </div>
);
