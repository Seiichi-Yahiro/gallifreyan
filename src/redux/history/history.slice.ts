import type { InteractionSlice } from '@/redux/interactions/interaction.slice';
import type { SvgSlice } from '@/redux/svg/svg.slice';
import { type TextSlice } from '@/redux/text/text.slice';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type HistoryState = {
    text: Omit<TextSlice, 'settings'>;
    svg: SvgSlice;
    interaction: InteractionSlice;
};

export type HistorySlice = {
    past: HistoryState[];
    future: HistoryState[];
};

export const createInitialHistoryState = (): HistorySlice => ({
    past: [],
    future: [],
});

const maxHistorySize = 30;

const historySlice = createSlice({
    name: 'history',
    initialState: createInitialHistoryState,
    reducers: {
        undo: (
            state,
            action: PayloadAction<{ store: HistoryState; load: HistoryState }>,
        ) => {
            state.past.pop();
            state.future.unshift(action.payload.store);
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
