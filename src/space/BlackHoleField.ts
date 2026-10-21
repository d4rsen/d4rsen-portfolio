import { GravityWell, addWell } from './gravity';
import { DISK_INNER, DISK_SQUASH, HoleRenderer } from './HoleRenderer';
import { TAU, clamp01, easeInCubic, easeOutBack, lerp, random } from './math';
import { feedQuasar, quasar } from './quasar';
import { Debris, drawDebris, takeDisruptions, tidalDisruption, tidalTail, updateDebris } from './debris';
import { WAVE_WIDTH, emitWave, getWaves, waveDecay, waveRadius } from './waves';
import { CHIRP_LEAD_S, playChirp } from './sound';
import { skyLayers } from './sky';

const MAX_HOLES = 4;

const BIRTH_MS = 600;
const LIFE_MS = 3800;
const DEATH_MS = 900;
const SHOCKWAVE_MS = 800;

// Stellar-mass holes: tiny next to the supermassive quasar
const MIN_RADIUS = 6;
const MAX_RADIUS = 10;
/** How much the horizon grows over its life from everything it eats */
const GROWTH = 0.25;
const DISK_PARTICLES = 170;

const DUST_AT_BIRTH = 50;
const DUST_PER_SECOND = 22;
const DUST_MIN_DISTANCE = 6;
const DUST_MAX_DISTANCE = 20;

/** Holes spawned within this many quasar radii get captured by it */
const CAPTURE_RANGE = 10;
/** Time from capture to merger */
const INSPIRAL_S = 7;
/**
 * Separation shrinks as a = a0 * (1 - t/T)^DECAY. Real GW inspirals use 1/4,
 * which keeps the orbit almost constant and then plunges in a blink; a bit
 * higher reads better on screen while keeping the accelerating "chirp".
 */
const INSPIRAL_DECAY = 0.4;
/** Angular speed at capture, rad/s (~5 orbits in total) */
const INSPIRAL_SPEED = 1.8;
const MAX_ORBIT_SPEED = 30;
/** The inspiral orbit is inclined, so it looks like an ellipse */
const ORBIT_SQUASH = 0.5;
/** Ringdown after the merger: [delay ms, amplitude] */
const RINGDOWN: [number, number][] = [
    [0, 1],
    [160, 0.55],
    [320, 0.3]
];
const MERGER_FLASH_MS = 900;
/**
 * Gravitational lensing of the starry background: within LENS_OUTER horizon
 * radii the sky is magnified and pushed outwards, much more strongly close to
 * the hole (inside LENS_INNER), where stars smear into arcs
 */
const LENS_OUTER = 12;
const LENS_INNER = 4.5;
const LENS_ZOOM_OUTER = 1.6;
const LENS_ZOOM_INNER = 2.8;
/**
 * The page background is a radial gradient (lighter towards the bottom
 * center, see #c); the lensed image is painted over the matching color so
 * the original stars don't show through and no disc edge is visible
 */
const SKY_DARK = [10, 25, 47];
const SKY_LIGHT = [17, 34, 64];
const skyColorAt = (x: number, y: number) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const t = clamp01(1 - Math.hypot((x - w / 2) / (w * 0.7), (y - h) / h));
    const [r, g, b] = SKY_DARK.map((dark, i) => Math.round(dark + (SKY_LIGHT[i] - dark) * t));
    return `rgb(${r}, ${g}, ${b})`;
};
/** Tidal tails: debris pairs per second once the quasar strips the disk completely */
const STRIP_RATE = 110;

interface Dust {
    r: number;
    angle: number;
    prevX: number;
    prevY: number;
}

interface Inspiral {
    a0: number;
    a: number;
    angle: number;
    time: number;
    /** Gravitational waves go out twice per orbit */
    halfOrbits: number;
    chirped: boolean;
}

class BlackHole implements GravityWell {
    x: number;
    y: number;
    radius = 0;
    age = 0;
    dying = false;
    deathAge = 0;
    merged = false;

    readonly baseRadius = random(MIN_RADIUS, MAX_RADIUS);
    readonly renderer = new HoleRenderer({
        particles: DISK_PARTICLES,
        tilt: random(-0.35, 0.35),
        spin: Math.random() < 0.5 ? 1 : -1
    });
    readonly dust: Dust[] = [];
    readonly unregister: () => void;
    dustDebt = 0;
    stripDebt = 0;
    /** 0..1, how much of its disk the quasar has torn off */
    stripped = 0;
    inspiral: Inspiral | null = null;

