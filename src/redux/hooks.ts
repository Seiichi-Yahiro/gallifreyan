import type { AppDispatch, AppState } from '@/redux/store';
import { createSelectorCreator, weakMapMemoize } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useRedux = useSelector.withTypes<AppState>();

const createSelectorWeakMap = createSelectorCreator({
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
});

export const createReduxSelector = createSelectorWeakMap.withTypes<AppState>();
