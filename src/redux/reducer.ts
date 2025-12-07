import actions from '@/redux/actions';
import {
    createInitialSvgState,
    createSvgReducerCases,
    createSvgReducerMatches,
    type SvgState,
} from '@/redux/svg/svgReducer';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId } from '@/redux/text/ids';
import {
    createInitialTextState,
    createTextReducerCases,
    type TextState,
} from '@/redux/text/textReducer';
import { createReducer as createReduxReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

export interface MainState {
    text: TextState;
    svg: SvgState;
    hovered: CircleId | LineSlotId | null;
    selected: CircleId | LineSlotId | null;
    dragging: boolean;
}

const createReducer = () =>
    combineReducers({
        main: createReduxReducer<MainState>(
            {
                text: createInitialTextState(),
                svg: createInitialSvgState(),
                hovered: null,
                selected: null,
                dragging: false,
            },
            (builder) => {
                builder
                    .addCase(actions.setHover, (state, action) => {
                        state.hovered = action.payload;
                    })
                    .addCase(actions.setSelection, (state, action) => {
                        state.selected = action.payload;
                    })
                    .addCase(actions.startDragging, (state) => {
                        state.dragging = true;
                    })
                    .addCase(actions.stopDragging, (state) => {
                        state.dragging = false;
                    });

                createTextReducerCases(builder);
                createSvgReducerCases(builder);

                createSvgReducerMatches(builder);
            },
        ),
    });

export default createReducer;
