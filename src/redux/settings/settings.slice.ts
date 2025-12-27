import type { SplitLettersOptions } from '@/redux/text/text.analysis';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SettingsSlice = {
    splitLetterOptions: Required<SplitLettersOptions>;
};

export const createInitialSettingsSate = (): SettingsSlice => ({
    splitLetterOptions: {
        digraphs: true,
    },
});

const settingsSlice = createSlice({
    name: 'settings',
    initialState: createInitialSettingsSate,
    reducers: {
        setSplitLetterOptions: (
            state,
            action: PayloadAction<SplitLettersOptions>,
        ) => {
            state.splitLetterOptions = {
                ...state.splitLetterOptions,
                ...action.payload,
            };
        },
    },
});

export const settingsActions = settingsSlice.actions;
export default settingsSlice.reducer;
