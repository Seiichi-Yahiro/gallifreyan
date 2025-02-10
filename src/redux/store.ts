import setupListenerMiddleware from '@/redux/listener';
import createReducer from '@/redux/reducer';
import svgActions from '@/redux/svg/svgActions';
import {
    configureStore,
    type ThunkAction,
    type UnknownAction,
} from '@reduxjs/toolkit';

export const setupStore = () => {
    return configureStore({
        reducer: createReducer(),
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().prepend(
                setupListenerMiddleware().middleware,
            ),
        devTools: { actionsDenylist: [svgActions.setHover.type] },
    });
};

export type AppStore = ReturnType<typeof setupStore>;

export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch']; // TODO type inference doesn't work
export type AppThunkAction<R = void> = ThunkAction<
    R,
    AppState,
    unknown,
    UnknownAction
>;
