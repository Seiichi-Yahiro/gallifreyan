import type { SvgSlice } from '@/redux/slices/svgSlice';
import { type TextSlice } from '@/redux/slices/textSlice';
import type { UiSlice } from '@/redux/slices/uiSlice';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type HistoryState = {
    text: TextSlice;
    svg: SvgSlice;
    ui: UiSlice;
};

export type HistorySlice = {
    past: HistoryState[];
    future: HistoryState[];
};

const createInitialState = (): HistorySlice => ({
    past: [],
    future: [],
});

const maxHistorySize = 30;

const historySlice = createSlice({
    name: 'history',
    initialState: createInitialState,
    reducers: {
        undo: (
            state,
            action: PayloadAction<{ store: HistoryState; load: HistoryState }>,
        ) => {
            state.past.pop();
            state.future = [action.payload.store, ...state.future];
        },
        redo: (
            state,
            action: PayloadAction<{ store: HistoryState; load: HistoryState }>,
        ) => {
            state.future = state.future.slice(1);
            state.past.push(action.payload.store);
        },
        save: (state, action: PayloadAction<HistoryState>) => {
            if (state.past.length >= maxHistorySize) {
                state.past.shift();
            }

            state.past.push(action.payload);
            state.future = [];
        },
    },
});

export const historyActions = historySlice.actions;
export default historySlice.reducer;
