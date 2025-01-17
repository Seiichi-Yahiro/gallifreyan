import type { AppDispatch, AppState } from '@/redux/store';
import {
    createListenerMiddleware,
    type TypedAddListener,
    type TypedStartListening,
} from '@reduxjs/toolkit';

export type AppStartListening = TypedStartListening<AppState, AppDispatch>;
export type AppAddListener = TypedAddListener<AppState, AppDispatch>;

const setupListenerMiddleware = () => {
    const middleware = createListenerMiddleware();

    // TODO

    return middleware;
};

export default setupListenerMiddleware;
