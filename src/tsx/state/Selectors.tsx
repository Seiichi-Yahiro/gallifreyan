import { useMemo } from 'react';
import { createSelector } from 'reselect';
import { useRedux } from './AppStore';
import { AppStoreState, UUID } from './StateTypes';

const createIsHoveredSelector = () =>
    createSelector(
        (state: AppStoreState) => state.hovering,
        (_state: AppStoreState, id: UUID) => id,
        (hovering, id) => hovering.map((it) => it === id).unwrapOr(false)
    );
export const useIsHoveredSelector = (id: UUID) => {
    const selector = useMemo(createIsHoveredSelector, []);
    return useRedux((state) => selector(state, id));
};
