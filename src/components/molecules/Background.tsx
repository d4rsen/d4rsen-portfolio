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

const ICONS = [
    { src: reactUrl, alt: 'react' },
    { src: reduxUrl, alt: 'redux' },
    { src: javascriptUrl, alt: 'javascript' },
    { src: mobxUrl, alt: 'mobx' },
    { src: typescriptUrl, alt: 'typescript' },
    { src: styledComponentsUrl, alt: 'styled-components' },
    { src: gitlabUrl, alt: 'git' },
    { src: storybookUrl, alt: 'storybook' },
    { src: githubUrl, alt: 'github' },
    { src: sassUrl, alt: 'sass' }
];

const Background = () => {
    const ref = useRef<HTMLDivElement>(null);
    useOrbits(ref);

    return (
        <div ref={ref} className="orbits" aria-hidden="true">
            {ICONS.map(({ src, alt }) => (
                <div key={alt} className="orbits__planet">
                    <img src={src} alt={alt} />
                </div>
            ))}
        </div>
    );
};

export default Background;
