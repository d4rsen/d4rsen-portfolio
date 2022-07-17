import React from 'react'
import './OneProject.scss'

function OneProject({ title, text, stackItems, imgSrc, gitLink, projectLink }) {
    return (
        <div className="projects__project project">
            <div className="project__left">
                <div className="project__uptitle">Featured Project</div>
                <div className="project__title">{title}</div>
                <div className="project__text">{text}</div>
                <div className="project__stack stack">
                    {stackItems &&
                        stackItems.map((item, i) => (
                            <div key={i} className="stack__item">
                                {item}
                            </div>
                        ))}
                </div>
                <div className="project__links links">
                    <a
                        target="_blank"
                        href={gitLink && gitLink}
                        className="links__github"
                        rel="noreferrer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-github"
                        >
                            <title>GitHub</title>
                            <path
                                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                        </svg>
                    </a>
                    <a
                        target="_blank"
                        href={projectLink && projectLink}
                        className="links__deploy"
                        rel="noreferrer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-external-link"
                        >
                            <title>External Link</title>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </a>
                </div>
            </div>
            <div className="project__right right">
                <div>
                    <div className="right__wrapper">
                        <div className="right__imageWrapper">
                            <a
                                href={projectLink}
                                target="_blank"
                                className="right__imageBlocker"
                                rel="noreferrer"
                            >
                                <img
                                    className="right__coliseum"
                                    src={imgSrc && imgSrc}
                                    alt="project"
                                />
                                <div className="right__hidden"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OneProject
