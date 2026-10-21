/**
 * Bright stars of well-known constellations (J2000 coordinates, approximate)
 * and where they currently are above the visitor, projected like a planisphere:
 * zenith in the middle of the screen, north up, east left.
 */

interface Star {
    /** Right ascension, hours */
    ra: number;
    /** Declination, degrees */
    dec: number;
    /** Apparent magnitude: lower is brighter */
    mag: number;
}

export interface Constellation {
    name: string;
    stars: Record<string, Star>;
    lines: [string, string][];
}

export const CONSTELLATIONS: Constellation[] = [
    {
        name: 'Orion',
        stars: {
            betelgeuse: { ra: 5.919, dec: 7.41, mag: 0.5 },
            bellatrix: { ra: 5.419, dec: 6.35, mag: 1.6 },
            meissa: { ra: 5.585, dec: 9.93, mag: 3.4 },
            alnitak: { ra: 5.679, dec: -1.94, mag: 1.8 },
            alnilam: { ra: 5.603, dec: -1.2, mag: 1.7 },
            mintaka: { ra: 5.533, dec: -0.3, mag: 2.2 },
            saiph: { ra: 5.796, dec: -9.67, mag: 2.1 },
            rigel: { ra: 5.242, dec: -8.2, mag: 0.1 }
        },
        lines: [
            ['meissa', 'betelgeuse'],
            ['meissa', 'bellatrix'],
            ['betelgeuse', 'alnitak'],
            ['bellatrix', 'mintaka'],
            ['alnitak', 'alnilam'],
            ['alnilam', 'mintaka'],
            ['alnitak', 'saiph'],
            ['mintaka', 'rigel']
        ]
    },
    {
        name: 'Ursa Major',
        stars: {
            dubhe: { ra: 11.062, dec: 61.75, mag: 1.8 },
            merak: { ra: 11.031, dec: 56.38, mag: 2.4 },
            phecda: { ra: 11.897, dec: 53.69, mag: 2.4 },
            megrez: { ra: 12.257, dec: 57.03, mag: 3.3 },
            alioth: { ra: 12.9, dec: 55.96, mag: 1.8 },
            mizar: { ra: 13.399, dec: 54.93, mag: 2.2 },
            alkaid: { ra: 13.792, dec: 49.31, mag: 1.9 }
        },
        lines: [
            ['dubhe', 'merak'],
            ['merak', 'phecda'],
            ['phecda', 'megrez'],
            ['megrez', 'dubhe'],
            ['megrez', 'alioth'],
            ['alioth', 'mizar'],
            ['mizar', 'alkaid']
        ]
    },
    {
        name: 'Cassiopeia',
        stars: {
            caph: { ra: 0.153, dec: 59.15, mag: 2.3 },
            schedar: { ra: 0.675, dec: 56.54, mag: 2.2 },
            gamma: { ra: 0.945, dec: 60.72, mag: 2.2 },
            ruchbah: { ra: 1.43, dec: 60.24, mag: 2.7 },
            segin: { ra: 1.907, dec: 63.67, mag: 3.4 }
        },
        lines: [
            ['caph', 'schedar'],
            ['schedar', 'gamma'],
            ['gamma', 'ruchbah'],
            ['ruchbah', 'segin']
        ]
    },
    {
        name: 'Cygnus',
        stars: {
            deneb: { ra: 20.69, dec: 45.28, mag: 1.3 },
            sadr: { ra: 20.37, dec: 40.26, mag: 2.2 },
            albireo: { ra: 19.512, dec: 27.96, mag: 3.1 },
            gienah: { ra: 20.77, dec: 33.97, mag: 2.5 },
            delta: { ra: 19.75, dec: 45.13, mag: 2.9 }
        },
        lines: [
            ['deneb', 'sadr'],
            ['sadr', 'albireo'],
            ['gienah', 'sadr'],
            ['sadr', 'delta']
        ]
    },
    {
        name: 'Lyra',
        stars: {
            vega: { ra: 18.616, dec: 38.78, mag: 0 },
            zeta: { ra: 18.746, dec: 37.6, mag: 4.3 },
            delta: { ra: 18.908, dec: 36.9, mag: 4.3 },
            sulafat: { ra: 18.982, dec: 32.69, mag: 3.2 },
            sheliak: { ra: 18.835, dec: 33.36, mag: 3.5 }
        },
        lines: [
            ['vega', 'zeta'],
            ['zeta', 'delta'],
            ['delta', 'sulafat'],
            ['sulafat', 'sheliak'],
            ['sheliak', 'zeta']
        ]
    },
    {
        name: 'Scorpius',
        stars: {
            acrab: { ra: 16.091, dec: -19.81, mag: 2.6 },
            dschubba: { ra: 16.006, dec: -22.62, mag: 2.3 },
            pi: { ra: 15.981, dec: -26.11, mag: 2.9 },
            sigma: { ra: 16.353, dec: -25.59, mag: 2.9 },
            antares: { ra: 16.49, dec: -26.43, mag: 1 },
            tau: { ra: 16.598, dec: -28.22, mag: 2.8 },
            epsilon: { ra: 16.836, dec: -34.29, mag: 2.3 },
            mu: { ra: 16.864, dec: -38.05, mag: 3 },
            zeta: { ra: 16.909, dec: -42.36, mag: 3.6 },
            eta: { ra: 17.203, dec: -43.24, mag: 3.3 },
            sargas: { ra: 17.622, dec: -43, mag: 1.9 },
            iota: { ra: 17.793, dec: -40.13, mag: 3 },
            kappa: { ra: 17.708, dec: -39.03, mag: 2.4 },
            shaula: { ra: 17.56, dec: -37.1, mag: 1.6 }
        },
        lines: [
            ['acrab', 'dschubba'],
            ['dschubba', 'pi'],
            ['dschubba', 'sigma'],
            ['sigma', 'antares'],
            ['antares', 'tau'],
            ['tau', 'epsilon'],
            ['epsilon', 'mu'],
            ['mu', 'zeta'],
            ['zeta', 'eta'],
            ['eta', 'sargas'],
            ['sargas', 'iota'],
            ['iota', 'kappa'],
            ['kappa', 'shaula']
        ]
    },
    {
        name: 'Leo',
        stars: {
            regulus: { ra: 10.139, dec: 11.97, mag: 1.4 },
            eta: { ra: 10.122, dec: 16.76, mag: 3.5 },
            algieba: { ra: 10.333, dec: 19.84, mag: 2.1 },
            adhafera: { ra: 10.278, dec: 23.42, mag: 3.4 },
            rasalas: { ra: 9.879, dec: 26.01, mag: 3.9 },
            epsilon: { ra: 9.764, dec: 23.77, mag: 3 },
            zosma: { ra: 11.235, dec: 20.52, mag: 2.6 },
            denebola: { ra: 11.818, dec: 14.57, mag: 2.1 },
            chertan: { ra: 11.237, dec: 15.43, mag: 3.3 }
        },
        lines: [
            ['regulus', 'eta'],
            ['eta', 'algieba'],
            ['algieba', 'adhafera'],
            ['adhafera', 'rasalas'],
            ['rasalas', 'epsilon'],
            ['algieba', 'zosma'],
            ['zosma', 'denebola'],
            ['denebola', 'chertan'],
            ['chertan', 'regulus']
        ]
    },
    {
        name: 'Gemini',
        stars: {
            castor: { ra: 7.577, dec: 31.89, mag: 1.6 },
            pollux: { ra: 7.755, dec: 28.03, mag: 1.1 },
            mebsuta: { ra: 6.732, dec: 25.13, mag: 3 },
            tejat: { ra: 6.383, dec: 22.51, mag: 2.9 },
            wasat: { ra: 7.335, dec: 21.98, mag: 3.5 },
            alhena: { ra: 6.629, dec: 16.4, mag: 1.9 }
        },
        lines: [
            ['castor', 'pollux'],
            ['castor', 'mebsuta'],
            ['mebsuta', 'tejat'],
            ['pollux', 'wasat'],
            ['wasat', 'alhena']
        ]
    },
    {
        name: 'Taurus',
        stars: {
            aldebaran: { ra: 4.599, dec: 16.51, mag: 0.9 },
            theta: { ra: 4.477, dec: 15.87, mag: 3.4 },
            gamma: { ra: 4.33, dec: 15.63, mag: 3.7 },
            delta: { ra: 4.382, dec: 17.54, mag: 3.8 },
            epsilon: { ra: 4.477, dec: 19.18, mag: 3.5 },
            elnath: { ra: 5.438, dec: 28.61, mag: 1.7 },
            zeta: { ra: 5.627, dec: 21.14, mag: 3 },
            alcyone: { ra: 3.791, dec: 24.11, mag: 2.9 }
        },
        lines: [
            ['zeta', 'aldebaran'],
            ['aldebaran', 'theta'],
            ['theta', 'gamma'],
            ['gamma', 'delta'],
            ['delta', 'epsilon'],
            ['epsilon', 'elnath']
        ]
    },
    {
        name: 'Canis Major',
        stars: {
            sirius: { ra: 6.752, dec: -16.72, mag: -1.5 },
            mirzam: { ra: 6.378, dec: -17.96, mag: 2 },
            wezen: { ra: 7.14, dec: -26.39, mag: 1.8 },
            adhara: { ra: 6.977, dec: -28.97, mag: 1.5 },
            aludra: { ra: 7.401, dec: -29.3, mag: 2.4 }
        },
        lines: [
            ['mirzam', 'sirius'],
            ['sirius', 'wezen'],
            ['wezen', 'adhara'],
            ['wezen', 'aludra']
        ]
    },
    {
        name: 'Crux',
        stars: {
            acrux: { ra: 12.443, dec: -63.1, mag: 0.8 },
            mimosa: { ra: 12.795, dec: -59.69, mag: 1.3 },
            gacrux: { ra: 12.519, dec: -57.11, mag: 1.6 },
            delta: { ra: 12.252, dec: -58.75, mag: 2.8 }
        },
        lines: [
            ['acrux', 'gacrux'],
            ['mimosa', 'delta']
        ]
    }
];

