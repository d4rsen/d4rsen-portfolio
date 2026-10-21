/**
 * Where the naked-eye planets and the Moon are on the sky right now, and the
 * Moon's phase. Planets use JPL's approximate Keplerian elements (good to a
 * fraction of a degree for 1800–2050), the Moon a short series of its main
 * terms (about a degree). Plenty for dots on a background.
 */

const DEG = Math.PI / 180;
/** Tilt of Earth's axis to the ecliptic */
const OBLIQUITY = 23.43928 * DEG;

/** Elements at J2000 and their change per Julian century */
interface Elements {
    a: [number, number];
    e: [number, number];
    /** Inclination */
    i: [number, number];
    /** Mean longitude */
    L: [number, number];
    /** Longitude of perihelion */
    peri: [number, number];
    /** Longitude of the ascending node */
    node: [number, number];
}

const EARTH: Elements = {
    a: [1.00000261, 0.00000562],
    e: [0.01671123, -0.00004392],
    i: [-0.00001531, -0.01294668],
    L: [100.46457166, 35999.37244981],
    peri: [102.93768193, 0.32327364],
    node: [0, 0]
};

export interface PlanetInfo {
    name: string;
    /** Rough peak brightness, for the dot size */
    mag: number;
    color: string;
    elements: Elements;
}

export const PLANETS: PlanetInfo[] = [
    {
        name: 'Mercury',
        mag: 0,
        color: '#c9c3b8',
        elements: {
            a: [0.38709927, 0.00000037],
            e: [0.20563593, 0.00001906],
            i: [7.00497902, -0.00594749],
            L: [252.2503235, 149472.67411175],
            peri: [77.45779628, 0.16047689],
            node: [48.33076593, -0.12534081]
        }
    },
    {
        name: 'Venus',
        mag: -4.2,
        color: '#fff6dc',
        elements: {
            a: [0.72333566, 0.0000039],
            e: [0.00677672, -0.00004107],
            i: [3.39467605, -0.0007889],
            L: [181.9790995, 58517.81538729],
            peri: [131.60246718, 0.00268329],
            node: [76.67984255, -0.27769418]
        }
    },
    {
        name: 'Mars',
        mag: 0.5,
        color: '#ff9a6b',
        elements: {
            a: [1.52371034, 0.00001847],
            e: [0.0933941, 0.00007882],
            i: [1.84969142, -0.00813131],
            L: [-4.55343205, 19140.30268499],
            peri: [-23.94362959, 0.44441088],
            node: [49.55953891, -0.29257343]
        }
    },
    {
        name: 'Jupiter',
        mag: -2.2,
        color: '#ffe9c4',
        elements: {
            a: [5.202887, -0.00011607],
            e: [0.04838624, -0.00013253],
            i: [1.30439695, -0.00183714],
            L: [34.39644051, 3034.74612775],
            peri: [14.72847983, 0.21252668],
            node: [100.47390909, 0.20469106]
        }
    },
    {
        name: 'Saturn',
        mag: 0.7,
        color: '#f3dca0',
        elements: {
            a: [9.53667594, -0.0012506],
            e: [0.05386179, -0.00050991],
            i: [2.48599187, 0.00193609],
            L: [49.95424423, 1222.49362201],
            peri: [92.59887831, -0.41897216],
            node: [113.66242448, -0.28867794]
        }
    }
];

type Vector = [number, number, number];

/** Days since the J2000.0 epoch */
export const daysSinceJ2000 = (date: Date) => date.getTime() / 86_400_000 + 2_440_587.5 - 2_451_545;

const normalizeDegrees = (deg: number) => ((deg % 360) + 360) % 360;

