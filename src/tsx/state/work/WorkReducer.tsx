import { createReducer } from '@reduxjs/toolkit';
import { UUID } from '../image/ImageTypes';
import { setHovering, setSelection, setIsDragging, setExpandedTreeNodes, setTextInput } from './WorkActions';
import { Selection } from './WorkTypes';

export interface WorkState {
    selection?: Selection;
    hovering?: UUID;
    textInput: {
        text: string;
        sanitizedText: string;
    };
    expandedTreeNodes: UUID[];
}

const createInitialState = (): WorkState => ({ textInput: { text: '', sanitizedText: '' }, expandedTreeNodes: [] });

const reducer = createReducer(createInitialState, (builder) =>
    builder
        .addCase(setSelection, (state, { payload }) => {
            if (payload) {
                state.selection = {
                    id: payload.id,
                    type: payload.type,
                    isDragging: false,
                    angleConstraints: payload.angleConstraints,
                };
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
        .addCase(setTextInput, (state, { payload }) => {
            state.textInput = payload;
        })
        .addCase(setExpandedTreeNodes, (state, { payload }) => {
            state.expandedTreeNodes = payload;
        })
);

export default reducer;
