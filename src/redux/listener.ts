import type { AppDispatch, AppState } from '@/redux/store';
import { setupTextListeners } from '@/redux/text/textListeners';
import {
    createListenerMiddleware,
    type TypedAddListener,
    type TypedStartListening,
} from '@reduxjs/toolkit';

export type AppStartListening = TypedStartListening<AppState, AppDispatch>;
export type AppAddListener = TypedAddListener<AppState, AppDispatch>;

const setupListenerMiddleware = () => {
    const middleware = createListenerMiddleware();

    setupTextListeners(middleware.startListening);

    return middleware;
};

export default setupListenerMiddleware;
