import { createReducer } from '@reduxjs/toolkit';
import { UUID } from '../image/ImageTypes';
import {
    setHovering,
    setSelection,
    setIsDragging,
    setExpandedTreeNodes,
    setTextInput,
    setJustDragged,
    setConstraints,
} from './WorkActions';
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
                    justDragged: false,
                    constraints: {
                        angle: {
                            minAngle: 0,
                            maxAngle: 360,
                        },
                        distance: {
                            minDistance: 0,
                            maxDistance: Infinity,
                        },
                    },
                };
            } else if (!state.selection?.justDragged) {
                state.selection = undefined;
            }
        })
        .addCase(setConstraints, (state, { payload }) => {
            if (state.selection) {
                state.selection.constraints = {
                    ...state.selection.constraints,
                    ...payload,
                };
            }
        })
        .addCase(setHovering, (state, { payload }) => {
            if (state.selection?.isDragging) {
                state.hovering = undefined;
            } else {
                state.hovering = payload;
            }
        })
        .addCase(setIsDragging, (state, { payload }) => {
            if (state.selection) {
                state.selection.isDragging = payload;
            }
        })
        .addCase(setJustDragged, (state, { payload }) => {
            if (state.selection) {
                state.selection.justDragged = payload;
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
