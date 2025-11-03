import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig(function (_a) {
    var _b, _c;
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        server: {
            port: Number((_b = env.VITE_PORT) !== null && _b !== void 0 ? _b : 5173),
            strictPort: true,
        },
        preview: {
            port: Number((_c = env.VITE_PORT) !== null && _c !== void 0 ? _c : 4173),
            strictPort: true,
        },
    };
});
