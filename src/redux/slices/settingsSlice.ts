import type { SplitLettersOptions } from '@/redux/utils/textAnalysis';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SettingsSlice = {
    splitLetterOptions: Required<SplitLettersOptions>;
};

const createInitialSate = (): SettingsSlice => ({
    splitLetterOptions: {
        digraphs: true,
    },
});

const settingsSlice = createSlice({
    name: 'settings',
    initialState: createInitialSate,
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
