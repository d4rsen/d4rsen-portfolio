import { TAU, clamp01, easeInCubic, lerp, random } from './math';

export const COLLAPSE_MS = 1500;
const FLASH_MS = 500;
const COLORS = ['#64ffda', '#57cbff', '#e6f1ff', '#64ffda'];

interface Gas {
    r0: number;
    r: number;
    angle: number;
    spin: number;
    color: string;
    width: number;
    prevX: number;
    prevY: number;
}

/**
 * Loader intro: a cloud of gas collapses under its own gravity, spinning
 * faster and flattening into a disk as it shrinks (angular momentum), then
 * ignites in a flash.
 */
export class StarBirth {
    private readonly ctx: CanvasRenderingContext2D | null;
    private readonly gas: Gas[] = [];
    private rafId = 0;
    private start = 0;
    private last = 0;
    private width = 0;
    private height = 0;

    constructor(
        private readonly canvas: HTMLCanvasElement,
        particles: number
    ) {
        this.ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        canvas.width = this.width * dpr;
        canvas.height = this.height * dpr;
        this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

        const extent = Math.max(this.width, this.height) * 0.55;
        for (let i = 0; i < particles; i++) {
            const r0 = extent * random(0.15, 1) ** 0.7;
            this.gas.push({
                r0,
                r: r0,
                angle: random(0, TAU),
                spin: random(0.25, 0.6),
                color: COLORS[i % COLORS.length],
                width: random(0.6, 1.8),
                prevX: 0,
                prevY: 0
            });
        }
    }

    play() {
        if (!this.ctx) return;
        this.start = this.last = performance.now();
        this.rafId = requestAnimationFrame(this.frame);
    }

    destroy() {
        cancelAnimationFrame(this.rafId);
    }

    private frame = (now: number) => {
        const ctx = this.ctx!;
        const t = now - this.start;
        const dt = Math.min((now - this.last) / 1000, 0.05);
        this.last = now;
        const cx = this.width / 2;
        const cy = this.height / 2;
        const p = clamp01(t / COLLAPSE_MS);

        ctx.clearRect(0, 0, this.width, this.height);
        ctx.globalCompositeOperation = 'lighter';

        if (p < 1) {
            const shrink = 1 - easeInCubic(p);
            // Flattens into a disk while collapsing
            const squash = lerp(1, 0.3, p);
            ctx.lineCap = 'round';
            for (const g of this.gas) {
                const r = g.r0 * shrink;
                const x = cx + Math.cos(g.angle) * r;
                const y = cy + Math.sin(g.angle) * r * squash;
                if (g.r === g.r0) [g.prevX, g.prevY] = [x, y];
                g.r = r;
                // Spins up as it shrinks: angular momentum is conserved
                g.angle += (g.spin / Math.max(shrink, 0.08)) * dt;

                ctx.globalAlpha = 0.25 + 0.75 * p;
                ctx.strokeStyle = g.color;
                ctx.lineWidth = g.width;
                ctx.beginPath();
                ctx.moveTo(g.prevX, g.prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
                g.prevX = x;
                g.prevY = y;
            }

            // The core heats up as matter piles in
            const coreRadius = 8 + 50 * p;
            const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
            core.addColorStop(0, 'rgba(230, 241, 255, 1)');
            core.addColorStop(1, 'rgba(100, 255, 218, 0)');
            ctx.globalAlpha = p * p;
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.arc(cx, cy, coreRadius, 0, TAU);
            ctx.fill();
        }

        const flash = (t - COLLAPSE_MS) / FLASH_MS;
        if (flash >= 0 && flash < 1) {
            const extent = Math.max(this.width, this.height);
            const radius = extent * 0.5 * Math.sqrt(flash);
            const burst = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(radius, 1));
            burst.addColorStop(0, 'rgba(255, 255, 255, 1)');
            burst.addColorStop(0.3, 'rgba(87, 203, 255, 0.5)');
            burst.addColorStop(1, 'rgba(100, 255, 218, 0)');
            ctx.globalAlpha = (1 - flash) ** 2;
            ctx.fillStyle = burst;
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(radius, 1), 0, TAU);
            ctx.fill();

            ctx.globalAlpha = (1 - flash) * 0.8;
            ctx.strokeStyle = '#64ffda';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, extent * 0.7 * flash, 0, TAU);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
        if (flash < 1) this.rafId = requestAnimationFrame(this.frame);
        else ctx.clearRect(0, 0, this.width, this.height);
    };
}
