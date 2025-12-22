import type { LineSlotId } from '@/redux/ids';
import { historyActions } from '@/redux/slices/historySlice';
import type { CircleId } from '@/redux/types/svgTypes';
import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';

export type UiSlice = {
    hovered: CircleId | LineSlotId | null;
    selected: CircleId | LineSlotId | null;
    dragging: boolean;
};

export const createInitialUiState = (): UiSlice => ({
    hovered: null,
    selected: null,
    dragging: false,
});

const uiSlice = createSlice({
    name: 'ui',
    initialState: createInitialUiState,
    reducers: {
        setHover: (
            state,
            action: PayloadAction<CircleId | LineSlotId | null>,
        ) => {
            state.hovered = action.payload;
        },
        setSelection: (
            state,
            action: PayloadAction<CircleId | LineSlotId | null>,
        ) => {
            state.selected = action.payload;
        },
        setDragging: (state, action: PayloadAction<boolean>) => {
            state.dragging = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(historyActions.undo, historyActions.redo),
            (_state, action) => {
                return action.payload.load.ui;
            },
        );
    },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
