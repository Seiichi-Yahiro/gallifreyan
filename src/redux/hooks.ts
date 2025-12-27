import type { AppDispatch, AppState } from '@/redux/store';
import { createSelectorCreator, weakMapMemoize } from '@reduxjs/toolkit';
import {
    type TypedUseSelectorHook,
    useDispatch,
    useSelector,
} from 'react-redux';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useRedux: TypedUseSelectorHook<AppState> = useSelector;

const createSelectorWeakMap = createSelectorCreator({
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
});

export const createReduxSelector = createSelectorWeakMap.withTypes<AppState>();
