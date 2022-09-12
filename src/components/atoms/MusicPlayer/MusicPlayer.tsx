import React, { memo, useState } from 'react';
import useSound from 'use-sound';
import './MusicPlayer.scss';

const MusicPlayer = () => {
    const [play, { pause }] = useSound('assets/music/sublab.mp3', {
        volume: 0.8
    });
    const [isPlaying, setIsPlaying] = useState(false);

    const playHandler = () => {
        isPlaying ? pause() : play();
        setIsPlaying((prev) => !prev);
    };

    return (
        <div className='playerWrapper playerfade'>
            <div className='playerWrapper__list'>
                <div className='player'>
                    <div id='control-panel' className={`control-panel ${isPlaying && 'active2'}`}>
                        <img
                            id='play'
                            className='play'
                            onClick={playHandler}
                            src={`assets/svg/${isPlaying ? 'pause.svg' : 'play.svg'}`}
                            alt='play-pause'
                        />
                    </div>
                </div>
                <a
                    className='playerWrapper__musicLink'
                    target='_blank'
                    href='https://music.youtube.com/watch?v=0Mi-PG3uR1Q&list=RDAMVM0Mi-PG3uR1Q'
                    rel='noreferrer'
                >
                    Cowbell City {'>'} ROMANE
                </a>
            </div>
        </div>
    );
};

export default memo(MusicPlayer);
