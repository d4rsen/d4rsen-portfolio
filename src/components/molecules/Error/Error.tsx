import React, { memo } from 'react';
import Button from '../../atoms/Button/Button';
import Background from '../Background/Background';

function ErrorComponent() {
    return (
        <div className="wrapper">
            <Background />
            <div className="_main-container">
                <main className="main">
                    <div className="notFound">
                        <div className="notFound__title fade1">500</div>
                        <div className="notFound__subtitle fade2">An error has occurred, try reloading the page</div>
                        <Button target="_self" text="Reload page" className="notFound__button fade3" href="/" />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default memo(ErrorComponent);
