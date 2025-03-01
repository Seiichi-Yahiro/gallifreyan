import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig((configEnv) =>
    mergeConfig(
        viteConfig(configEnv),
        defineConfig({
            test: {
                setupFiles: ['test/testSetup.ts'],
                environment: 'jsdom',
                dir: 'src/',
                coverage: {
                    provider: 'v8',
                    reporter: ['html'],
                    reportsDirectory: './reports/coverage',
                    include: ['src/**'],
                },
            },
        }),
    ),
);
