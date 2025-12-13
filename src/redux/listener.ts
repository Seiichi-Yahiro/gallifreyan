import type { AppState } from '@/redux/store';
import { setupSvgListeners } from '@/redux/svg/svgListeners';
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

    setupSvgListeners(middleware.startListening);

    return middleware;
};

export default setupListenerMiddleware;
