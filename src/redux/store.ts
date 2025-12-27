import historySlice from '@/redux/history/historySlice';
import interactionSlice, {
    interactionActions,
} from '@/redux/interactions/interactionSlice';
import settingsSlice from '@/redux/settings/settingsSlice';
import svgSlice from '@/redux/svg/svgSlice';
import textSlice from '@/redux/text/textSlice';
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

export const setupStore = (preloadedState?: Partial<AppState>) => {
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
