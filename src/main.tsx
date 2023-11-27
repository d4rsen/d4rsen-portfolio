import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App/App';
import ErrorBoundary from './components/atoms/ErrorBoundary';
import { isMobile } from 'react-device-detect';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <BrowserRouter>
        <ErrorBoundary>
            <App />
            <div id="c"></div>
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
            {!isMobile && (
                <div className="blackhole">
                    <div className="megna">
                        <div className="black"></div>
                    </div>
                </div>
            )}
        </ErrorBoundary>
    </BrowserRouter>
);
