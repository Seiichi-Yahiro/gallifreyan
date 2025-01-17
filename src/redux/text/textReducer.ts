import textActions from '@/redux/text/textActions';
import { createReducer } from '@reduxjs/toolkit';

export interface TextState {
    value: string;
}

const createInitialTextState = (): TextState => ({
    value: '',
});

export const createTextReducer = (
    initialState: TextState | (() => TextState) = createInitialTextState,
) =>
    createReducer(initialState, (builder) => {
        builder.addCase(textActions.setText, (state, action) => {
            state.value = action.payload;
        });
    });
