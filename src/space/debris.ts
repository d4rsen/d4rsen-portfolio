import { clamp01, random } from './math';

/** Anything debris can orbit: a black hole or the quasar */
export interface Host {
    x: number;
    y: number;
}

/**
 * A bit of tidally stripped matter on an orbit around a host. Orbits are
 * Keplerian (angular speed ∝ r^-1.5), so matter closer in runs ahead and
 * matter further out lags behind, which naturally stretches it into streams.
 */
export interface Debris {
    host: Host;
    r: number;
    angle: number;
    /** Orbit squash (inclination) when projected on screen */
    squash: number;
    /** Angular speed in rad/s at `refRadius` */
    omega: number;
    refRadius: number;
    /** Radial speed in px/s at `refRadius`: negative falls in, positive escapes */
    radialSpeed: number;
    /** Disappears once it falls inside this radius */
    sinkRadius: number;
    age: number;
    life: number;
    color: string;
    width: number;
    prevX: number;
    prevY: number;
}

export const projectDebris = (d: Debris): [number, number] => [
    d.host.x + Math.cos(d.angle) * d.r,
    d.host.y + Math.sin(d.angle) * d.r * d.squash
];

export const createDebris = (props: Omit<Debris, 'age' | 'prevX' | 'prevY'>): Debris => {
    const debris = { ...props, age: 0, prevX: 0, prevY: 0 };
    [debris.prevX, debris.prevY] = projectDebris(debris);
    return debris;
};

/** Returns false once the debris has fallen in or faded away */
export const updateDebris = (d: Debris, dt: number) => {
    const [x, y] = projectDebris(d);
    d.prevX = x;
    d.prevY = y;

    const closeness = d.refRadius / Math.max(d.r, 1);
    d.angle += d.omega * closeness ** 1.5 * dt;
    // Infall speeds up as it gets closer; escaping matter slows down
    d.r += d.radialSpeed * (d.radialSpeed < 0 ? closeness ** 2 : Math.sqrt(closeness)) * dt;
    d.age += dt;

    return d.r > d.sinkRadius && d.age < d.life;
};

/** Trails span this many frames of motion, so moving debris reads as streaks */
const TRAIL_FRAMES = 6;

export const drawDebris = (ctx: CanvasRenderingContext2D, debris: readonly Debris[]) => {
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const d of debris) {
        const [x, y] = projectDebris(d);
        const fadeIn = clamp01(d.age / 0.15);
        const fadeOut = 1 - clamp01((d.age - d.life * 0.6) / (d.life * 0.4));
        ctx.globalAlpha = fadeIn * fadeOut;
        ctx.strokeStyle = d.color;
        ctx.lineWidth = d.width;
        ctx.beginPath();
        ctx.moveTo(x - (x - d.prevX) * TRAIL_FRAMES, y - (y - d.prevY) * TRAIL_FRAMES);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
};

const TDE_PARTICLES = 140;
/** The stream starts out at least this many horizon radii away */
const TDE_MIN_DISTANCE = 6;
const TDE_SQUASH = 0.55;
/** Roughly half of a disrupted star stays bound and falls in, the rest is flung out */
const TDE_BOUND_FRACTION = 0.55;

/**
 * Tidal disruption event: an object that strays too close to a black hole is
 * torn into a stream of debris
 */
export const tidalDisruption = (
    host: Host & { radius: number },
    x: number,
    y: number,
    color: string,
    size: number
): Debris[] => {
    const dx = x - host.x;
    const dy = (y - host.y) / TDE_SQUASH;
    const distance = Math.max(Math.hypot(dx, dy), host.radius * TDE_MIN_DISTANCE);
    const angle = Math.atan2(dy, dx);
    const spin = Math.random() < 0.5 ? 1 : -1;
    const debris: Debris[] = [];

    for (let i = 0; i < TDE_PARTICLES; i++) {
        // Spread the object along the line towards the hole: it gets stretched radially
        const t = Math.random();
        const bound = t < TDE_BOUND_FRACTION;
        const r = distance * (0.6 + 1.4 * t) + random(-size, size) * 0.15;
        debris.push(
            createDebris({
                host,
                r,
                angle: angle + (t - 0.5) * 1.2 + random(-0.06, 0.06),
                squash: TDE_SQUASH,
                omega: spin * random(4, 6) * (bound ? 1 : 0.4),
                refRadius: host.radius * 4,
                radialSpeed: bound ? -host.radius * random(3, 6) : host.radius * random(10, 18),
                sinkRadius: bound ? host.radius * 1.05 : 0,
                life: bound ? random(3, 4.5) : random(1.5, 2.5),
                color,
                width: random(1, 2.4)
            })
        );
    }
    return debris;
};

/** Tidal stripping of a captured hole's disk by the quasar: inner and outer tails */
export const tidalTail = (
    host: Host,
    r: number,
    angle: number,
    squash: number,
    omega: number,
    refRadius: number,
    sinkRadius: number,
    stripRadius: number
): Debris[] =>
    [-1, 1].map((side) => {
        const inner = side < 0;
        return createDebris({
            host,
            r: r + side * stripRadius * random(0.6, 1.4),
            angle: angle + random(-0.03, 0.03),
            squash,
            omega,
            refRadius,
            // The inner tail spirals into the quasar's disk, the outer one drifts out
            radialSpeed: inner ? -r * random(0.08, 0.16) : r * random(0.01, 0.04),
            sinkRadius,
            life: inner ? random(2.5, 3.5) : random(1.5, 2.2),
            color: Math.random() < 0.5 ? '#e6f1ff' : '#57cbff',
            width: random(0.8, 1.8)
        });
    });

export interface DisruptionRequest {
    host: Host & { radius: number };
    x: number;
    y: number;
    color: string;
    size: number;
}

let pendingDisruptions: DisruptionRequest[] = [];

/** Called by the orbits when an icon gets swallowed; BlackHoleField turns it into debris */
export const requestDisruption = (request: DisruptionRequest) => {
    pendingDisruptions.push(request);
};

export const takeDisruptions = () => {
    const requests = pendingDisruptions;
    pendingDisruptions = [];
    return requests;
};
