import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type UserConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig(({ command }): UserConfig => {
    const commonConfig: UserConfig = {
        plugins: [
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
            tsconfigPaths: true,
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
                rolldownOptions: {
                    output: {
                        codeSplitting: {
                            groups: [
                                {
                                    name: 'react',
                                    test: /node_modules[\\/](react|react-dom)/,
                                },
                                {
                                    name: 'redux',
                                    test: /node_modules[\\/](react-redux|redux|redux-logger|@reduxjs\/toolkit)/,
                                },
                                {
                                    name: 'radix-ui',
                                    test: /node_modules[\\/]@radix-ui/,
                                },
                                {
                                    name: 'vendor',
                                    test: /node_modules/,
                                },
                            ],
                        },
                    },
                },
            },
        };
    }
});
