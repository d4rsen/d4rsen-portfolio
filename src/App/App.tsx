import { observer } from 'mobx-react-lite';
import React, { memo, useEffect, useState } from 'react';
import Footer from '../components/atoms/Footer/Footer';
import Loader from '../components/atoms/Loader/Loader';
import Background from '../components/molecules/Background/Background';
import Bar from '../components/molecules/Bar/Bar';
import Header from '../components/organisms/Header/Header';
import Router from '../router/Router';
import { menu } from '../store/menu.store';
import './App.scss';
import LoadingBar from 'react-top-loading-bar'; // @ts-ignore
import { init } from './canvas';
import { Cursor } from '../components/atoms/Cursor/Cursor';
import { useScrollPercentage } from 'react-scroll-percentage';

const App = observer(() => {
    const [isLoading, setIsLoading] = useState(true);
    const [scrollRef, percentage] = useScrollPercentage();

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 4000);
        init();
    }, []);

    const calculatedPercentage = Number((percentage * 100).toFixed()) + 14;

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="wrapper" ref={scrollRef}>
            <Background />
            <LoadingBar color={'#64ffda'} height={3} progress={calculatedPercentage} />
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

export default memo(App);
