/**
 * The gravitational-wave "chirp" of a black hole merger, synthesized with Web
 * Audio like the famous LIGO sonification: a tone sweeping up in pitch and
 * loudness as the holes spiral together, then a short ringdown.
 */

export const CHIRP_LEAD_S = 0.8;
const RINGDOWN_S = 0.25;
const START_HZ = 35;
const PEAK_HZ = 380;
const VOLUME = 0.22;
const CURVE_POINTS = 64;

let audio: AudioContext | null = null;

/**
 * Browsers only allow sound after a user gesture: call this from the click
 * (or long press) that spawns a black hole, so its merger can be heard
 */
export const unlockSpaceSound = () => {
    if (!audio && typeof AudioContext !== 'undefined') audio = new AudioContext();
    audio?.resume().catch(() => {});
};

/** Starts the chirp; it peaks CHIRP_LEAD_S seconds from now, at the merger */
export const playChirp = () => {
    if (!audio) return;
    const now = audio.currentTime;

    // f ∝ (1 - t/T)^(-3/8): the frequency evolution of a real inspiral
    const frequency = new Float32Array(CURVE_POINTS);
    const loudness = new Float32Array(CURVE_POINTS);
    for (let i = 0; i < CURVE_POINTS; i++) {
        const left = Math.max(1 - i / (CURVE_POINTS - 1), 0.02);
        frequency[i] = Math.min(PEAK_HZ, START_HZ * left ** -0.375);
        loudness[i] = VOLUME * ((frequency[i] - START_HZ) / (PEAK_HZ - START_HZ)) ** 0.7;
    }

    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueCurveAtTime(frequency, now, CHIRP_LEAD_S);
    gain.gain.setValueCurveAtTime(loudness, now, CHIRP_LEAD_S);
    // Ringdown: the merged hole settles, pitch holds while it fades away
    gain.gain.setTargetAtTime(0, now + CHIRP_LEAD_S, RINGDOWN_S / 3);

    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + CHIRP_LEAD_S + RINGDOWN_S * 2);
};
