import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App/App';
import ErrorBoundary from './components/atoms/ErrorBoundary/ErrorBoundary';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <BrowserRouter>
        <ErrorBoundary>
            <App />
            <canvas id='c' />
        </ErrorBoundary>
    </BrowserRouter>
);
