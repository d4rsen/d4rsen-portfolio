/**
 * Gravitational waves: ripples in spacetime expanding from merging black
 * holes. Drawn by BlackHoleField; the orbiting icons get stretched and
 * squeezed as a ripple passes through them.
 */
export interface Wave {
    x: number;
    y: number;
    born: number;
    /** 0..1 */
    amplitude: number;
}

const SPEED = 650; // px/s
const WIDTH = 90; // px, thickness of one ripple
const LIFE_MS = 2800;

let waves: Wave[] = [];

export const emitWave = (x: number, y: number, amplitude: number, born = performance.now()) => {
    waves.push({ x, y, born, amplitude });
};

export const getWaves = (now: number): readonly Wave[] => {
    waves = waves.filter((wave) => now - wave.born < LIFE_MS);
    return waves;
};

export const waveRadius = (wave: Wave, now: number) => ((now - wave.born) / 1000) * SPEED;

export const waveDecay = (wave: Wave, now: number) => Math.max(0, 1 - (now - wave.born) / LIFE_MS);

/** Signed strain (-1..1) of a wave at a point: one crest followed by one trough */
export const waveStrain = (wave: Wave, x: number, y: number, now: number) => {
    const offset = Math.hypot(x - wave.x, y - wave.y) - waveRadius(wave, now);
    if (Math.abs(offset) > WIDTH) return 0;
    const envelope = 1 - Math.abs(offset) / WIDTH;
    return wave.amplitude * waveDecay(wave, now) * envelope * Math.sin((offset / WIDTH) * Math.PI);
};

export const WAVE_WIDTH = WIDTH;
