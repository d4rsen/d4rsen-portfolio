import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../components/atoms/Footer/Footer';
import MusicPlayer from '../components/atoms/MusicPlayer/MusicPlayer';
import Background from '../components/molecules/Background/Background';
import Bar from '../components/molecules/Bar/Bar';
import Header from '../components/organisms/Header/Header';
import Router from '../router/Router';
import { menu } from '../store/menu';

it('renders without crashing', () => {
    const root = createRoot(document.createElement('div'));

    root.render(
        <BrowserRouter>
            <div className="wrapper">
                <Background />
                <MusicPlayer />
                <div className="_main-container">
                    <Header />
                    <main className={menu.open ? 'main--blur' : 'main'}>
                        <Router />
                    </main>
                    <Bar />
                    <Footer />
                </div>
            </div>
        </BrowserRouter>
    );
});
