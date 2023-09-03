import React from 'react';
import About from '../../organisms/About';
import Contact from '../../organisms/Contact';
import Hello from '../../organisms/Hello';
import Jobs from '../../organisms/Jobs';

function MainPage() {
    return (
        <div className="mainPage">
            <div className="mainPage-container ">
                <Hello />
                <About />
                <Jobs />
                {/*<Projects />*/}
                <Contact />
            </div>
        </div>
    );
}

export default MainPage;
