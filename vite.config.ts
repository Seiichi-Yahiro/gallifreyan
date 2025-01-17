import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type UserConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command }): UserConfig => {
    const commonConfig: UserConfig = {
        plugins: [
            tsconfigPaths(),
            react({
                babel: {
                    plugins: ['babel-plugin-react-compiler'],
                },
            }),
            checker({
                typescript: true,
                eslint: {
                    lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
                    useFlatConfig: true,
                },
            }),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
    };

    if (command === 'serve') {
        return {
            ...commonConfig,
            server: {
                port: 3000,
            },
        };
    } else {
        // command === 'build'
        return {
            ...commonConfig,
            build: {
                outDir: './build',
                rollupOptions: {
                    output: {
                        manualChunks: {
                            react: ['react', 'react-dom'],
                            redux: [
                                'react-redux',
                                'redux',
                                'redux-logger',
                                '@reduxjs/toolkit',
                            ],
                        },
                    },
                },
            },
        };
    }
});
