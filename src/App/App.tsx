import React, { useEffect, useState } from 'react';
import Footer from '../components/atoms/Footer';
import Loader from '../components/atoms/Loader';
import Background from '../components/molecules/Background';
import Bar from '../components/molecules/Bar';
import Header from '../components/organisms/Header';
import Router from '../router/Router';
import { useMenu } from '../store/MenuContext';
import '../scss/style.scss';
import { Cursor } from '../components/atoms/Cursor.tsx';

const LOADER_MIN_MS = 2000;
// Custom cursor only makes sense with a real mouse (iPads report a desktop UA)
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const App = () => {
    const menu = useMenu();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Show the loader for at least one jump cycle, but hide it as soon as
        // the page and fonts are ready instead of a fixed 4s
        const minDelay = new Promise((resolve) => setTimeout(resolve, LOADER_MIN_MS));
        const pageLoaded = new Promise((resolve) => {
            if (document.readyState === 'complete') resolve(null);
            else window.addEventListener('load', resolve, { once: true });
        });
        let cancelled = false;

        Promise.all([minDelay, pageLoaded, document.fonts?.ready]).then(() => {
            if (!cancelled) setIsLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    if (isLoading) return <Loader />;

    return (
        <div className="wrapper">
            <Background />
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
    );
};

export default App;
