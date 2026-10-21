import { TAU, clamp01, random } from './math';

/** Accretion disk seen almost edge-on, like Gargantua in Interstellar */
export const DISK_SQUASH = 0.24;
export const DISK_INNER = 1.5;
export const DISK_OUTER = 3.8;

// Hot inner disk is white-blue, cooling to the theme green on the outside
const diskColor = (rel: number) => {
    const t = clamp01((rel - DISK_INNER) / (DISK_OUTER - DISK_INNER));
    if (t < 0.25) return '#e6f1ff';
    if (t < 0.6) return '#57cbff';
    return '#64ffda';
};

interface DiskParticle {
    rel: number;
    angle: number;
    speed: number;
    width: number;
    color: string;
}

interface HoleRendererOptions {
    particles: number;
    tilt: number;
    spin: 1 | -1;
    /** Multiplier for how fast the disk spins */
    speed?: number;
}

/**
 * Draws a black hole: glow, edge-on accretion disk, lensed photon ring and
 * the event horizon of the small click-spawned black holes.
 *
 * Drawing is split in two passes so other things (dust, orbiting holes) can be
 * layered between the far side of the disk and the near side.
 */
export class HoleRenderer {
    readonly tilt: number;
    readonly spin: 1 | -1;
    private readonly disk: DiskParticle[] = [];

    constructor({ particles, tilt, spin, speed = 1 }: HoleRendererOptions) {
        this.tilt = tilt;
        this.spin = spin;

        for (let i = 0; i < particles; i++) {
            // Bias towards the inner edge, where the disk is densest
            const rel = DISK_INNER + (DISK_OUTER - DISK_INNER) * Math.random() ** 1.6;
            this.disk.push({
                rel,
                angle: random(0, TAU),
                // Keplerian: inner matter orbits much faster
                speed: ((4.5 * speed) / rel ** 1.5) * random(0.85, 1.15),
                width: random(0.8, 2),
                color: diskColor(rel)
            });
        }
    }

    /** `drift` > 0 makes the disk lose its anchor and spread out (evaporation) */
    update(dt: number, drift = 0, speedBoost = 1) {
        for (const p of this.disk) {
            p.angle += p.speed * speedBoost * this.spin * dt;
            if (drift > 0) p.rel += dt * 2.5 * drift;
        }
    }

    /** Polar coords in the disk plane -> screen coords */
    project(cx: number, cy: number, r: number, angle: number, squash = DISK_SQUASH): [number, number] {
        const dx = Math.cos(angle) * r;
        const dy = Math.sin(angle) * r * squash;
        const cos = Math.cos(this.tilt);
        const sin = Math.sin(this.tilt);
        return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];
    }

    /** `diskFade` lets the disk fade separately, e.g. while it's being tidally stripped */
    drawBack(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        R: number,
        fade: number,
        glow = true,
        diskFade = fade
    ) {
        if (R <= 0) return;
        ctx.globalCompositeOperation = 'lighter';
        if (glow) this.drawGlow(ctx, x, y, R, fade);
        this.drawDisk(ctx, x, y, R, diskFade, true);
        drawPhotonRing(ctx, x, y, R, fade);
    }

    drawFront(ctx: CanvasRenderingContext2D, x: number, y: number, R: number, diskFade: number) {
        if (R <= 0) return;
        drawHorizon(ctx, x, y, R);

        ctx.globalCompositeOperation = 'lighter';
        this.drawDisk(ctx, x, y, R, diskFade, false);
    }

    private drawGlow(ctx: CanvasRenderingContext2D, x: number, y: number, R: number, fade: number) {
        const glow = ctx.createRadialGradient(x, y, R, x, y, R * 7);
        glow.addColorStop(0, 'rgba(100, 255, 218, 0.18)');
        glow.addColorStop(1, 'rgba(100, 255, 218, 0)');
        ctx.globalAlpha = fade;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, R * 7, 0, TAU);
        ctx.fill();
    }

    private drawDisk(ctx: CanvasRenderingContext2D, x: number, y: number, R: number, fade: number, farSide: boolean) {
        this.drawDiskBand(ctx, x, y, R, fade, farSide);

        ctx.lineCap = 'round';
        for (const p of this.disk) {
            const isFar = Math.sin(p.angle) < 0;
            if (isFar !== farSide) continue;

            const r = p.rel * R;
            const trail = p.speed * this.spin * 0.1;
            const [x1, y1] = this.project(x, y, r, p.angle - trail);
            const [x2, y2] = this.project(x, y, r, p.angle);
            // Doppler beaming: the side moving towards us is much brighter
            const doppler = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(p.angle) * this.spin);

            ctx.globalAlpha = fade * doppler;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.width;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    /** Continuous glowing gas underneath the individual streaks */
    private drawDiskBand(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        R: number,
        fade: number,
        farSide: boolean
    ) {
        const inner = R * DISK_INNER * 0.9;
        const outer = R * DISK_OUTER;
        const [from, to] = farSide ? [Math.PI, TAU] : [0, Math.PI];

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.tilt);
        ctx.scale(1, DISK_SQUASH);

        const band = ctx.createRadialGradient(0, 0, inner, 0, 0, outer);
        band.addColorStop(0, 'rgba(230, 241, 255, 0.6)');
        band.addColorStop(0.2, 'rgba(87, 203, 255, 0.35)');
        band.addColorStop(1, 'rgba(100, 255, 218, 0)');
        ctx.globalAlpha = fade;
        ctx.fillStyle = band;
        ctx.beginPath();
        ctx.arc(0, 0, outer, from, to);
        ctx.arc(0, 0, inner, to, from, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

/** Light from the far side of the disk bent around the hole, plus the photon ring */
export const drawPhotonRing = (ctx: CanvasRenderingContext2D, x: number, y: number, R: number, fade: number) => {
    const ring = ctx.createRadialGradient(x, y, R, x, y, R * 2);
    ring.addColorStop(0, 'rgba(230, 241, 255, 0)');
    ring.addColorStop(0.06, 'rgba(230, 241, 255, 0.95)');
    ring.addColorStop(0.25, 'rgba(87, 203, 255, 0.45)');
    ring.addColorStop(0.6, 'rgba(100, 255, 218, 0.12)');
    ring.addColorStop(1, 'rgba(100, 255, 218, 0)');
    ctx.globalAlpha = fade;
    ctx.fillStyle = ring;
    ctx.beginPath();
    ctx.arc(x, y, R * 2, 0, TAU);
    ctx.fill();
};

/** The event horizon itself: nothing escapes, so it's pure black */
export const drawHorizon = (ctx: CanvasRenderingContext2D, x: number, y: number, R: number) => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, R, 0, TAU);
    ctx.fill();
};
