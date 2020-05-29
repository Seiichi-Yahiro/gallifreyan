import { createActionCreator, createReducer } from 'deox';
import { produce } from 'immer';
import { UUID } from './ImageTypes';

export interface WorkStore {
    selection?: UUID;
    hovering?: UUID;
}

const defaultState: WorkStore = {};

export const setHoveringAction = createActionCreator('SET_HOVERING', (resolve) => (uuid?: UUID) => resolve(uuid));
export const setSelectionAction = createActionCreator('SET_SELECTION', (resolve) => (uuid?: UUID) => resolve(uuid));

export const workStoreReducer = createReducer(defaultState, (handle) => [
    handle(setHoveringAction, (state, { payload }) =>
        produce(state, (draft) => {
            draft.hovering = payload;
        })
    ),
    handle(setSelectionAction, (state, { payload }) =>
        produce(state, (draft) => {
            draft.selection = payload;
        })
    ),
]);
