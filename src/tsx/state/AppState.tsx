import { configureStore } from '@reduxjs/toolkit';
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
