import React from 'react';
import reactUrl from '../../assets/svg/react.svg';
import reduxUrl from '../../assets/svg/redux.svg';
import javascriptUrl from '../../assets/svg/javascript.svg';
import mobxUrl from '../../assets/svg/mobx.svg';
import typescriptUrl from '../../assets/svg/typescript.svg';
import gitlabUrl from '../../assets/svg/gitlab.svg';
import githubUrl from '../../assets/svg/github.svg';
import styledComponentsUrl from '../../assets/images/styled-components.png';
import storybookUrl from '../../assets/images/storybook.png';
import sassUrl from '../../assets/images/sass.png';

const Background = () => {
    return (
        <>
            <div className="cube">
                <img src={reactUrl} alt="react" />
            </div>
            <div className="cube">
                <img src={reduxUrl} alt="redux" />
            </div>
            <div className="cube">
                <img src={javascriptUrl} alt="javascript" />
            </div>
            <div className="cube">
                <img src={mobxUrl} alt="mobx" />
            </div>
            <div className="cube">
                <img src={typescriptUrl} alt="typescript" />
            </div>
            <div className="cube">
                <img src={styledComponentsUrl} alt="styled-components" />
            </div>
            <div className="cube">
                <img src={gitlabUrl} alt="git" />
            </div>
            <div className="cube">
                <img src={storybookUrl} alt="storybook" />
            </div>
            <div className="cube">
                <img src={githubUrl} alt="github" />
            </div>
            <div className="cube">
                <img src={sassUrl} alt="sass" />
            </div>
        </>
    );
};

export default Background;
