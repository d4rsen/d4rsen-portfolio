import { drawHorizon, drawPhotonRing } from './HoleRenderer';
import { TAU, clamp01, random } from './math';
import { quasar } from './quasar';

const FLARE_MS = 2500;
const BASE_INTENSITY = 0.9;

/** Quasar disk: far bigger relative to the horizon than a stellar black hole's */
const DISK_INNER = 1.4;
const DISK_OUTER = 7;
const DISK_SQUASH = 0.2;
const CANVAS_PADDING = 1.08;

/**
 * The disk is drawn as two rings rotating at different speeds: inner gas
 * orbits much faster than outer gas (differential rotation)
 */
const LAYERS = [
    { from: DISK_INNER, to: 3.2, speed: 0.55, filaments: 700 },
    { from: 2.9, to: DISK_OUTER, speed: 0.16, filaments: 1100 }
];
const SPIRAL_ARMS = 2;
/** How tightly the spiral arms wind */
const SPIRAL_PITCH = 2.4;

// Gas temperature falls with radius: white-hot inside, theme green outside
const gasColor = (rel: number, alpha: number) => {
    const t = clamp01((rel - DISK_INNER) / (DISK_OUTER - DISK_INNER));
    if (t < 0.12) return `rgba(255, 255, 255, ${alpha})`;
    if (t < 0.3) return `rgba(230, 241, 255, ${alpha})`;
    if (t < 0.55) return `rgba(87, 203, 255, ${alpha})`;
    return `rgba(100, 255, 218, ${alpha})`;
};

/** Brighter towards the hot center, fading out at the disk's edge */
const brightness = (rel: number) => clamp01((DISK_INNER / rel) ** 0.9) * (1 - clamp01((rel - 5) / 2));

interface Layer {
    texture: HTMLCanvasElement;
    /** Radius of the texture in CSS px */
    radius: number;
    speed: number;
    angle: number;
}

/**
 * Pre-renders a face-on ring of turbulent gas with spiral structure. Drawing
 * this once and just rotating it every frame keeps the quasar cheap even on
 * phones.
 */
const renderLayer = (from: number, to: number, filaments: number, R: number, dpr: number) => {
    const radius = to * R;
    const size = Math.ceil(radius * 2 * dpr);
    const texture = document.createElement('canvas');
    texture.width = size;
    texture.height = size;
    const ctx = texture.getContext('2d');
    if (!ctx) return { texture, radius };

    ctx.translate(size / 2, size / 2);
    ctx.scale(dpr, dpr);

    // Smooth base glow of the gas
    const base = ctx.createRadialGradient(0, 0, from * R, 0, 0, to * R);
    for (let i = 0; i <= 8; i++) {
        const rel = from + ((to - from) * i) / 8;
        base.addColorStop(i / 8, gasColor(rel, 0.85 * brightness(rel)));
    }
    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.arc(0, 0, to * R, 0, TAU);
    ctx.arc(0, 0, from * R, 0, TAU, true);
    ctx.fill();

    // Turbulent filaments, mostly following logarithmic spiral arms
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let i = 0; i < filaments; i++) {
        const rel = from + (to - from) * Math.random() ** 1.3;
        const onArm = Math.random() < 0.65;
        const arm = Math.floor(Math.random() * SPIRAL_ARMS);
        const angle = onArm
            ? (arm * TAU) / SPIRAL_ARMS + SPIRAL_PITCH * Math.log(rel) + random(-0.35, 0.35)
            : random(0, TAU);
        const length = random(0.15, 0.8);

        ctx.strokeStyle = gasColor(rel, random(0.2, 0.75) * brightness(rel));
        ctx.lineWidth = random(0.4, 1.8) * (R / 30);
        ctx.beginPath();
        ctx.arc(0, 0, rel * R, angle, angle + length);
        ctx.stroke();
    }

    // Darker dust lanes break up the glow
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < filaments / 6; i++) {
        const rel = from + (to - from) * Math.random();
        const angle = random(0, TAU);
        ctx.strokeStyle = `rgba(0, 0, 0, ${random(0.1, 0.35)})`;
        ctx.lineWidth = random(0.5, 2.5) * (R / 30);
        ctx.beginPath();
        ctx.arc(0, 0, rel * R, angle, angle + random(0.2, 1));
        ctx.stroke();
    }

    return { texture, radius };
};

interface QuasarCoreOptions {
    animate: boolean;
}

