import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App/App';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <BrowserRouter>
        <App />
        <canvas id="c" />
    </BrowserRouter>
);
