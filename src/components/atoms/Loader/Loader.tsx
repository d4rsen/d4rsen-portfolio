import React, { memo } from 'react';
import './Loader.scss';
import logoUrl from '../../../assets/images/logo.png'

function Loader() {
    return (
        <div className="loader ">
            <img src={logoUrl} alt="loader" className="loader__img " />
        </div>
    );
}

export default memo(Loader);
