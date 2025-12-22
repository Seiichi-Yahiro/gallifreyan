import mAngle from '@/math/angle';
import { resetIdCounters } from '@/redux/ids';
import type { HistoryState } from '@/redux/slices/historySlice';
import { createInitialSettingsSate } from '@/redux/slices/settingsSlice';
import { createInitialUiState } from '@/redux/slices/uiSlice';
import { type AppStore, setupStore } from '@/redux/store';
import historyThunks from '@/redux/thunks/historyThunks';
import textThunks from '@/redux/thunks/textThunks';
import { TextElementType } from '@/redux/types/textTypes';
import { range } from 'es-toolkit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('history', () => {
    let store: AppStore;

    beforeEach(() => {
        store = setupStore();
    });

    afterEach(() => {
        resetIdCounters();
    });

    it('should create history entries', () => {
        const states = [store.getState()];

        store.dispatch(historyThunks.save());
        store.dispatch(textThunks.setText('text'));
        states.push(store.getState());

        store.dispatch(historyThunks.save());
        store.dispatch(textThunks.setText('txet'));

        const state = store.getState();

        expect(state.history.past).toStrictEqual([
            {
                text: states[0].text,
                svg: states[0].svg,
                ui: states[0].ui,
            },
            {
                text: states[1].text,
                svg: states[1].svg,
                ui: states[1].ui,
            },
        ]);

        expect(state.history.future).toHaveLength(0);
    });

    it('should have a max history size', () => {
        range(100).forEach(() => {
            store.dispatch(historyThunks.save());
        });

        expect(store.getState().history.past).toHaveLength(30);
    });

    it('should undo', () => {
        const past0: HistoryState = {
            text: {
                value: '',
                rootElement: null,
                elements: {
                    ['SNT-0']: {
                        elementType: TextElementType.Sentence,
                        id: 'SNT-0',
                        text: '',
                        words: [],
                    },
                },
            },
            svg: {
                size: 1000,
                circles: {
                    ['SNT-0']: {
                        type: TextElementType.Sentence,
                        radius: 1,
                        position: {
                            angle: mAngle.radian(0),
                            distance: 0,
                        },
                    },
                },
                lineSlots: {},
            },
            ui: createInitialUiState(),
        };

        const past1: HistoryState = {
            text: {
                value: 'b',
                rootElement: null,
                elements: {
                    ['SNT-0']: {
                        elementType: TextElementType.Sentence,
                        id: 'SNT-0',
                        text: 'b',
                        words: [],
                    },
                },
            },
            svg: {
                size: 1000,
                circles: {
                    ['SNT-0']: {
                        type: TextElementType.Sentence,
                        radius: 10,
                        position: {
                            angle: mAngle.toRadian(mAngle.degree(10)),
                            distance: 10,
                        },
                    },
                },
                lineSlots: {},
            },
            ui: createInitialUiState(),
        };

        const present = {
            text: {
                value: '',
                rootElement: null,
                elements: {},
            },
            svg: {
                size: 1000,
                circles: {},
                lineSlots: {},
            },
            ui: createInitialUiState(),
        };

        store = setupStore({
            ...present,
            settings: createInitialSettingsSate(),
            history: {
                past: [past0, past1],
                future: [],
            },
        });

        store.dispatch(historyThunks.undo());

        const state = store.getState();

        expect(state.history.past).toStrictEqual([past0]);

        expect(state.text).toStrictEqual(past1.text);
        expect(state.svg).toStrictEqual(past1.svg);
        expect(state.ui).toStrictEqual(past1.ui);

        expect(state.history.future).toStrictEqual([
            {
                text: present.text,
                svg: present.svg,
                ui: present.ui,
            },
        ]);
    });

    it('should not undo when past is empty', () => {
        const state = store.getState();
        store.dispatch(historyThunks.undo());
        expect(store.getState()).toStrictEqual(state);
    });

    it('should redo', () => {
        const past: HistoryState = {
            text: {
                value: '',
                rootElement: null,
                elements: {
                    ['SNT-0']: {
                        elementType: TextElementType.Sentence,
                        id: 'SNT-0',
                        text: '',
                        words: [],
                    },
                },
            },
            svg: {
                size: 1000,
                circles: {
                    ['SNT-0']: {
                        type: TextElementType.Sentence,
                        radius: 1,
                        position: {
                            angle: mAngle.radian(0),
                            distance: 0,
                        },
                    },
                },
                lineSlots: {},
            },
            ui: createInitialUiState(),
        };

        const present: HistoryState = {
            text: {
                value: 'b',
                rootElement: null,
                elements: {
                    ['SNT-0']: {
                        elementType: TextElementType.Sentence,
                        id: 'SNT-0',
                        text: 'b',
                        words: [],
                    },
                },
            },
            svg: {
                size: 1000,
                circles: {
                    ['SNT-0']: {
                        type: TextElementType.Sentence,
                        radius: 10,
                        position: {
                            angle: mAngle.toRadian(mAngle.degree(10)),
                            distance: 10,
                        },
                    },
                },
                lineSlots: {},
            },
            ui: createInitialUiState(),
        };

        const future = {
            text: {
                value: '',
                rootElement: null,
                elements: {},
            },
            svg: {
                size: 1000,
                circles: {},
                lineSlots: {},
            },
            ui: createInitialUiState(),
        };

        store = setupStore({
            ...present,
            settings: createInitialSettingsSate(),
            history: {
                past: [past],
                future: [future],
            },
        });

        store.dispatch(historyThunks.redo());

        const state = store.getState();

        expect(state.history.past).toStrictEqual([past, present]);

        expect(state.text).toStrictEqual(future.text);
        expect(state.svg).toStrictEqual(future.svg);
        expect(state.ui).toStrictEqual(future.ui);

        expect(state.history.future).toStrictEqual([]);
    });

    it('should not redo when future is empty', () => {
        const state = store.getState();
        store.dispatch(historyThunks.redo());
        expect(store.getState()).toStrictEqual(state);
    });
});
