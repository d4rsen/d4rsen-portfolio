import React from 'react';
import { setGravityOff, useGravityOff } from '../../space/effects';

/** Switches the heavy space effects off (remembered between visits) */
export const GravityToggle = () => {
    const off = useGravityOff();

    return (
        <button
            data-hover
            type="button"
            className={`gravity-toggle ${off ? 'gravity-toggle--off' : ''}`}
            aria-pressed={!off}
            title={off ? 'Turn space effects back on' : 'Turn off animations and space effects'}
            onClick={() => setGravityOff(!off)}
        >
            <span className="gravity-toggle__orbit" aria-hidden="true" />
            <span className="gravity-toggle__label">gravity {off ? 'off' : 'on'}</span>
        </button>
    );
};