const DEG = Math.PI / 180;

/**
 * Rough observer position from the time zone alone (no permission prompts,
 * no network): longitude from the UTC offset, latitude from the region
 */
export const guessObserver = () => {
    const longitude = (-new Date().getTimezoneOffset() / 60) * 15;
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    const region = zone.split('/')[0];
    const latitudes: Record<string, number> = {
        Europe: 52,
        America: 38,
        Asia: 40,
        Africa: 5,
        Australia: -33,
        Pacific: -20,
        Atlantic: 30,
        Indian: -10,
        Antarctica: -75
    };
    return { latitude: latitudes[region] ?? 45, longitude };
};

/** Local sidereal time in hours */
const siderealTime = (date: Date, longitude: number) => {
    const daysSinceJ2000 = date.getTime() / 86_400_000 + 2_440_587.5 - 2_451_545;
    const gmst = 18.697374558 + 24.06570982441908 * daysSinceJ2000;
    return (((gmst + longitude / 15) % 24) + 24) % 24;
};

export interface ProjectedStar {
    x: number;
    y: number;
    mag: number;
}

export interface ProjectedConstellation {
    name: string;
    stars: Record<string, ProjectedStar>;
    lines: [string, string][];
}

/**
 * Projector for the sky above the visitor at `date`: altitude/azimuth of a
 * point, then a stereographic projection with the zenith at the screen
 * center. Also used for the Moon and the planets.
 */
