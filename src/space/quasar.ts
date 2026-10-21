/**
 * The quasar at the center of the orbits: a supermassive black hole with
 * relativistic jets. Small black holes that come too close spiral into it
 * and merge, making it grow (until the page is reloaded).
 */

const GROWTH_PER_MERGER = 1.12;
const MAX_GROWTH = 1.8;
const WIDE_SCREEN = 1024;
const TABLET = 768;

export const quasar = {
    x: 0,
    y: 0,
    radius: 0,
    growth: 1,
    /** Disk tilt on screen, in radians; jets point perpendicular to it */
    tilt: -0.28,
    spin: 1 as 1 | -1
};

/**
 * Center of the planetary system, placed in empty space so the quasar doesn't
 * shine through the greeting: to the right of it on wide screens, below the
 * button on narrow ones.
 */
export const getSystemCenter = (width: number, height: number) =>
    width > WIDE_SCREEN ? { x: width * 0.72, y: height * 0.64 } : { x: width / 2, y: height * 0.82 };

const baseRadius = (width: number) => (width <= TABLET ? 18 : 30);

export const placeQuasar = (width: number, height: number) => {
    const center = getSystemCenter(width, height);
    quasar.x = center.x;
    quasar.y = center.y;
    quasar.radius = baseRadius(width) * quasar.growth;
};

const feedListeners = new Set<() => void>();

export const onQuasarFeed = (listener: () => void) => {
    feedListeners.add(listener);
    return () => {
        feedListeners.delete(listener);
    };
};

/** Something fell in: flare up without growing */
export const flareQuasar = () => {
    feedListeners.forEach((listener) => listener());
};

/** A black hole merged into the quasar */
export const feedQuasar = () => {
    quasar.growth = Math.min(MAX_GROWTH, quasar.growth * GROWTH_PER_MERGER);
    placeQuasar(window.innerWidth, window.innerHeight);
    feedListeners.forEach((listener) => listener());
};
