import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    server: {
        port: 8080,
        open: false
    },
    build: {
        outDir: 'build',
        assetsDir: 'assets',
        emptyOutDir: true
    },
    css: {
        postcss: {
            plugins: [autoprefixer]
        }
    }
});
