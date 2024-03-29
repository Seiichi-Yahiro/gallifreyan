import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import imageReducer from './image/ImageReducer';
import svgPanZoomReducer from './svgPanZoom/SvgPanZoomReducer';
import settingsReducer from './settings/SettingsReducer';
import workReducer from './work/WorkReducer';

export const reducer = {
    svgPanZoom: svgPanZoomReducer,
    image: imageReducer,
    work: workReducer,
    settings: settingsReducer,
};

export const store = configureStore({
    reducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkAction = ThunkAction<void, AppState, null | undefined, AnyAction>;
