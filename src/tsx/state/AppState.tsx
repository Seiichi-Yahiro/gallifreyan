import { AnyAction, configureStore, Dispatch, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import imageReducer, { ImageState } from './image/ImageReducer';
import svgPanZoomReducer, { SvgPanZoomState } from './svgPanZoom/SvgPanZoomReducer';
import themeReducer, { ThemeState } from './theme/ThemeReducer';
import workReducer, { WorkState } from './work/WorkReducer';

export interface AppState {
    svgPanZoom: SvgPanZoomState;
    image: ImageState;
    work: WorkState;
    theme: ThemeState;
}

export const createStore = (preloadedState?: Partial<AppState>) =>
    configureStore<AppState>({
        reducer: {
            svgPanZoom: svgPanZoomReducer,
            image: imageReducer,
            work: workReducer,
            theme: themeReducer,
        },
        preloadedState,
    });

export type AppThunkDispatch = ThunkDispatch<AppState, null | undefined, AnyAction>;
export type AppDispatch = AppThunkDispatch & Dispatch<AnyAction>;
export type AppThunkAction = ThunkAction<void, AppState, null | undefined, AnyAction>;
