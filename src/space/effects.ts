import { useSyncExternalStore } from 'react';

/**
 * Whether the heavy space effects run: off when the visitor turned gravity
 * off with the toggle, or asked their OS for reduced motion.
 */

const STORAGE_KEY = 'gravity-off';
const CLASS_NAME = 'gravity-off';

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const readToggle = () => {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return false;
    }
};

let gravityOff = readToggle();
const listeners = new Set<() => void>();

const applyClass = () => document.documentElement.classList.toggle(CLASS_NAME, gravityOff);
applyClass();

export const effectsEnabled = () => !gravityOff && !prefersReducedMotion();

export const isGravityOff = () => gravityOff;

export const setGravityOff = (off: boolean) => {
    gravityOff = off;
    try {
        window.localStorage.setItem(STORAGE_KEY, off ? '1' : '0');
    } catch {
        // Private mode etc.: the choice just won't be remembered
    }
    applyClass();
    listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

/** Re-renders when gravity is toggled; use the result as an effect dependency */
export const useEffectsEnabled = () => useSyncExternalStore(subscribe, effectsEnabled);

/** Just the toggle itself (the custom cursor follows it, not the OS motion setting) */
export const useGravityOff = () => useSyncExternalStore(subscribe, isGravityOff);
