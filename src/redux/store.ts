import setupListenerMiddleware from '@/redux/listener';
import createReducer from '@/redux/reducer';
import { configureStore } from '@reduxjs/toolkit';

export const setupStore = () => {
    return configureStore({
        reducer: createReducer(),
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ thunk: false }).prepend(
                setupListenerMiddleware().middleware,
            ),
    });
};

export type AppStore = ReturnType<typeof setupStore>;

export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch']; // TODO type inference doesn't work
