import type { LineSlotId } from '@/redux/ids';
import { historyActions } from '@/redux/slices/historySlice';
import type { PositionConstraints } from '@/redux/types/interactionTypes';
import type { CircleId } from '@/redux/types/svgTypes';
import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';

export type InteractionSlice = {
    hovered: CircleId | LineSlotId | null;
    selected: CircleId | LineSlotId | null;
    dragging: boolean;
    positionConstraints: PositionConstraints | null;
};

export const createInitialInteractionState = (): InteractionSlice => ({
    hovered: null,
    selected: null,
    dragging: false,
    positionConstraints: null,
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
        setPositionConstraints: (
            state,
            action: PayloadAction<PositionConstraints | null>,
        ) => {
            state.positionConstraints = action.payload;
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