/** Renders the quasar's accretion disk and horizon on a canvas centered on it */
export class QuasarCore {
    private readonly ctx: CanvasRenderingContext2D | null;
    /** Each half of the disk is composed here before Doppler shading is applied */
    private readonly scratch = document.createElement('canvas');
    private readonly scratchCtx: CanvasRenderingContext2D | null;
    private layers: Layer[] = [];
    private size = 0;
    private dpr = 1;
    private rafId = 0;
    private lastTime = 0;
    private flareStart = -Infinity;

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly options: QuasarCoreOptions
    ) {
        this.ctx = canvas.getContext('2d');
        this.scratchCtx = this.scratch.getContext('2d');
    }

    start() {
        if (!this.ctx) return;
        this.lastTime = performance.now();
        if (this.options.animate) this.rafId = requestAnimationFrame(this.frame);
        else this.draw(performance.now());
    }

    destroy() {
        cancelAnimationFrame(this.rafId);
    }

    /** Call after the quasar moved or grew */
    resize() {
        if (!this.ctx) return;
        const R = quasar.radius;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.size = Math.ceil(R * DISK_OUTER * 2 * CANVAS_PADDING);

        for (const canvas of [this.canvas, this.scratch]) {
            canvas.width = this.size * this.dpr;
            canvas.height = this.size * this.dpr;
        }
        this.canvas.style.width = `${this.size}px`;
        this.canvas.style.height = `${this.size}px`;

        const angles = this.layers.map((layer) => layer.angle);
        this.layers = LAYERS.map((layer, i) => ({
            ...renderLayer(layer.from, layer.to, layer.filaments, R, this.dpr),
            speed: layer.speed,
            angle: angles[i] ?? random(0, TAU)
        }));

        if (!this.options.animate) this.draw(performance.now());
    }

    flare() {
        this.flareStart = performance.now();
    }

    private frame = (now: number) => {
        const dt = Math.min((now - this.lastTime) / 1000, 0.05);
        this.lastTime = now;
        const boost = 1 + this.flareAmount(now);
        for (const layer of this.layers) layer.angle += layer.speed * boost * quasar.spin * dt;
        this.draw(now);
        this.rafId = requestAnimationFrame(this.frame);
    };

    /** 1 right after a merger, easing back to 0 */
    private flareAmount(now: number) {
        const t = (now - this.flareStart) / FLARE_MS;
        return t >= 0 && t < 1 ? (1 - t) ** 2 : 0;
    }

    private draw(now: number) {
        const ctx = this.ctx;
        if (!ctx) return;
        const c = this.size / 2;
        const R = quasar.radius;
        const intensity = BASE_INTENSITY + (1 - BASE_INTENSITY) * this.flareAmount(now);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

        this.drawDiskHalf(ctx, c, intensity, true);
        ctx.globalCompositeOperation = 'lighter';
        this.drawLensedArcs(ctx, c, R, intensity);
        drawPhotonRing(ctx, c, c, R, intensity);
        drawHorizon(ctx, c, c, R);
        this.drawDiskHalf(ctx, c, intensity, false);

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    }

    /** The far half goes behind the horizon, the near half in front of it */
    private drawDiskHalf(ctx: CanvasRenderingContext2D, c: number, intensity: number, farSide: boolean) {
        const s = this.scratchCtx;
        if (!s) return;
        const outer = quasar.radius * DISK_OUTER;

        s.setTransform(1, 0, 0, 1, 0, 0);
        s.globalCompositeOperation = 'source-over';
        s.clearRect(0, 0, this.scratch.width, this.scratch.height);
        s.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

        s.save();
        s.translate(c, c);
        s.rotate(quasar.tilt);
        s.scale(1, DISK_SQUASH);
        s.beginPath();
        s.rect(-outer, farSide ? -outer : 0, outer * 2, outer);
        s.clip();
        for (const layer of this.layers) {
            s.save();
            s.rotate(layer.angle);
            s.drawImage(layer.texture, -layer.radius, -layer.radius, layer.radius * 2, layer.radius * 2);
            s.restore();
        }
        s.restore();

        // Doppler beaming: gas moving towards us (right side) is boosted,
        // gas moving away is dimmed
        s.save();
        s.translate(c, c);
        s.rotate(quasar.tilt);
        const beam = s.createLinearGradient(-outer, 0, outer, 0);
        beam.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
        beam.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        s.globalCompositeOperation = 'destination-out';
        s.fillStyle = beam;
        s.fillRect(-outer, -outer, outer * 2, outer * 2);

        const boost = s.createLinearGradient(-outer, 0, outer, 0);
        boost.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        boost.addColorStop(0.8, 'rgba(255, 255, 255, 0.35)');
        boost.addColorStop(1, 'rgba(255, 255, 255, 0)');
        s.globalCompositeOperation = 'source-atop';
        s.fillStyle = boost;
        s.fillRect(-outer, -outer, outer * 2, outer * 2);
        s.restore();

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = farSide ? 'lighter' : 'source-over';
        ctx.globalAlpha = intensity;
        ctx.drawImage(this.scratch, 0, 0);
        ctx.restore();
    }

    /**
     * Gravitational lensing bends light from the far side of the disk over the
     * top and under the bottom of the shadow (the Gargantua look)
     */
    private drawLensedArcs(ctx: CanvasRenderingContext2D, c: number, R: number, intensity: number) {
        ctx.save();
        ctx.translate(c, c);
        ctx.rotate(quasar.tilt);
        ctx.lineCap = 'round';

        const arcs: [number, number, number][] = [
            // [start, end, brightness]: the top image is much brighter
            [Math.PI, TAU, 1],
            [0, Math.PI, 0.35]
        ];
        for (const [start, end, strength] of arcs) {
            ctx.globalAlpha = intensity * strength * 0.7;
            ctx.strokeStyle = '#e6f1ff';
            ctx.lineWidth = R * 0.18;
            ctx.beginPath();
            ctx.ellipse(0, 0, R * 1.35, R * 1.25, 0, start, end);
            ctx.stroke();
        }
        ctx.restore();
    }
}
