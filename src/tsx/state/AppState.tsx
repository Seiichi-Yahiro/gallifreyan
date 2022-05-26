import { AnyAction, configureStore, Dispatch, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import imageReducer, { ImageState } from './image/ImageReducer';
import svgPanZoomReducer, { SvgPanZoomState } from './svgPanZoom/SvgPanZoomReducer';
import workReducer, { WorkState } from './work/WorkReducer';

export interface AppState {
    svgPanZoom: SvgPanZoomState;
    image: ImageState;
    work: WorkState;
}

export const createStore = (preloadedState?: Partial<AppState>) =>
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
