import type { SvgSlice } from '@/redux/slices/svgSlice';
import { type TextSlice } from '@/redux/slices/textSlice';
import type { UiSlice } from '@/redux/slices/uiSlice';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type State = {
    text: TextSlice;
    svg: SvgSlice;
    ui: UiSlice;
};

export type HistorySlice = {
    past: State[];
    future: State[];
};

const createInitialState = (): HistorySlice => ({
    past: [],
    future: [],
});

const historySlice = createSlice({
    name: 'history',
    initialState: createInitialState,
    reducers: {
        undo: (state, action: PayloadAction<{ store: State; load: State }>) => {
            state.past.pop();
            state.future = [action.payload.store, ...state.future];
        },
        redo: (state, action: PayloadAction<{ store: State; load: State }>) => {
            state.future = state.future.slice(1);
            state.past.push(action.payload.store);
        },
        save: (state, action: PayloadAction<State>) => {
            state.past.push(action.payload);
            state.future = [];
        },
    },
});

export const historyActions = historySlice.actions;
export default historySlice.reducer;
