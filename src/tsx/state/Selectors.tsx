import { useMemo } from 'react';
import { createSelector } from 'reselect';
import { useRedux } from '../hooks/useRedux';
import { AppStore } from './AppStore';
import { UUID } from './ImageTypes';

const createIsHoveredSelector = () =>
    createSelector(
        (state: AppStore) => state.work.hovering,
        (_state: AppStore, id: UUID) => id,
        (hovering, id) => hovering === id
    );
export const useIsHoveredSelector = (id: UUID) => {
    const selector = useMemo(createIsHoveredSelector, []);
    return useRedux((state) => selector(state, id));
};

const createIsSelectedSelector = () =>
    createSelector(
        (state: AppStore) => state.work.selection,
        (_state: AppStore, id: UUID) => id,
        (selection, id) => selection === id
    );
export const useIsSelectedSelector = (id: UUID) => {
    const selector = useMemo(createIsSelectedSelector, []);
    return useRedux((state) => selector(state, id));
};
