import React from 'react';
import logoUrl from '../../assets/images/logo.png';

function Loader() {
    return (
        <div className="loader ">
            <img src={logoUrl} alt="loader" className="loader__img " />
        </div>
    );
}

export default Loader;
