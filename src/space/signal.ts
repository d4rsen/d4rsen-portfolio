import { guessObserver } from './constellations';

/** Where the message is going: Moscow (UTC+3) */
const HOME = { latitude: 55.75, longitude: 37.62 };
const EARTH_RADIUS_KM = 6371;
const LIGHT_KM_PER_S = 299_792.458;
/** Light in optical fiber travels at about 2/3 c */
const FIBER_FACTOR = 1.47;

const DEG = Math.PI / 180;

/** Great-circle distance in km (haversine) */
export const distanceKm = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
    const dLat = (b.latitude - a.latitude) * DEG;
    const dLon = (b.longitude - a.longitude) * DEG;
    const h =
        Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * DEG) * Math.cos(b.latitude * DEG) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

/**
 * How long a message from the visitor takes to reach me at light speed, from
 * their rough position (guessed from the time zone, no permission prompts)
 */
export const signalDelay = () => {
    const km = distanceKm(guessObserver(), HOME);
    const vacuumMs = (km / LIGHT_KM_PER_S) * 1000;
    return { km, vacuumMs, fiberMs: vacuumMs * FIBER_FACTOR };
};
