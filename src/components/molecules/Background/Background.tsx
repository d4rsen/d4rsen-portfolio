import React, { memo } from 'react';
import './Background.scss';

const Background = () => {
    return (
        <>
            <div className='cube'>
                <img src='assets/svg/react.svg' alt='react' />
            </div>
            <div className='cube'>
                <img src='assets/svg/redux.svg' alt='redux' />
            </div>
            <div className='cube'>
                <img src='assets/svg/javascript.svg' alt='javascript' />
            </div>
            <div className='cube'>
                <img src='assets/svg/mobx.svg' alt='mobx' />
            </div>
            <div className='cube'>
                <img src='assets/svg/typescript.svg' alt='typescript' />
            </div>
            <div className='cube'>
                <img src='assets/images/styled-components.png' alt='styled-components' />
            </div>
            <div className='cube'>
                <img src='assets/svg/gitlab.svg' alt='git' />
            </div>
            <div className='cube'>
                <img src='assets/images/storybook.png' alt='storybook' />
            </div>
            <div className='cube'>
                <img src='assets/svg/github.svg' alt='github' />
            </div>
            <div className='cube'>
                <img src='assets/images/sass.png' alt='sass' />
            </div>
        </>
    );
};

export default memo(Background);
