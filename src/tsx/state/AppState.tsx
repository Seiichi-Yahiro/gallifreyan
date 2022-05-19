import { AnyAction, configureStore, Dispatch, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import imageReducer, { ImageState } from './ImageState';
import svgPanZoomReducer, { SvgPanZoomState } from './SvgPanZoomState';
import workReducer, { WorkState } from './WorkState';

export interface AppState {
    svgPanZoom: SvgPanZoomState;
    image: ImageState;
    work: WorkState;
}

export const createStore = (preloadedState?: AppState) =>
    configureStore<AppState>({
        reducer: {
            svgPanZoom: svgPanZoomReducer,
            image: imageReducer,
            work: workReducer,
        },
        preloadedState,
    });

export type AppThunkDispatch = ThunkDispatch<AppState, null | undefined, AnyAction>;
export type AppDispatch = AppThunkDispatch & Dispatch<AnyAction>;
export type AppThunkAction = ThunkAction<void, AppState, null | undefined, AnyAction>;
