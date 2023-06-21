import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react({
            tsDecorators: true
        }),
        VitePWA({
            injectRegister: 'auto'
        })
    ]
});

