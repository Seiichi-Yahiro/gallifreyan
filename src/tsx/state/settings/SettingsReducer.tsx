import { createReducer } from '@reduxjs/toolkit';
import LocalStorage from '../../utils/LocalStorage';
import { setThemeMode } from './SettingsActions';
import { Mode } from './SettingsTypes';

export interface SettingsState {
    mode: Mode;
}

const createInitialState = (): SettingsState => ({
    mode: LocalStorage.read<Mode>('mode') ?? Mode.Light,
});

const reducer = createReducer(createInitialState, (builder) => {
    builder.addCase(setThemeMode, (state, { payload }) => {
        state.mode = payload;
        LocalStorage.write('mode', payload);
    });
});

export default reducer;
