export const TAU = Math.PI * 2;

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
export const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
export const random = (min: number, max: number) => min + Math.random() * (max - min);

export const easeOutBack = (t: number) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2;
export const easeInCubic = (t: number) => t ** 3;