    constructor(x: number, y: number, captured: boolean) {
        this.x = x;
        this.y = y;

        if (captured) {
            const dx = x - quasar.x;
            const dy = (y - quasar.y) / ORBIT_SQUASH;
            const a0 = Math.max(Math.hypot(dx, dy), quasar.radius * 3);
            const angle = Math.atan2(dy, dx);
            this.inspiral = { a0, a: a0, angle, time: 0, halfOrbits: Math.floor(angle / Math.PI), chirped: false };
        }

        for (let i = 0; i < DUST_AT_BIRTH; i++) this.spawnDust();
        this.unregister = addWell(this);
    }

    get finished() {
        return this.merged || (this.dying && this.deathAge >= DEATH_MS);
    }

    die() {
        this.dying = true;
    }

    spawnDust() {
        const r = this.baseRadius * random(DUST_MIN_DISTANCE, DUST_MAX_DISTANCE);
        const angle = random(0, TAU);
        const [x, y] = this.renderer.project(this.x, this.y, r, angle);
        this.dust.push({ r, angle, prevX: x, prevY: y });
    }

    /** Dust falls in from all directions and flattens into the disk plane as it nears */
    dustSquash(r: number) {
        return lerp(DISK_SQUASH, 1, clamp01((r / this.baseRadius - DISK_INNER) / 5));
    }

    /** Returns true when the hole has just merged into the quasar */
    update(dt: number, now: number, debris: Debris[]): boolean {
        const ms = dt * 1000;
        this.age += ms;
        // Captured holes don't evaporate: they end by merging
        if (!this.inspiral && this.age > BIRTH_MS + LIFE_MS) this.dying = true;
        if (this.dying) this.deathAge += ms;

        const grown = this.baseRadius * (1 + GROWTH * clamp01((this.age - BIRTH_MS) / LIFE_MS));
        if (this.age < BIRTH_MS) {
            this.radius = this.baseRadius * Math.max(0, easeOutBack(this.age / BIRTH_MS));
        } else if (this.dying) {
            this.radius = grown * (1 - easeInCubic(clamp01(this.deathAge / DEATH_MS)));
        } else {
            this.radius = grown;
        }

        const merged = this.inspiral ? this.updateInspiral(this.inspiral, dt, now, debris) : false;

        this.renderer.update(dt, this.dying ? clamp01(this.deathAge / DEATH_MS) : 0);

        // Once captured, the quasar strips away anything that would feed it
        if (!this.dying && !this.inspiral) {
            this.dustDebt += DUST_PER_SECOND * dt;
            for (; this.dustDebt >= 1; this.dustDebt--) this.spawnDust();
        }

        const R = Math.max(this.radius, 1);
        for (let i = this.dust.length - 1; i >= 0; i--) {
            const d = this.dust[i];
            const [x, y] = this.renderer.project(this.x, this.y, d.r, d.angle, this.dustSquash(d.r));
            d.prevX = x;
            d.prevY = y;

            const closeness = this.baseRadius / d.r;
            d.r -= this.baseRadius * (0.8 + 16 * closeness ** 2) * dt;
            d.angle += 6 * closeness ** 1.5 * this.renderer.spin * dt;

            if (d.r <= R * 1.05) this.dust.splice(i, 1);
        }

        return merged;
    }

