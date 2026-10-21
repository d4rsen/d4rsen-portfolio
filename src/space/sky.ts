import { TAU, random } from './math';

/**
 * Generates the night sky once into offscreen-drawn canvases: a Milky Way
 * band with nebulae, and three layers of stars at different depths. Star
 * layers tile vertically (period = viewport height) so they can scroll with
 * parallax forever without ever being redrawn.
 */

/** Star counts for a 1440×900 screen, scaled by area */
const REFERENCE_AREA = 1440 * 900;

export interface StarLayerSpec {
    count: number;
    size: [number, number];
    alpha: [number, number];
    /** Soft halo around each star */
    glow: boolean;
    /** Share of stars that get diffraction spikes (only the brightest layer) */
    spikes: number;
}

export const STAR_LAYERS: StarLayerSpec[] = [
    { count: 1100, size: [0.3, 0.7], alpha: [0.15, 0.45], glow: false, spikes: 0 },
    { count: 300, size: [0.5, 1.1], alpha: [0.35, 0.75], glow: false, spikes: 0 },
    { count: 60, size: [0.9, 1.7], alpha: [0.6, 1], glow: true, spikes: 0.12 }
];

// Real star colors by temperature, from hot blue-white to cool orange,
// weighted roughly like the visible night sky
const STAR_COLORS: [string, number][] = [
    ['207, 227, 255', 0.22],
    ['255, 255, 255', 0.38],
    ['255, 244, 224', 0.2],
    ['255, 227, 168', 0.12],
    ['255, 194, 138', 0.08]
];

const starColor = () => {
    let roll = Math.random();
    for (const [color, weight] of STAR_COLORS) {
        if ((roll -= weight) <= 0) return color;
    }
    return STAR_COLORS[0][0];
};

/** Normally distributed random number (Box–Muller) */
const gaussian = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(TAU * Math.random());

export interface TwinklingStar {
    x: number;
    y: number;
    size: number;
    color: string;
}

const createCanvas = (width: number, height: number, dpr: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { canvas, ctx };
};

const drawStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
    alpha: number,
    glow: boolean,
    spikes: boolean
) => {
    if (glow) {
        const halo = ctx.createRadialGradient(x, y, 0, x, y, size * 5);
        halo.addColorStop(0, `rgba(${color}, ${alpha * 0.35})`);
        halo.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, size * 5, 0, TAU);
        ctx.fill();
    }
    if (spikes) {
        // Four-point diffraction spikes, like on telescope photos
        const length = size * 9;
        for (const [dx, dy] of [
            [1, 0],
            [0, 1]
        ]) {
            const spike = ctx.createLinearGradient(x - dx * length, y - dy * length, x + dx * length, y + dy * length);
            spike.addColorStop(0, `rgba(${color}, 0)`);
            spike.addColorStop(0.5, `rgba(${color}, ${alpha * 0.7})`);
            spike.addColorStop(1, `rgba(${color}, 0)`);
            ctx.strokeStyle = spike;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(x - dx * length, y - dy * length);
            ctx.lineTo(x + dx * length, y + dy * length);
            ctx.stroke();
        }
    }
    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, TAU);
    ctx.fill();
};

/**
 * A layer of stars, two viewport-heights tall and periodic with a period of
 * one viewport height, so shifting it by (offset mod height) loops seamlessly
 */
export const renderStarLayer = (
    spec: StarLayerSpec,
    width: number,
    height: number,
    dpr: number,
    twinkling: TwinklingStar[] = [],
    twinklingCount = 0
) => {
    const { canvas, ctx } = createCanvas(width, height * 2, dpr);
    if (!ctx) return canvas;
    const count = Math.round((spec.count * width * height) / REFERENCE_AREA);

    for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = random(...spec.size);
        const color = starColor();

        // The brightest few twinkle; they're drawn as DOM elements instead
        if (i < twinklingCount) {
            twinkling.push({ x, y, size: size * 2.2, color });
            continue;
        }

        const alpha = random(...spec.alpha);
        const spikes = Math.random() < spec.spikes;
        // Drawn on every period so the tile wraps without a seam
        for (const dy of [-height, 0, height, height * 2]) {
            drawStar(ctx, x, y + dy, size, color, alpha, spec.glow, spikes);
        }
    }
    return canvas;
};

/** Milky Way band with dust lanes, plus a couple of faint nebulae */
export const renderGalaxy = (width: number, height: number, extra: number) => {
    const { canvas, ctx } = createCanvas(width, height + extra, 1);
    if (!ctx) return canvas;
    const area = (width * height) / REFERENCE_AREA;
    const diagonal = Math.hypot(width, height);
    const bandWidth = diagonal * 0.13;

    // The band crosses the sky diagonally, from top-left to bottom-right
    const x0 = -width * 0.1;
    const y0 = height * 0.05;
    const x1 = width * 1.1;
    const y1 = height * 0.9;
    const length = Math.hypot(x1 - x0, y1 - y0);
    const ux = (x1 - x0) / length;
    const uy = (y1 - y0) / length;
    const angle = Math.atan2(uy, ux);
    const along = (t: number, offset: number): [number, number] => [
        x0 + ux * t - uy * offset,
        y0 + uy * t + ux * offset
    ];

    // Diffuse glow of unresolved stars
    for (let i = 0; i < 140; i++) {
        const [x, y] = along(Math.random() * length, gaussian() * bandWidth * 0.35);
        const radius = bandWidth * random(0.3, 0.8);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const tint = Math.random() < 0.7 ? '150, 175, 255' : '100, 255, 218';
        glow.addColorStop(0, `rgba(${tint}, ${random(0.02, 0.045)})`);
        glow.addColorStop(1, `rgba(${tint}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TAU);
        ctx.fill();
    }

    // Dense dust of faint stars concentrated in the band
    for (let i = 0; i < 2200 * area; i++) {
        const [x, y] = along(Math.random() * length, gaussian() * bandWidth * 0.28);
        ctx.fillStyle = `rgba(${starColor()}, ${random(0.08, 0.35)})`;
        ctx.beginPath();
        ctx.arc(x, y, random(0.25, 0.6), 0, TAU);
        ctx.fill();
    }

    // Dark dust lanes block the light along the middle of the band
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 45; i++) {
        const [x, y] = along(Math.random() * length, gaussian() * bandWidth * 0.1);
        const radius = bandWidth * random(0.08, 0.2);
        const lane = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        lane.addColorStop(0, `rgba(0, 0, 0, ${random(0.25, 0.5)})`);
        lane.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + random(-0.2, 0.2));
        ctx.scale(random(2, 3.5), 1);
        ctx.fillStyle = lane;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, TAU);
        ctx.fill();
        ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';

    // Faint nebulae
    const nebulae: [number, number, number, string][] = [
        [0.78, 0.25, 0.28, '100, 255, 218'],
        [0.18, 0.8, 0.24, '155, 114, 224'],
        [0.45, 0.55, 0.18, '87, 203, 255']
    ];
    for (const [nx, ny, size, color] of nebulae) {
        const x = nx * width;
        const y = ny * height;
        const radius = size * diagonal * 0.5;
        const nebula = ctx.createRadialGradient(x, y, 0, x, y, radius);
        nebula.addColorStop(0, `rgba(${color}, 0.05)`);
        nebula.addColorStop(0.5, `rgba(${color}, 0.02)`);
        nebula.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = nebula;
        ctx.fillRect(0, 0, width, height + extra);
    }

    return canvas;
};
