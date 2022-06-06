import { createAction } from '@reduxjs/toolkit';
import { Mode } from './SettingsTypes';

export const setThemeMode = createAction<Mode>('theme/setMode');
