import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import Footer from '../components/atoms/Footer';
import Loader from '../components/atoms/Loader';
import Background from '../components/molecules/Background';
import Bar from '../components/molecules/Bar';
import Header from '../components/organisms/Header';
import Router from '../router/Router';
import { menu } from '../store/menu.store';
import '../scss/style.scss';
import { Cursor } from '../components/atoms/Cursor';

const App = observer(() => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 4000);
    }, []);

    if (isLoading) {
        return (
            <>
                <Loader />
                <Cursor />
            </>
        );
    }

    return (
        <div className="wrapper">
            <Background />
            <Cursor />
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
});

export default App;
