import { createReducer } from '@reduxjs/toolkit';
import { setThemeMode } from './ThemeActions';

export interface ThemeState {
    mode: 'light' | 'dark';
}

const createInitialState = (): ThemeState => ({
    mode: 'light',
});

const reducer = createReducer(createInitialState, (builder) => {
    builder.addCase(setThemeMode, (state, { payload }) => {
        state.mode = payload;
    });
});

export default reducer;
