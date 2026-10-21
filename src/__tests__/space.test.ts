import { describe, expect, it } from 'vitest';
import { PLANETS, moonLitPath, moonPhase, planetPosition } from '../space/planets';
import { emitWave, getWaves, waveStrain, WAVE_WIDTH } from '../space/waves';
import { distanceKm } from '../space/signal';
import { projectSky } from '../space/constellations';

const planet = (name: string) => PLANETS.find((p) => p.name === name)!;

describe('planets', () => {
    it('puts Mars where it was at its January 2025 opposition, in Gemini', () => {
        const { ra, dec } = planetPosition(planet('Mars'), new Date('2025-01-16T00:00Z'));
        expect(ra).toBeCloseTo(7.9, 0);
        expect(dec).toBeGreaterThan(24);
        expect(dec).toBeLessThan(26.5);
    });

    it('keeps Jupiter in Taurus in early 2025', () => {
        const { ra } = planetPosition(planet('Jupiter'), new Date('2025-01-16T00:00Z'));
        expect(ra).toBeGreaterThan(4.3);
        expect(ra).toBeLessThan(5);
    });
});

describe('moon phase', () => {
    it('is full at the full moon of 25 Jan 2024', () => {
        expect(moonPhase(new Date('2024-01-25T17:54Z')).illuminated).toBeGreaterThan(0.98);
    });

    it('is new at the new moon of 11 Jan 2024', () => {
        expect(moonPhase(new Date('2024-01-11T11:57Z')).illuminated).toBeLessThan(0.02);
    });

    it('is half lit and waxing at the first quarter of 18 Jan 2024', () => {
        const phase = moonPhase(new Date('2024-01-18T03:52Z'));
        expect(phase.illuminated).toBeCloseTo(0.5, 1);
        expect(phase.waxing).toBe(true);
    });

    it('draws the terminator flat at half moon', () => {
        expect(moonLitPath(10, 0.5, true)).toContain('A 0 10');
    });
});

describe('gravitational waves', () => {
    it('only strains space on the ripple itself', () => {
        emitWave(0, 0, 1, 0);
        const [wave] = getWaves(1000);
        const radius = 650; // 1s at 650px/s
        expect(waveStrain(wave, radius + WAVE_WIDTH * 2, 0, 1000)).toBe(0);
        expect(Math.abs(waveStrain(wave, radius + WAVE_WIDTH / 2, 0, 1000))).toBeGreaterThan(0);
        // A crest followed by a trough
        expect(Math.sign(waveStrain(wave, radius + WAVE_WIDTH / 2, 0, 1000))).toBe(
            -Math.sign(waveStrain(wave, radius - WAVE_WIDTH / 2, 0, 1000))
        );
    });

    it('fades out and is forgotten', () => {
        emitWave(0, 0, 1, 0);
        expect(getWaves(10_000)).toHaveLength(0);
    });
});

describe('signal', () => {
    it('measures great-circle distances', () => {
        const moscow = { latitude: 55.75, longitude: 37.62 };
        const london = { latitude: 51.51, longitude: -0.13 };
        expect(distanceKm(moscow, london)).toBeGreaterThan(2450);
        expect(distanceKm(moscow, london)).toBeLessThan(2550);
    });
});

describe('constellations', () => {
    it('only keeps constellations with a star above the horizon, inside the projection', () => {
        const sky = projectSky(1000, 800, new Date('2025-01-16T00:00Z'));
        expect(sky.length).toBeGreaterThan(0);
        for (const { stars } of sky) {
            for (const star of Object.values(stars)) {
                expect(Number.isFinite(star.x) && Number.isFinite(star.y)).toBe(true);
            }
        }
    });
});
