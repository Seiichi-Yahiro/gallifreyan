import historySlice from '@/redux/slices/historySlice';
import interactionSlice, {
    interactionActions,
} from '@/redux/slices/interactionSlice';
import settingsSlice from '@/redux/slices/settingsSlice';
import svgSlice from '@/redux/slices/svgSlice';
import textSlice from '@/redux/slices/textSlice';
import {
    combineReducers,
    configureStore,
    type ThunkAction,
    type UnknownAction,
} from '@reduxjs/toolkit';

const reducer = combineReducers({
    settings: settingsSlice,
    text: textSlice,
    svg: svgSlice,
    interaction: interactionSlice,
    history: historySlice,
});

export const setupStore = (preloadedState?: AppState) => {
    return configureStore({
        preloadedState,
        reducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
        devTools: { actionsDenylist: [interactionActions.setHover.type] },
    });
};

export type AppStore = ReturnType<typeof setupStore>;

export type AppState = ReturnType<typeof reducer>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunkAction<R = void> = ThunkAction<
    R,
    AppState,
    unknown,
    UnknownAction
>;