    /**
     * Gravitational-wave driven inspiral: slow at first, then faster and
     * faster. Orbital speed follows Kepler, giving the characteristic "chirp".
     */
    private updateInspiral(orbit: Inspiral, dt: number, now: number, debris: Debris[]) {
        orbit.time += dt;
        const left = Math.max(0, 1 - orbit.time / INSPIRAL_S);
        orbit.a = orbit.a0 * left ** INSPIRAL_DECAY;

        // Start the sound so its peak lands on the merger
        if (!orbit.chirped && INSPIRAL_S - orbit.time <= CHIRP_LEAD_S) {
            orbit.chirped = true;
            playChirp();
        }

        const speed = Math.min(MAX_ORBIT_SPEED, INSPIRAL_SPEED * (orbit.a0 / Math.max(orbit.a, 1)) ** 1.5);
        orbit.angle += speed * quasar.spin * dt;
        this.x = quasar.x + Math.cos(orbit.angle) * orbit.a;
        this.y = quasar.y + Math.sin(orbit.angle) * orbit.a * ORBIT_SQUASH;

        // The quasar's tides tear the small hole's disk into two tails: matter
        // on the inside runs ahead, matter on the outside falls behind
        this.stripped = clamp01((orbit.time / INSPIRAL_S - 0.1) / 0.6);
        this.stripDebt += STRIP_RATE * this.stripped * dt;
        for (; this.stripDebt >= 1; this.stripDebt--) {
            debris.push(
                ...tidalTail(
                    quasar,
                    orbit.a,
                    orbit.angle,
                    ORBIT_SQUASH,
                    INSPIRAL_SPEED * quasar.spin,
                    orbit.a0,
                    quasar.radius * 3.5,
                    this.radius * 3
                )
            );
        }

        const halfOrbits = Math.floor(orbit.angle / Math.PI);
        if (halfOrbits !== orbit.halfOrbits) {
            orbit.halfOrbits = halfOrbits;
            const closeness = 1 - orbit.a / orbit.a0;
            emitWave(quasar.x, quasar.y, 0.12 + 0.55 * closeness ** 2, now);
        }

        if (orbit.a <= quasar.radius + this.radius * 0.5 || left === 0) {
            this.merged = true;
            return true;
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const R = this.radius;
        const fade = this.dying ? 1 - clamp01(this.deathAge / DEATH_MS) : clamp01(this.age / BIRTH_MS);

        const diskFade = fade * (1 - 0.85 * this.stripped);

        this.renderer.drawBack(ctx, this.x, this.y, R, fade, true, diskFade);
        this.drawDust(ctx, this.dying ? fade : 1);
        this.renderer.drawFront(ctx, this.x, this.y, R, diskFade);
        this.drawShockwave(ctx);
        this.drawEvaporationFlash(ctx);
        ctx.globalAlpha = 1;
    }

    private drawDust(ctx: CanvasRenderingContext2D, fade: number) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#e6f1ff';
        for (const d of this.dust) {
            const [x, y] = this.renderer.project(this.x, this.y, d.r, d.angle, this.dustSquash(d.r));
            // Gets brighter as it heats up on the way in; motion stretches it
            // into a streak right before the horizon (spaghettification)
            ctx.globalAlpha = fade * (0.2 + 0.8 * clamp01(1 - (d.r - this.baseRadius) / (this.baseRadius * 14)));
            ctx.beginPath();
            ctx.moveTo(d.prevX, d.prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    private drawShockwave(ctx: CanvasRenderingContext2D) {
        if (this.age > SHOCKWAVE_MS) return;
        const t = this.age / SHOCKWAVE_MS;
        ctx.globalAlpha = (1 - t) ** 2 * 0.7;
        ctx.strokeStyle = '#64ffda';
        ctx.lineWidth = 2 * (1 - t) + 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.baseRadius * (1 + 14 * Math.sqrt(t)), 0, TAU);
        ctx.stroke();
    }

    /** Final burst of Hawking radiation as the hole evaporates */
    private drawEvaporationFlash(ctx: CanvasRenderingContext2D) {
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
 * Full-screen canvas of black holes, their mergers with the quasar and the
 * gravitational waves those produce. The render loop only runs while there
 * is something to draw, so an idle page costs nothing.
 */
export class BlackHoleField {
    private readonly ctx: CanvasRenderingContext2D | null;
    private holes: BlackHole[] = [];
    private debris: Debris[] = [];
    private readonly lensCanvas = document.createElement('canvas');
    private readonly lensCtx = this.lensCanvas.getContext('2d');
    private mergerFlashes: number[] = [];
    private rafId = 0;
    private lastTime = 0;

    constructor(private readonly canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    spawn(x: number, y: number) {
        if (!this.ctx) return;
        const alive = this.holes.filter((hole) => !hole.dying && !hole.inspiral);
        if (alive.length >= MAX_HOLES) alive[0].die();

        const captured = quasar.radius > 0 && Math.hypot(x - quasar.x, y - quasar.y) < quasar.radius * CAPTURE_RANGE;
        this.holes.push(new BlackHole(x, y, captured));
        this.start();
    }

    destroy() {
        cancelAnimationFrame(this.rafId);
        window.removeEventListener('resize', this.resize);
        this.holes.forEach((hole) => hole.unregister());
        this.holes = [];
        this.debris = [];
    }

    private start() {
        if (this.rafId) return;
        this.lastTime = performance.now();
        this.rafId = requestAnimationFrame(this.frame);
    }

    private resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    private merge(now: number) {
        for (const [delay, amplitude] of RINGDOWN) emitWave(quasar.x, quasar.y, amplitude, now + delay);
        this.mergerFlashes.push(now);
        feedQuasar();
    }

    private frame = (now: number) => {
        const ctx = this.ctx!;
        // Clamp so a backgrounded tab doesn't make everything jump on return
        const dt = Math.min((now - this.lastTime) / 1000, 0.05);
        this.lastTime = now;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.drawWaves(ctx, now);
        this.drawMergerFlashes(ctx, now);

        for (const request of takeDisruptions()) {
            this.debris.push(...tidalDisruption(request.host, request.x, request.y, request.color, request.size));
        }

        for (const hole of this.holes) {
            if (hole.update(dt, now, this.debris)) this.merge(now);
            if (hole.finished) hole.unregister();
        }
        const finished = new Set(this.holes.filter((hole) => hole.finished));
        this.holes = this.holes.filter((hole) => !hole.finished);

        // Debris orbiting a hole that's gone has nothing left to hold it
        this.debris = this.debris.filter((d) => !finished.has(d.host as BlackHole) && updateDebris(d, dt));
        for (const hole of this.holes) this.drawLens(ctx, hole);
        // Drawn before the holes so their horizons hide whatever falls in
        drawDebris(ctx, this.debris);
        for (const hole of this.holes) hole.draw(ctx);

        const busy =
            this.holes.length > 0 ||
            this.debris.length > 0 ||
            this.mergerFlashes.length > 0 ||
            getWaves(now).length > 0;
        this.rafId = busy ? requestAnimationFrame(this.frame) : 0;
        if (!busy) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    /** Re-draws the sky behind a hole magnified, as a gravitational lens would */
    private drawLens(ctx: CanvasRenderingContext2D, hole: BlackHole) {
        const lens = this.lensCtx;
        const R = hole.radius;
        if (!lens || R <= 0 || !skyLayers.length) return;

        const outer = Math.ceil(R * LENS_OUTER);
        const size = outer * 2;
        // Both sides: a fresh canvas is 300×150, so checking the width alone
        // would leave the lens cut off at 150px
        if (this.lensCanvas.width < size || this.lensCanvas.height < size) {
            this.lensCanvas.width = Math.max(size, this.lensCanvas.width);
            this.lensCanvas.height = Math.max(size, this.lensCanvas.height);
        }

        lens.globalCompositeOperation = 'source-over';
        lens.clearRect(0, 0, size, size);
        lens.fillStyle = skyColorAt(hole.x, hole.y);
        lens.fillRect(0, 0, size, size);

        const drawSky = (zoom: number) => {
            for (const layer of skyLayers) {
                const dpr = layer.canvas.width / parseFloat(layer.canvas.style.width);
                // The part of the layer that sits behind the hole, shrunk by the zoom
                const half = outer / zoom;
                const sx = (hole.x - layer.x - half) * dpr;
                const sy = (hole.y - layer.y - half) * dpr;
                lens.drawImage(layer.canvas, sx, sy, half * 2 * dpr, half * 2 * dpr, 0, 0, size, size);
            }
        };

        drawSky(LENS_ZOOM_OUTER);
        lens.save();
        lens.beginPath();
        lens.arc(outer, outer, R * LENS_INNER, 0, TAU);
        lens.clip();
        drawSky(LENS_ZOOM_INNER);
        lens.restore();

        // Blend into the untouched sky towards the edge
        const fadeOut = lens.createRadialGradient(outer, outer, outer * 0.25, outer, outer, outer);
        fadeOut.addColorStop(0, 'rgba(0, 0, 0, 1)');
        fadeOut.addColorStop(1, 'rgba(0, 0, 0, 0)');
        lens.globalCompositeOperation = 'destination-in';
        lens.fillStyle = fadeOut;
        lens.fillRect(0, 0, size, size);

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = hole.dying ? 1 - clamp01(hole.deathAge / DEATH_MS) : clamp01(hole.age / BIRTH_MS);
        ctx.drawImage(this.lensCanvas, 0, 0, size, size, hole.x - outer, hole.y - outer, size, size);
        ctx.globalAlpha = 1;
    }

    /** Each ripple is drawn as a crest and a trough: spacetime stretched, then squeezed */
    private drawWaves(ctx: CanvasRenderingContext2D, now: number) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = '#64ffda';
        for (const wave of getWaves(now)) {
            const radius = waveRadius(wave, now);
            if (radius <= 0) continue;
            const alpha = wave.amplitude * waveDecay(wave, now) * 0.35;

            ctx.lineWidth = 1 + 2 * wave.amplitude;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, radius, 0, TAU);
            ctx.stroke();

            ctx.lineWidth = 1;
            ctx.globalAlpha = alpha * 0.5;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, Math.max(0, radius - WAVE_WIDTH * 0.5), 0, TAU);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    private drawMergerFlashes(ctx: CanvasRenderingContext2D, now: number) {
        this.mergerFlashes = this.mergerFlashes.filter((born) => now - born < MERGER_FLASH_MS);
        ctx.globalCompositeOperation = 'lighter';
        for (const born of this.mergerFlashes) {
            const t = (now - born) / MERGER_FLASH_MS;
            const r = quasar.radius * (1.5 + 6 * Math.sqrt(t));
            const flash = ctx.createRadialGradient(quasar.x, quasar.y, 0, quasar.x, quasar.y, r);
            flash.addColorStop(0, 'rgba(230, 241, 255, 1)');
            flash.addColorStop(0.3, 'rgba(87, 203, 255, 0.6)');
            flash.addColorStop(1, 'rgba(100, 255, 218, 0)');
            ctx.globalAlpha = (1 - t) ** 2;
            ctx.fillStyle = flash;
            ctx.beginPath();
            ctx.arc(quasar.x, quasar.y, r, 0, TAU);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}
