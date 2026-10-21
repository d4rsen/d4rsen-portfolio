import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MusicPlayer from '../components/atoms/MusicPlayer';

describe('MusicPlayer', () => {
    afterEach(() => vi.restoreAllMocks());

    it('plays and pauses the track on click', async () => {
        const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
        const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});

        const { unmount } = render(<MusicPlayer />);
        const button = screen.getByAltText('play-pause');

        fireEvent.click(button);
        expect(play).toHaveBeenCalledTimes(1);

        fireEvent.click(button);
        expect(pause).toHaveBeenCalledTimes(1);

        unmount();
    });
});
