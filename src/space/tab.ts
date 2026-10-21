import { effectsEnabled } from './effects';

/**
 * Little things that live outside the page: the tab title reacts when the
 * visitor leaves, the favicon is a spinning pulsar, and the console has a
 * message for whoever opens DevTools.
 */

const LOST_TITLE = '📡 Signal lost…';
const RESTORED_TITLE = '📡 Signal restored';
const RESTORED_MS = 2000;

const FAVICON_SIZE = 32;
const FAVICON_FPS = 12;
/** One turn of the pulsar's beams */
const FAVICON_PERIOD_MS = 2400;

const watchTitle = () => {
    let restoreTimer = 0;
    let original = document.title;
    document.addEventListener('visibilitychange', () => {
        window.clearTimeout(restoreTimer);
        if (document.hidden) {
            if (document.title !== RESTORED_TITLE) original = document.title;
            document.title = LOST_TITLE;
            return;
        }
        document.title = RESTORED_TITLE;
        restoreTimer = window.setTimeout(() => (document.title = original), RESTORED_MS);
    });
};

const drawPulsar = (ctx: CanvasRenderingContext2D, angle: number) => {
    const c = FAVICON_SIZE / 2;
    ctx.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE);
    ctx.fillStyle = '#0a192f';
    ctx.beginPath();
    ctx.arc(c, c, c, 0, Math.PI * 2);
    ctx.fill();

    // Two opposite beams sweeping around, like a lighthouse
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(angle);
    for (const side of [1, -1]) {
        const beam = ctx.createLinearGradient(0, 0, side * c, 0);
        beam.addColorStop(0, 'rgba(100, 255, 218, 0.95)');
        beam.addColorStop(1, 'rgba(100, 255, 218, 0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(side * c, -4);
        ctx.lineTo(side * c, 4);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();

    const core = ctx.createRadialGradient(c, c, 0, c, c, 7);
    core.addColorStop(0, '#ffffff');
    core.addColorStop(0.4, '#b4fff0');
    core.addColorStop(1, 'rgba(100, 255, 218, 0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(c, c, 7, 0, Math.PI * 2);
    ctx.fill();
};

const animateFavicon = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = FAVICON_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.append(link);
    }
    const icon = link;
    icon.type = 'image/png';

    const draw = () => {
        drawPulsar(ctx, ((Date.now() % FAVICON_PERIOD_MS) / FAVICON_PERIOD_MS) * Math.PI * 2);
        icon.href = canvas.toDataURL('image/png');
    };
    draw();
    // Frozen when motion is off; checked on every frame so the gravity toggle applies live
    window.setInterval(() => effectsEnabled() && draw(), 1000 / FAVICON_FPS);
};

const greetDevelopers = () => {
    const art = [
        '        .        *          .',
        '   *        \\    |    /        .',
        '        .  -- ( ◉ ) --   *',
        '   .        /    |    \\     .',
        '      *          .        *'
    ].join('\n');
    console.log(`%c${art}`, 'color: #64ffda; font-family: monospace;');
    console.log(
        '%cIncoming transmission 📡\n%cLooking at the source? Looking for a frontend dev?\nOpen a channel: https://t.me/d4rse · darsenungarlinov00@gmail.com\nPS: press W',
        'color: #64ffda; font-size: 14px; font-weight: bold;',
        'color: #a8b2d1; font-size: 12px; line-height: 1.6;'
    );
};

export const startTabSignals = () => {
    watchTitle();
    animateFavicon();
    greetDevelopers();
};
