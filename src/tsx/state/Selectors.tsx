import { useMemo } from 'react';
import { createSelector } from 'reselect';
import { useRedux } from '../hooks/useRedux';
import { AppState } from './AppState';
import { UUID } from './image/ImageTypes';

const createIsHoveredSelector = () =>
    createSelector(
        (state: AppState) => state.work.hovering,
        (_state: AppState, id: UUID) => id,
        (hovering, id) => hovering === id
    );
export const useIsHoveredSelector = (id: UUID) => {
    const selector = useMemo(createIsHoveredSelector, []);
    return useRedux((state) => selector(state, id));
};

const createIsSelectedSelector = () =>
    createSelector(
        (state: AppState) => state.work.selection,
        (_state: AppState, id: UUID) => id,
        (selection, id) => selection?.id === id
    );
export const useIsSelectedSelector = (id: UUID) => {
    const selector = useMemo(createIsSelectedSelector, []);
    return useRedux((state) => selector(state, id));
};
