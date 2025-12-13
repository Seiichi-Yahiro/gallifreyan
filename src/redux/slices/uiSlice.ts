import type { LineSlotId } from '@/redux/ids';
import type { CircleId } from '@/redux/types/svgTypes';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UiSlice = {
    hovered: CircleId | LineSlotId | null;
    selected: CircleId | LineSlotId | null;
    dragging: boolean;
};

const createInitialState = (): UiSlice => ({
    hovered: null,
    selected: null,
    dragging: false,
});

const uiSlice = createSlice({
    name: 'ui',
    initialState: createInitialState,
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
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
