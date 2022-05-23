/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/tsx/setupTests.tsx'],
    transform: {
        '^.+\\.(t|j)sx?$': 'ts-jest',
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transformIgnorePatterns: ['/node_modules/(?!uuid|react)'],
    testEnvironment: 'jsdom',
    coverageReporters: ['html'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
};
