import React, { useCallback, useEffect, useState } from 'react';
import Footer from '../components/atoms/Footer';
import Loader from '../components/atoms/Loader';
import Background from '../components/molecules/Background';
import Bar from '../components/molecules/Bar';
import Header from '../components/organisms/Header';
import Router from '../router/Router';
import { useMenu } from '../store/MenuContext';
import '../scss/style.scss';
import { Cursor } from '../components/atoms/Cursor.tsx';
import { BlackHoles } from '../components/atoms/BlackHoles';

/** Long enough for the star birth intro to play out */
const LOADER_MIN_MS = 2400;
// Custom cursor only makes sense with a real mouse (iPads report a desktop UA)
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const App = () => {
    const menu = useMenu();
    const [phase, setPhase] = useState<'loading' | 'leaving' | 'done'>('loading');
    const onLoaderExited = useCallback(() => setPhase('done'), []);

    useEffect(() => {
        // Let the intro play, then reveal the site as soon as the page and
        // fonts are ready
        const minDelay = new Promise((resolve) => setTimeout(resolve, LOADER_MIN_MS));
        const pageLoaded = new Promise((resolve) => {
            if (document.readyState === 'complete') resolve(null);
            else window.addEventListener('load', resolve, { once: true });
        });
        let cancelled = false;

        Promise.all([minDelay, pageLoaded, document.fonts?.ready]).then(() => {
            if (!cancelled) setPhase('leaving');
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <>
            {phase !== 'loading' && (
                <div className="wrapper">
                    <Background />
                    {hasFinePointer && <BlackHoles />}
                    {hasFinePointer && <Cursor />}
                    <div className="_main-container">
                        <Header />
                        <main className={menu.open ? 'main--blur' : 'main'}>
                            <Router />
                        </main>
                        <Bar />
                    </div>
                    <Footer />
                </div>
            )}
            {phase !== 'done' && <Loader leaving={phase === 'leaving'} onExited={onLoaderExited} />}
        </>
    );
};

export default App;
