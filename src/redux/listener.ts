import type { AppState } from '@/redux/store';
import {
    createListenerMiddleware,
    type ThunkDispatch,
    type TypedAddListener,
    type TypedStartListening,
    type UnknownAction,
} from '@reduxjs/toolkit';

export type AppStartListening = TypedStartListening<
    AppState,
    ThunkDispatch<AppState, unknown, UnknownAction>
>;

export type AppAddListener = TypedAddListener<
    AppState,
    ThunkDispatch<AppState, unknown, UnknownAction>
>;

const setupListenerMiddleware = () => {
    const middleware = createListenerMiddleware();
    return middleware;
};

export default setupListenerMiddleware;
