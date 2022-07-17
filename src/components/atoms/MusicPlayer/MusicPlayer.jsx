import React, { memo, useState } from 'react'
import useSound from 'use-sound'
import './MusicPlayer.scss'

const MusicPlayer = () => {
    const [play, { pause }] = useSound('assets/music/sublab.mp3', {
        volume: 0.5
    })
    const [isPlaying, setIsplaying] = useState(false)

    const playHandler = () => {
        isPlaying ? pause() : play()
        setIsplaying(prev => !prev)
    }

    return (
        <div className="player fade5">
            <div id="control-panel" className={`control-panel ${isPlaying && 'active2'}`}>
                <img
                    id="play"
                    className="play"
                    onClick={playHandler}
                    src={`assets/svg/${isPlaying ? 'pause.svg' : 'play.svg'}`}
                    alt="play-pause"
                />
            </div>
        </div>
    )
}

export default memo(MusicPlayer)
