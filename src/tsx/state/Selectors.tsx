import { useMemo } from 'react';
import { createSelector } from 'reselect';
import { useRedux } from './AppStore';
import { AppStoreState, UUID } from './StateTypes';

const createIsHoveredSelector = () =>
    createSelector(
        (state: AppStoreState) => state.hovering,
        (_state: AppStoreState, id: UUID) => id,
        (hovering, id) => hovering.contains(id)
    );
export const useIsHoveredSelector = (id: UUID) => {
    const selector = useMemo(createIsHoveredSelector, []);
    return useRedux((state) => selector(state, id));
};

const createIsSelectedSelector = () =>
    createSelector(
        (state: AppStoreState) => state.selection,
        (_state: AppStoreState, id: UUID) => id,
        (selection, id) => selection.contains(id)
    );
export const useIsSelectedSelector = (id: UUID) => {
    const selector = useMemo(createIsSelectedSelector, []);
    return useRedux((state) => selector(state, id));
};
