import svgSlice from '@/redux/slices/svgSlice';
import textSlice from '@/redux/slices/textSlice';
import uiSlice, { uiActions } from '@/redux/slices/uiSlice';
import {
    configureStore,
    type ThunkAction,
    type UnknownAction,
} from '@reduxjs/toolkit';

export const setupStore = () => {
    return configureStore({
        reducer: {
            text: textSlice,
            svg: svgSlice,
            ui: uiSlice,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
        devTools: { actionsDenylist: [uiActions.setHover.type] },
    });
};

export type AppStore = ReturnType<typeof setupStore>;

export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunkAction<R = void> = ThunkAction<
    R,
    AppState,
    unknown,
    UnknownAction
>;
