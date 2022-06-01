import { createAction } from '@reduxjs/toolkit';

export const setThemeMode = createAction<'light' | 'dark'>('theme/setMode');
