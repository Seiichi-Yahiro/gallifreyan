import {
    historyActions,
    type HistoryState,
} from '@/redux/history/history.slice';
import type { AppState, AppThunkAction } from '@/redux/store';

const extractHistoryState = (state: AppState): HistoryState => {
    return {
        text: {
            value: state.text.value,
            rootElement: state.text.rootElement,
            elements: state.text.elements,
        },
        svg: {
            settings: {
                size: state.svg.settings.size,
            },
            circles: state.svg.circles,
            lineSlots: state.svg.lineSlots,
        },
        interaction: {
            hovered: state.interaction.hovered,
            selected: state.interaction.selected,
            dragging: state.interaction.dragging,
        },
    };
};

const undo = (): AppThunkAction => (dispatch, getState) => {
    const state = getState();

    if (state.history.past.length === 0) {
        return;
    }

    dispatch(
        historyActions.undo({
            store: extractHistoryState(state),
            load: state.history.past[state.history.past.length - 1],
        }),
    );
};

const redo = (): AppThunkAction => (dispatch, getState) => {
    const state = getState();

    if (state.history.future.length === 0) {
        return;
    }

    dispatch(
        historyActions.redo({
            store: extractHistoryState(state),
            load: state.history.future[0],
        }),
    );
};

const save = (): AppThunkAction => (dispatch, getState) => {
    const state = getState();
    const historyState = extractHistoryState(state);
    dispatch(historyActions.save(historyState));
};

const historyThunks = {
    undo,
    redo,
    save,
};

export default historyThunks;
