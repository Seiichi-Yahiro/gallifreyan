import { createReducer } from '@reduxjs/toolkit';
import { UUID } from '../image/ImageTypes';
import { setHovering, setSelection } from './WorkActions';
import { Selection } from './WorkTypes';

export interface WorkState {
    selection?: Selection;
    hovering?: UUID;
}

const createInitialState = (): WorkState => ({});

const reducer = createReducer(createInitialState, (builder) =>
    builder
        .addCase(setSelection, (state, { payload }) => {
            state.selection = payload;
        })
        .addCase(setHovering, (state, { payload }) => {
            state.hovering = payload;
        })
);

export default reducer;