/** Heliocentric ecliptic position in AU */
const heliocentric = (el: Elements, centuries: number): Vector => {
    const at = ([value, rate]: [number, number]) => value + rate * centuries;
    const a = at(el.a);
    const e = at(el.e);
    const i = at(el.i) * DEG;
    const node = at(el.node) * DEG;
    const peri = at(el.peri) * DEG;
    const argPeri = peri - node;
    const meanAnomaly = normalizeDegrees(at(el.L) - at(el.peri)) * DEG;

    // Kepler's equation, M = E - e·sin E, by Newton's method
    let E = meanAnomaly + e * Math.sin(meanAnomaly);
    for (let n = 0; n < 6; n++) E -= (E - e * Math.sin(E) - meanAnomaly) / (1 - e * Math.cos(E));

    const px = a * (Math.cos(E) - e);
    const py = a * Math.sqrt(1 - e * e) * Math.sin(E);
    const [cw, sw, cn, sn, ci, si] = [
        Math.cos(argPeri),
        Math.sin(argPeri),
        Math.cos(node),
        Math.sin(node),
        Math.cos(i),
        Math.sin(i)
    ];
    return [
        (cw * cn - sw * sn * ci) * px + (-sw * cn - cw * sn * ci) * py,
        (cw * sn + sw * cn * ci) * px + (-sw * sn + cw * cn * ci) * py,
        sw * si * px + cw * si * py
    ];
};

/** Ecliptic vector → right ascension (hours) and declination (degrees) */
const toEquatorial = ([x, y, z]: Vector) => {
    const ye = y * Math.cos(OBLIQUITY) - z * Math.sin(OBLIQUITY);
    const ze = y * Math.sin(OBLIQUITY) + z * Math.cos(OBLIQUITY);
    return {
        ra: normalizeDegrees(Math.atan2(ye, x) / DEG) / 15,
        dec: Math.atan2(ze, Math.hypot(x, ye)) / DEG
    };
};

export const planetPosition = (planet: PlanetInfo, date: Date) => {
    const centuries = daysSinceJ2000(date) / 36_525;
    const [px, py, pz] = heliocentric(planet.elements, centuries);
    const [ex, ey, ez] = heliocentric(EARTH, centuries);
    return toEquatorial([px - ex, py - ey, pz - ez]);
};

/** The Sun's ecliptic longitude in degrees: Earth's, seen from the other side */
export const sunLongitude = (date: Date) => {
    const [x, y] = heliocentric(EARTH, daysSinceJ2000(date) / 36_525);
    return normalizeDegrees(Math.atan2(-y, -x) / DEG);
};

export const moonPosition = (date: Date) => {
    const d = daysSinceJ2000(date);
    const meanLongitude = 218.316 + 13.176396 * d;
    const meanAnomaly = (134.963 + 13.064993 * d) * DEG;
    const latitudeArgument = (93.272 + 13.22935 * d) * DEG;
    const elongation = (297.85 + 12.190749 * d) * DEG;
    const sunAnomaly = (357.529 + 0.98560028 * d) * DEG;

    // Main periodic terms: equation of center, evection, variation, annual equation
    const longitude =
        meanLongitude +
        6.289 * Math.sin(meanAnomaly) +
        1.274 * Math.sin(2 * elongation - meanAnomaly) +
        0.658 * Math.sin(2 * elongation) -
        0.186 * Math.sin(sunAnomaly);
    const latitude = 5.128 * Math.sin(latitudeArgument);

    const lon = longitude * DEG;
    const lat = latitude * DEG;
    const vector: Vector = [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
    return { ...toEquatorial(vector), longitude: normalizeDegrees(longitude), latitude };
};

/**
 * Moon phase: `illuminated` is the lit fraction of the disc (0 new, 1 full),
 * `waxing` whether it's growing
 */
export const moonPhase = (date: Date) => {
    const moon = moonPosition(date);
    const sun = sunLongitude(date);
    const angle = normalizeDegrees(moon.longitude - sun);
    const elongation = Math.acos(Math.cos(moon.latitude * DEG) * Math.cos(angle * DEG));
    return { illuminated: (1 - Math.cos(elongation)) / 2, waxing: angle < 180 };
};

/**
 * SVG path of the Moon's lit part on a disc of radius r centered at 0,0: the
 * limb on the lit side plus the terminator, an ellipse that sweeps across
 */
export const moonLitPath = (r: number, illuminated: number, waxing: boolean) => {
    const terminator = r * Math.abs(1 - 2 * illuminated);
    const crescent = illuminated < 0.5;
    // Lit limb on the right while waxing (as seen from the northern hemisphere)
    const limbSweep = waxing ? 1 : 0;
    const terminatorSweep = waxing === crescent ? 0 : 1;
    return `M 0 ${-r} A ${r} ${r} 0 0 ${limbSweep} 0 ${r} A ${terminator} ${r} 0 0 ${terminatorSweep} 0 ${-r} Z`;
};
