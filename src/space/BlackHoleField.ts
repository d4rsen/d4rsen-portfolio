import { GravityWell, addWell } from './gravity';

const MAX_HOLES = 4;

const BIRTH_MS = 600;
const LIFE_MS = 3800;
const DEATH_MS = 900;
const SHOCKWAVE_MS = 800;

const MIN_RADIUS = 12;
const MAX_RADIUS = 26;
/** How much the horizon grows over its life from everything it eats */
const GROWTH = 0.25;

/** Accretion disk seen almost edge-on, like Gargantua in Interstellar */
const DISK_SQUASH = 0.24;
const DISK_PARTICLES = 170;
const DISK_INNER = 1.5;
const DISK_OUTER = 3.8;

const DUST_AT_BIRTH = 50;
const DUST_PER_SECOND = 22;
const DUST_MIN_DISTANCE = 4;
const DUST_MAX_DISTANCE = 11;

const TAU = Math.PI * 2;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
const easeOutBack = (t: number) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;
const easeInCubic = (t: number) => t ** 3;
const random = (min: number, max: number) => min + Math.random() * (max - min);

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

interface Dust {
    r: number;
    angle: number;
    prevX: number;
    prevY: number;
}

class BlackHole implements GravityWell {
    x: number;
    y: number;
    radius = 0;
    age = 0;
    dying = false;
    deathAge = 0;

    readonly baseRadius = random(MIN_RADIUS, MAX_RADIUS);
    readonly tilt = random(-0.35, 0.35);
    readonly spin = Math.random() < 0.5 ? 1 : -1;
    readonly disk: DiskParticle[] = [];
    readonly dust: Dust[] = [];
    readonly unregister: () => void;
    dustDebt = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        for (let i = 0; i < DISK_PARTICLES; i++) {
            // Bias towards the inner edge, where the disk is densest
            const rel = DISK_INNER + (DISK_OUTER - DISK_INNER) * Math.random() ** 1.6;
            this.disk.push({
                rel,
                angle: random(0, TAU),
                // Keplerian: inner matter orbits much faster
                speed: (4.5 / rel ** 1.5) * random(0.85, 1.15),
                width: random(0.8, 2),
                color: diskColor(rel)
            });
        }

