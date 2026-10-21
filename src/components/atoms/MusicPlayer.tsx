import React, { useEffect, useRef, useState } from 'react';
import musicUrl from '../../assets/music/first-step.mp3';
import playUrl from '../../assets/svg/play.svg';
import pauseUrl from '../../assets/svg/pause.svg';

const VOLUME = 0.8;

const MusicPlayer = () => {
    // 4MB track: created lazily so nothing is downloaded until the user presses play,
    // then streamed. play() must run synchronously in the click for iOS Safari.
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => () => audioRef.current?.pause(), []);

    const getAudio = () => {
        if (!audioRef.current) {
            const audio = new Audio(musicUrl);
            audio.preload = 'none';
            audio.volume = VOLUME;
            audio.addEventListener('ended', () => setIsPlaying(false));
            audioRef.current = audio;
        }
        return audioRef.current;
    };

    const playHandler = () => {
        const audio = getAudio();

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            audio.play().catch(() => setIsPlaying(false));
        }
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
