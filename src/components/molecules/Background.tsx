import React, { useRef } from 'react';
import reactUrl from '../../assets/svg/react.svg';
import reduxUrl from '../../assets/svg/redux.svg';
import javascriptUrl from '../../assets/svg/javascript.svg';
import mobxUrl from '../../assets/svg/mobx.svg';
import typescriptUrl from '../../assets/svg/typescript.svg';
import gitlabUrl from '../../assets/svg/gitlab.svg';
import githubUrl from '../../assets/svg/github.svg';
import styledComponentsUrl from '../../assets/images/styled-components.webp';
import storybookUrl from '../../assets/images/storybook.png';
import sassUrl from '../../assets/images/sass.webp';
import { useOrbits } from '../../hooks/useOrbits';
import { Quasar } from '../atoms/Quasar';

// color: what the icon's debris looks like when a black hole tears it apart
const ICONS = [
    { src: reactUrl, alt: 'react', color: '#61dafb' },
    { src: reduxUrl, alt: 'redux', color: '#9b72e0' },
    { src: javascriptUrl, alt: 'javascript', color: '#f7df1e' },
    { src: mobxUrl, alt: 'mobx', color: '#ff9955' },
    { src: typescriptUrl, alt: 'typescript', color: '#4a90e2' },
    { src: styledComponentsUrl, alt: 'styled-components', color: '#e07aa8' },
    { src: gitlabUrl, alt: 'git', color: '#fc6d26' },
    { src: storybookUrl, alt: 'storybook', color: '#ff4785' },
    { src: githubUrl, alt: 'github', color: '#e6f1ff' },
    { src: sassUrl, alt: 'sass', color: '#cc6699' }
];

const Background = () => {
    const ref = useRef<HTMLDivElement>(null);
    useOrbits(ref);

    return (
        <div ref={ref} className="orbits" aria-hidden="true">
            <Quasar />
            {ICONS.map(({ src, alt, color }) => (
                <div key={alt} className="orbits__planet" data-color={color}>
                    <img src={src} alt={alt} />
                </div>
            ))}
        </div>
    );
};

export default Background;