export const makeProjector = (width: number, height: number, date = new Date()) => {
    const { latitude, longitude } = guessObserver();
    const lst = siderealTime(date, longitude);
    const lat = latitude * DEG;
    // Horizon a bit beyond the corners, so the whole screen is sky
    const horizonRadius = Math.hypot(width, height) * 0.62;

    /** `ra` in hours, `dec` in degrees */
    return (ra: number, dec: number) => {
        const hourAngle = (lst - ra) * 15 * DEG;
        const d = dec * DEG;
        const altitude = Math.asin(Math.sin(d) * Math.sin(lat) + Math.cos(d) * Math.cos(lat) * Math.cos(hourAngle));
        // Azimuth from north towards east
        const azimuth = Math.atan2(
            -Math.cos(d) * Math.sin(hourAngle),
            Math.sin(d) * Math.cos(lat) - Math.cos(d) * Math.sin(lat) * Math.cos(hourAngle)
        );
        const r = horizonRadius * Math.tan((Math.PI / 2 - altitude) / 2);
        return { x: width / 2 - r * Math.sin(azimuth), y: height / 2 - r * Math.cos(azimuth), altitude };
    };
};

/** Where every constellation is right now; ones entirely below the horizon are dropped */
export const projectSky = (width: number, height: number, date = new Date()) => {
    const project = makeProjector(width, height, date);
    const result: ProjectedConstellation[] = [];
    for (const constellation of CONSTELLATIONS) {
        const stars: Record<string, ProjectedStar> = {};
        let visible = false;

        for (const [id, star] of Object.entries(constellation.stars)) {
            const { x, y, altitude } = project(star.ra, star.dec);
            if (altitude > 0) visible = true;
            stars[id] = { x, y, mag: star.mag };
        }
        if (visible) result.push({ name: constellation.name, stars, lines: constellation.lines });
    }
    return result;
};