        for (let i = 0; i < DUST_AT_BIRTH; i++) this.spawnDust();
        this.unregister = addWell(this);
    }

    get finished() {
        return this.dying && this.deathAge >= DEATH_MS;
    }

    die() {
        this.dying = true;
    }

    spawnDust() {
        const r = this.baseRadius * random(DUST_MIN_DISTANCE, DUST_MAX_DISTANCE);
        const angle = random(0, TAU);
        const [x, y] = this.project(r, angle);
        this.dust.push({ r, angle, prevX: x, prevY: y });
    }

    /** Polar coords in the disk plane -> screen coords */
    project(r: number, angle: number, squash = DISK_SQUASH): [number, number] {
        const dx = Math.cos(angle) * r;
        const dy = Math.sin(angle) * r * squash;
        const cos = Math.cos(this.tilt);
        const sin = Math.sin(this.tilt);
        return [this.x + dx * cos - dy * sin, this.y + dx * sin + dy * cos];
    }

    update(dt: number) {
        const ms = dt * 1000;
        this.age += ms;
        if (this.age > BIRTH_MS + LIFE_MS) this.dying = true;
        if (this.dying) this.deathAge += ms;

        const grown = this.baseRadius * (1 + GROWTH * clamp01((this.age - BIRTH_MS) / LIFE_MS));
        if (this.age < BIRTH_MS) {
            this.radius = this.baseRadius * Math.max(0, easeOutBack(this.age / BIRTH_MS));
        } else if (this.dying) {
            this.radius = grown * (1 - easeInCubic(clamp01(this.deathAge / DEATH_MS)));
        } else {
            this.radius = grown;
        }

        const evaporation = this.dying ? clamp01(this.deathAge / DEATH_MS) : 0;
        for (const p of this.disk) {
            p.angle += p.speed * this.spin * dt;
            // While evaporating, the disk loses its anchor and drifts apart
            if (evaporation > 0) p.rel += dt * 2.5 * evaporation;
        }

        if (!this.dying) {
            this.dustDebt += DUST_PER_SECOND * dt;
            for (; this.dustDebt >= 1; this.dustDebt--) this.spawnDust();
        }

        const R = Math.max(this.radius, 1);
        for (let i = this.dust.length - 1; i >= 0; i--) {
            const d = this.dust[i];
            const [x, y] = this.project(d.r, d.angle, this.dustSquash(d.r));
            d.prevX = x;
            d.prevY = y;

            const closeness = this.baseRadius / d.r;
            d.r -= this.baseRadius * (0.8 + 16 * closeness ** 2) * dt;
            d.angle += 6 * closeness ** 1.5 * this.spin * dt;

            if (d.r <= R * 1.05) this.dust.splice(i, 1);
        }
    }

    /** Dust falls in from all directions and flattens into the disk plane as it nears */
    dustSquash(r: number) {
        return lerp(DISK_SQUASH, 1, clamp01((r / this.baseRadius - DISK_INNER) / 5));
    }

    draw(ctx: CanvasRenderingContext2D) {
        const R = this.radius;
        const fade = this.dying ? 1 - clamp01(this.deathAge / DEATH_MS) : clamp01(this.age / BIRTH_MS);

        ctx.globalCompositeOperation = 'lighter';
        this.drawGlow(ctx, R, fade);
        this.drawDust(ctx, this.dying ? fade : 1);
        this.drawDisk(ctx, R, fade, true);
        this.drawLensedRing(ctx, R, fade);

        ctx.globalCompositeOperation = 'source-over';
        this.drawHorizon(ctx, R);

        ctx.globalCompositeOperation = 'lighter';
        this.drawDisk(ctx, R, fade, false);
        this.drawShockwave(ctx);
        this.drawEvaporationFlash(ctx);
        ctx.globalAlpha = 1;
    }

    drawGlow(ctx: CanvasRenderingContext2D, R: number, fade: number) {
        if (R <= 0) return;
        const glow = ctx.createRadialGradient(this.x, this.y, R, this.x, this.y, R * 7);
        glow.addColorStop(0, 'rgba(100, 255, 218, 0.18)');
        glow.addColorStop(1, 'rgba(100, 255, 218, 0)');
        ctx.globalAlpha = fade;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, R * 7, 0, TAU);
        ctx.fill();
    }

    drawDust(ctx: CanvasRenderingContext2D, fade: number) {
        ctx.lineCap = 'round';
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#e6f1ff';
        for (const d of this.dust) {
            const [x, y] = this.project(d.r, d.angle, this.dustSquash(d.r));
            // Gets brighter as it heats up on the way in; motion stretches it
            // into a streak right before the horizon (spaghettification)
            ctx.globalAlpha = fade * (0.2 + 0.8 * clamp01(1 - (d.r - this.baseRadius) / (this.baseRadius * 8)));
            ctx.beginPath();
            ctx.moveTo(d.prevX, d.prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    /** The disk is split in two passes: the far half behind the horizon, the near half in front of it */
    drawDisk(ctx: CanvasRenderingContext2D, R: number, fade: number, farSide: boolean) {
        if (R <= 0) return;
        this.drawDiskBand(ctx, R, fade, farSide);

        ctx.lineCap = 'round';
        for (const p of this.disk) {
            const isFar = Math.sin(p.angle) < 0;
            if (isFar !== farSide) continue;

            const r = p.rel * R;
            const trail = p.speed * this.spin * 0.1;
            const [x1, y1] = this.project(r, p.angle - trail);
            const [x2, y2] = this.project(r, p.angle);
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
    drawDiskBand(ctx: CanvasRenderingContext2D, R: number, fade: number, farSide: boolean) {
        const inner = R * DISK_INNER * 0.9;
        const outer = R * DISK_OUTER;
        const [from, to] = farSide ? [Math.PI, TAU] : [0, Math.PI];

        ctx.save();
        ctx.translate(this.x, this.y);
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

    /** Light from the far side of the disk bent around the hole, plus the photon ring */
    drawLensedRing(ctx: CanvasRenderingContext2D, R: number, fade: number) {
        if (R <= 0) return;
        const ring = ctx.createRadialGradient(this.x, this.y, R, this.x, this.y, R * 2);
        ring.addColorStop(0, 'rgba(230, 241, 255, 0)');
        ring.addColorStop(0.06, 'rgba(230, 241, 255, 0.95)');
        ring.addColorStop(0.25, 'rgba(87, 203, 255, 0.45)');
        ring.addColorStop(0.6, 'rgba(100, 255, 218, 0.12)');
        ring.addColorStop(1, 'rgba(100, 255, 218, 0)');
        ctx.globalAlpha = fade;
        ctx.fillStyle = ring;
        ctx.beginPath();
        ctx.arc(this.x, this.y, R * 2, 0, TAU);
        ctx.fill();
    }

    drawHorizon(ctx: CanvasRenderingContext2D, R: number) {
        if (R <= 0) return;
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, R, 0, TAU);
        ctx.fill();
    }

    drawShockwave(ctx: CanvasRenderingContext2D) {
        if (this.age > SHOCKWAVE_MS) return;
        const t = this.age / SHOCKWAVE_MS;
        ctx.globalAlpha = (1 - t) ** 2 * 0.7;
        ctx.strokeStyle = '#64ffda';
        ctx.lineWidth = 2 * (1 - t) + 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.baseRadius * (1 + 9 * Math.sqrt(t)), 0, TAU);
        ctx.stroke();
    }

    /** Final burst of Hawking radiation as the hole evaporates */
    drawEvaporationFlash(ctx: CanvasRenderingContext2D) {
        if (!this.dying) return;
        const t = clamp01((this.deathAge / DEATH_MS - 0.6) / 0.4);
        if (t <= 0) return;
        const r = this.baseRadius * (0.5 + 3.5 * t);
        const flash = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
        flash.addColorStop(0, 'rgba(230, 241, 255, 1)');
        flash.addColorStop(0.4, 'rgba(100, 255, 218, 0.5)');
        flash.addColorStop(1, 'rgba(100, 255, 218, 0)');
        ctx.globalAlpha = Math.sin(t * Math.PI);
        ctx.fillStyle = flash;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, TAU);
        ctx.fill();
    }
}

/**
 * Full-screen canvas of black holes. The render loop only runs while at
 * least one hole exists, so an idle page costs nothing.
 */
export class BlackHoleField {
    private readonly ctx: CanvasRenderingContext2D | null;
    private holes: BlackHole[] = [];
    private rafId = 0;
    private lastTime = 0;

    constructor(private readonly canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    spawn(x: number, y: number) {
        if (!this.ctx) return;
        const alive = this.holes.filter((hole) => !hole.dying);
        if (alive.length >= MAX_HOLES) alive[0].die();

        this.holes.push(new BlackHole(x, y));
        if (!this.rafId) {
            this.lastTime = performance.now();
            this.rafId = requestAnimationFrame(this.frame);
        }
    }

    destroy() {
        cancelAnimationFrame(this.rafId);
        window.removeEventListener('resize', this.resize);
        this.holes.forEach((hole) => hole.unregister());
        this.holes = [];
    }

    private resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    private frame = (now: number) => {
        const ctx = this.ctx!;
        // Clamp so a backgrounded tab doesn't make everything jump on return
        const dt = Math.min((now - this.lastTime) / 1000, 0.05);
        this.lastTime = now;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (const hole of this.holes) {
            hole.update(dt);
            if (hole.finished) hole.unregister();
            else hole.draw(ctx);
        }
        this.holes = this.holes.filter((hole) => !hole.finished);

        this.rafId = this.holes.length ? requestAnimationFrame(this.frame) : 0;
        if (!this.rafId) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
}
