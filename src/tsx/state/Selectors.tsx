import { useMemo } from 'react';
import { createSelector } from 'reselect';
import { useRedux } from '../hooks/useRedux';
import { AppState } from './AppState';
import { CircleShape, UUID } from './image/ImageTypes';

const createIsHoveredSelector = () =>
    createSelector(
        (state: AppState, id: UUID) => state.work.hovering === id,
        (isHovering) => isHovering
    );
export const useIsHoveredSelector = (id: UUID) => {
    const selector = useMemo(createIsHoveredSelector, []);
    return useRedux((state) => selector(state, id));
};

const createIsSelectedSelector = () =>
    createSelector(
        (state: AppState, id: UUID) => state.work.selection?.id === id,
        (isSelected) => isSelected
    );
export const useIsSelectedSelector = (id: UUID) => {
    const selector = useMemo(createIsSelectedSelector, []);
    return useRedux((state) => selector(state, id));
};

const createCircleSelector = <T extends CircleShape>() =>
    createSelector(
        (state: AppState, id: UUID) => state.image.circles[id] as T,
        createIsSelectedSelector(),
        createIsHoveredSelector(),
        (circle, isSelected, isHovered) => ({
            circle,
            isSelected,
            isHovered,
        })
    );
export const useCircleSelector = <T extends CircleShape>(id: UUID) => {
    const selector = useMemo(() => createCircleSelector<T>(), []);
    return useRedux((state) => selector(state, id));
};
