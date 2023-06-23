import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [
        react({
            tsDecorators: true
        })
        // delete PWA for now
        // VitePWA({
        //     injectRegister: 'auto'
        // })
    ]
});
