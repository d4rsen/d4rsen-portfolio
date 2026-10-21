import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());

// jsdom has no canvas implementation; the space effects handle a missing context
HTMLCanvasElement.prototype.getContext = () => null;
