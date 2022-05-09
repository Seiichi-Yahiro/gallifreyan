import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UUID } from './ImageTypes';

export interface WorkState {
    selection?: UUID;
    hovering?: UUID;
}

const createInitialState = (): WorkState => ({});

export const workSlice = createSlice({
    name: 'work',
    initialState: createInitialState,
    reducers: {
        setHovering: (state, { payload }: PayloadAction<UUID | undefined>) => {
            state.hovering = payload;
        },
        setSelection: (state, { payload }: PayloadAction<UUID | undefined>) => {
            state.selection = payload;
        },
    },
});

export const { setHovering, setSelection } = workSlice.actions;

export default workSlice.reducer;
