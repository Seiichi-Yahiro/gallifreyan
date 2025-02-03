import {
    createInitialSvgState,
    createSvgReducer,
    type SvgState,
} from '@/redux/svg/svgReducer';
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
}

const createReducer = () =>
    combineReducers({
        main: createReduxReducer(
            {
                text: createInitialTextState(),
                svg: createInitialSvgState(),
            } satisfies MainState,
            (builder) => {
                createTextReducer(builder);
                createSvgReducer(builder);
            },
        ),
    });

export default createReducer;
