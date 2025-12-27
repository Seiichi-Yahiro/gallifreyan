import { historyActions } from '@/redux/history/history.slice';
import type { LineSlotId } from '@/redux/ids';
import type { CircleId } from '@/redux/svg/svg.types';
import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';

export type InteractionSlice = {
    hovered: CircleId | LineSlotId | null;
    selected: CircleId | LineSlotId | null;
    dragging: boolean;
};

export const createInitialInteractionState = (): InteractionSlice => ({
    hovered: null,
    selected: null,
    dragging: false,
});

const interactionSlice = createSlice({
    name: 'interaction',
    initialState: createInitialInteractionState,
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
                return action.payload.load.interaction;
            },
        );
    },
});

export const interactionActions = interactionSlice.actions;
export default interactionSlice.reducer;
