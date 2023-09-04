import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
    plugins: [react(), svgr(), legacy()]
});
