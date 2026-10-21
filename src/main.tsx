import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App/App';
import ErrorBoundary from './components/atoms/ErrorBoundary';
import { MenuProvider } from './store/MenuContext';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <BrowserRouter>
        <ErrorBoundary>
            <MenuProvider>
                <App />
            </MenuProvider>
            <div id="c"></div>
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
        </ErrorBoundary>
    </BrowserRouter>
);
