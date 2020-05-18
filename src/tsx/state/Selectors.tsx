import { useMemo } from 'react';
import { createSelector } from 'reselect';
import { useRedux } from './AppStore';
import { AppStoreState, LineSlot, UUID } from './StateTypes';

const createLineSlotSelector = () =>
    createSelector(
        (state: AppStoreState) => state.lineSlots,
        (_state: AppStoreState, slotIds: UUID[]) => slotIds,
        (lineSlots, ids) => ids.map((id) => lineSlots[id])
    );
export const useLineSlotSelector = (lineSlotIds: UUID[]): LineSlot[] => {
    const selector = useMemo(createLineSlotSelector, []);
    return useRedux((state) => selector(state, lineSlotIds));
};
