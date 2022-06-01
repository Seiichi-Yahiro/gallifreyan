import { createReducer } from '@reduxjs/toolkit';
import { UUID } from '../image/ImageTypes';
import { setHovering, setIsDragging, setSelection } from './WorkActions';
import { Selection } from './WorkTypes';

export interface WorkState {
    selection?: Selection;
    hovering?: UUID;
}

const createInitialState = (): WorkState => ({});

const reducer = createReducer(createInitialState, (builder) =>
    builder
        .addCase(setSelection, (state, { payload }) => {
            if (payload) {
                state.selection = {
                    ...payload,
                    isDragging: false,
                } as Selection;
            } else {
                state.selection = undefined;
            }
        })
        .addCase(setHovering, (state, { payload }) => {
            state.hovering = payload;
        })
        .addCase(setIsDragging, (state, { payload }) => {
            if (state.selection) {
                state.selection.isDragging = payload;
            }
        })
);

export default reducer;
