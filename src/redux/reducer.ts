import {
    createInitialSvgState,
    createSvgReducer,
    type SvgState,
} from '@/redux/svg/svgReducer';
import type { CircleId } from '@/redux/svg/svgTypes';
import {
    createInitialTextState,
    createTextReducer,
    type TextState,
} from '@/redux/text/textReducer';
import { createReducer as createReduxReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

export interface MainState {
    text: TextState;
    svg: SvgState;
    hovered: CircleId | null;
}

const createReducer = () =>
    combineReducers({
        main: createReduxReducer<MainState>(
            {
                text: createInitialTextState(),
                svg: createInitialSvgState(),
                hovered: null,
            },
            (builder) => {
                createTextReducer(builder);
                createSvgReducer(builder);
            },
        ),
    });

export default createReducer;
