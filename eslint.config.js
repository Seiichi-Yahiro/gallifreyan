import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    { ignores: ['node_modules', 'build', 'reports', '.striker-tmp'] },
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        extends: [
            ...tseslint.configs.recommended,
            pluginReactRefresh.configs.vite,
            pluginReact.configs.flat.recommended,
            pluginReact.configs.flat['jsx-runtime'],
            pluginReactHooks.configs.flat.recommended,
            eslintConfigPrettier,
        ],
        rules: {
            'react/prop-types': 'off',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: false,
                },
            ],
            'no-console': 'warn',
            eqeqeq: ['error', 'always'],
        },
    },
]);
