import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App/App';
import ErrorBoundary from './components/atoms/ErrorBoundary';
import { MenuProvider } from './store/MenuContext';
import { Sky } from './components/space/Sky';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <BrowserRouter>
        <ErrorBoundary>
            <MenuProvider>
                <App />
            </MenuProvider>
            <Sky />
        </ErrorBoundary>
    </BrowserRouter>
);
