import React, { useState } from 'react';
// @ts-ignore
import useSound from 'use-sound';
import musicUrl from '../../assets/music/first-step.mp3';
import playUrl from '../../assets/svg/play.svg';
import pauseUrl from '../../assets/svg/pause.svg';

const MusicPlayer = () => {
    const [play, { pause }] = useSound(musicUrl, {
        volume: 0.8
    });
    const [isPlaying, setIsPlaying] = useState(false);

    const playHandler = () => {
        isPlaying ? pause() : play();
        setIsPlaying((prev) => !prev);
    };

    return (
        <div className="playerWrapper playerfade">
            <div className="playerWrapper__list">
                <div className="player">
                    <div id="control-panel" className={`control-panel ${isPlaying && 'active2'}`}>
                        <img
                            data-hover
                            id="play"
                            className="play"
                            onClick={playHandler}
                            src={isPlaying ? pauseUrl : playUrl}
                            alt="play-pause"
                        />
                    </div>
                </div>
                <a
                    data-hover
                    className="playerWrapper__musicLink"
                    target="_blank"
                    href="https://music.youtube.com/watch?v=55TYgbk4kZs"
                    rel="noreferrer"
                >
                    Hans Zimmer {'>'} FIRST STEP
                </a>
            </div>
        </div>
    );
};

export default MusicPlayer;
