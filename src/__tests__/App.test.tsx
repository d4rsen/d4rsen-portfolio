import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Footer from '../components/atoms/Footer';
import Background from '../components/molecules/Background';
import Bar from '../components/molecules/Bar';
import Header from '../components/organisms/Header';
import Router from '../router/Router';
import { MenuProvider } from '../store/MenuContext';

const renderAt = (path: string) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <MenuProvider>
                <div className="wrapper">
                    <Background />
                    <div className="_main-container">
                        <Header />
                        <main className="main">
                            <Router />
                        </main>
                        <Bar />
                        <Footer />
                    </div>
                </div>
            </MenuProvider>
        </MemoryRouter>
    );

describe('App', () => {
    it('renders the main page', () => {
        renderAt('/');
        expect(screen.getByText('Darsen Ungarlinov')).toBeInTheDocument();
        expect(screen.getByText(/Hans Zimmer/)).toBeInTheDocument();
    });

    it('renders 404 for unknown routes', () => {
        renderAt('/does-not-exist');
        expect(screen.getByLabelText('Page Not Found')).toBeInTheDocument();
    });
});
