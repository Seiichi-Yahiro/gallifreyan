import mAngle from '@/math/angle';
import type { HistoryState } from '@/redux/history/history.slice';
import historyThunks from '@/redux/history/history.thunks';
import { resetIdCounters } from '@/redux/ids';
import { createInitialInteractionState } from '@/redux/interactions/interaction.slice';
import { createInitialSettingsSate } from '@/redux/settings/settings.slice';
import { type AppStore, setupStore } from '@/redux/store';
import textThunks from '@/redux/text/text.thunks';
import { TextElementType } from '@/redux/text/text.types';
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
                interaction: states[0].interaction,
            },
            {
                text: states[1].text,
                svg: states[1].svg,
                interaction: states[1].interaction,
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
                        radius: 1,
                        position: {
                            angle: mAngle.radian(0),
                            distance: 0,
                        },
                    },
                },
                lineSlots: {},
            },
            interaction: createInitialInteractionState(),
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
                        radius: 10,
                        position: {
                            angle: mAngle.toRadian(mAngle.degree(10)),
                            distance: 10,
                        },
                    },
                },
                lineSlots: {},
            },
            interaction: createInitialInteractionState(),
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
            interaction: createInitialInteractionState(),
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
        expect(state.interaction).toStrictEqual(past1.interaction);

        expect(state.history.future).toStrictEqual([
            {
                text: present.text,
                svg: present.svg,
                interaction: present.interaction,
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
                        radius: 1,
                        position: {
                            angle: mAngle.radian(0),
                            distance: 0,
                        },
                    },
                },
                lineSlots: {},
            },
            interaction: createInitialInteractionState(),
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
                        radius: 10,
                        position: {
                            angle: mAngle.toRadian(mAngle.degree(10)),
                            distance: 10,
                        },
                    },
                },
                lineSlots: {},
            },
            interaction: createInitialInteractionState(),
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
            interaction: createInitialInteractionState(),
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
        expect(state.interaction).toStrictEqual(future.interaction);

        expect(state.history.future).toStrictEqual([]);
    });

    it('should not redo when future is empty', () => {
        const state = store.getState();
        store.dispatch(historyThunks.redo());
        expect(store.getState()).toStrictEqual(state);
    });
});
