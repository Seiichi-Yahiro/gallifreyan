import { resetIdCounters } from '@/redux/ids';
import { settingsActions } from '@/redux/settings/settings.slice';
import { type AppStore, setupStore } from '@/redux/store';
import {
    ConsonantValue,
    DigraphValue,
    LetterDecoration,
    LetterPlacement,
    LetterType,
    VocalValue,
} from '@/redux/text/letter.types';
import { textActions } from '@/redux/text/text.slice';
import textThunks from '@/redux/text/text.thunks';
import { spyOnAction } from 'test/testHelpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('text', () => {
    let store: AppStore;

    beforeEach(() => {
        store = setupStore();
    });

    afterEach(() => {
        resetIdCounters();
        vi.restoreAllMocks();
    });

    it('should have initial state', () => {
        const state = store.getState();
        expect(state.text).toStrictEqual({
            value: '',
            rootElement: null,
            elements: {},
        });
    });

    it('should set the text', () => {
        store.dispatch(textThunks.setText('text'));
        const state = store.getState();
        expect(state.text.value).toBe('text');
    });

    it('should create the text tree', () => {
        store.dispatch(textThunks.setText('what ni'));

        const state = store.getState();

        expect(state.text.rootElement).toBe('SNT-0');

        expect(state.text.elements).toMatchObject({
            'SNT-0': {
                text: 'what ni',
                words: ['WRD-0', 'WRD-1'],
            },
            'WRD-0': {
                id: 'WRD-0',
                parent: 'SNT-0',
                text: 'what',
                letters: ['LTR-0', 'LTR-1', 'LTR-2'],
            },
            'WRD-1': {
                id: 'WRD-1',
                parent: 'SNT-0',
                text: 'ni',
                letters: ['LTR-3', 'LTR-4'],
            },
            'LTR-0': {
                id: 'LTR-0',
                parent: 'WRD-0',
                text: 'wh',
                letter: {
                    value: DigraphValue.WH,
                },
                dots: ['DOT-0'],
                lineSlots: [],
            },
            'LTR-1': {
                id: 'LTR-1',
                parent: 'WRD-0',
                text: 'a',
                letter: {
                    value: VocalValue.A,
                },
                dots: [],
                lineSlots: [],
            },
            'LTR-2': {
                id: 'LTR-2',
                parent: 'WRD-0',
                text: 't',
                letter: {
                    value: ConsonantValue.T,
                },
                dots: [],
                lineSlots: [],
            },
            'LTR-3': {
                id: 'LTR-3',
                parent: 'WRD-1',
                text: 'n',
                letter: {
                    value: ConsonantValue.N,
                },
                dots: [],
                lineSlots: ['LNS-0'],
            },
            'LTR-4': {
                id: 'LTR-4',
                parent: 'WRD-1',
                text: 'i',
                letter: {
                    value: VocalValue.I,
                },
                dots: [],
                lineSlots: ['LNS-1'],
            },
            'DOT-0': {
                id: 'DOT-0',
                parent: 'LTR-0',
            },
            'LNS-0': {
                id: 'LNS-0',
                parent: 'LTR-3',
            },
            'LNS-1': {
                id: 'LNS-1',
                parent: 'LTR-4',
            },
        });
    });

    it('should not change the text tree when text is equal', () => {
        store.dispatch(textThunks.setText('this that'));
        const stateBefore = store.getState();

        const updateSentenceTextSpy = spyOnAction(
            textActions,
            'updateSentenceText',
        );
        const updateWordTextSpy = spyOnAction(textActions, 'updateWordText');
        const updateLetterTextSpy = spyOnAction(
            textActions,
            'updateLetterText',
        );

        store.dispatch(textThunks.setText('this that'));
        const stateAfter = store.getState();

        expect(stateBefore.text).toStrictEqual(stateAfter.text);

        expect(updateSentenceTextSpy).toHaveBeenCalledTimes(0);
        expect(updateWordTextSpy).toHaveBeenCalledTimes(0);
        expect(updateLetterTextSpy).toHaveBeenCalledTimes(0);
    });

    it('should not create the text tree when sanitized text is empty', () => {
        store.dispatch(textThunks.setText('äöü'));

        const state = store.getState();

        expect(state.text.rootElement).toBeNull();
        expect(state.text.elements).toStrictEqual({});
    });

    it('should delete the text tree', () => {
        store.dispatch(textThunks.setText('this that'));
        store.dispatch(textThunks.setText(''));

        const state = store.getState();

        expect(state.text.rootElement).toBeNull();
        expect(state.text.elements).toStrictEqual({});
    });

    it('should add word', () => {
        store.dispatch(textThunks.setText('this that'));
        store.dispatch(textThunks.setText('this and that'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'SNT-0': {
                text: 'this and that',
                words: ['WRD-0', 'WRD-1', 'WRD-2'],
            },
            'WRD-0': {
                text: 'this',
            },
            'WRD-1': {
                text: 'and',
            },
            'WRD-2': {
                text: 'that',
            },
        });
    });

    it('should remove word', () => {
        store.dispatch(textThunks.setText('this and that'));
        store.dispatch(textThunks.setText('this that'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'SNT-0': {
                text: 'this that',
                words: ['WRD-0', 'WRD-1'],
            },
            'WRD-0': {
                text: 'this',
            },
            'WRD-1': {
                text: 'that',
            },
        });

        expect(state.text.elements['WRD-2']).toBeUndefined();
    });

    it('should remove word children', () => {
        store.dispatch(textThunks.setText('this that'));
        store.dispatch(textThunks.setText('this'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'WRD-0': {
                text: 'this',
            },
            'LTR-0': {
                text: 'th',
            },
            'LTR-1': {
                text: 'i',
            },
            'LTR-2': {
                text: 's',
            },
        });

        expect(state.text.elements['WRD-1']).toBeUndefined();
        expect(state.text.elements['LTR-3']).toBeUndefined();
        expect(state.text.elements['LTR-4']).toBeUndefined();
        expect(state.text.elements['LTR-5']).toBeUndefined();
    });

    it('should update word', () => {
        store.dispatch(textThunks.setText('this that'));
        store.dispatch(textThunks.setText('that this'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'SNT-0': {
                text: 'that this',
                words: ['WRD-0', 'WRD-1'],
            },
            'WRD-0': {
                text: 'that',
            },
            'WRD-1': {
                text: 'this',
            },
        });
    });

    it('should add letter', () => {
        store.dispatch(textThunks.setText('b'));
        store.dispatch(textThunks.setText('bj'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'WRD-0': {
                text: 'bj',
                letters: ['LTR-0', 'LTR-1'],
            },
            'LTR-0': {
                text: 'b',
            },
            'LTR-1': {
                text: 'j',
            },
        });
    });

    it('should remove letter', () => {
        store.dispatch(textThunks.setText('bj'));
        store.dispatch(textThunks.setText('b'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'WRD-0': {
                text: 'b',
                letters: ['LTR-0'],
            },
            'LTR-0': {
                text: 'b',
            },
        });

        expect(state.text.elements['LTR-1']).toBeUndefined();
    });

    it('should remove letter dots', () => {
        store.dispatch(textThunks.setText('bk'));
        store.dispatch(textThunks.setText('b'));

        const state = store.getState();

        expect(state.text.elements['LTR-1']).toBeUndefined();
        expect(state.text.elements['DOT-0']).toBeUndefined();
        expect(state.text.elements['DOT-1']).toBeUndefined();
    });

    it('should remove letter line slots', () => {
        store.dispatch(textThunks.setText('bh'));
        store.dispatch(textThunks.setText('b'));

        const state = store.getState();

        expect(state.text.elements['LTR-1']).toBeUndefined();
        expect(state.text.elements['LNS-0']).toBeUndefined();
        expect(state.text.elements['LNS-1']).toBeUndefined();
    });

    it('should update letter', () => {
        store.dispatch(textThunks.setText('bj'));
        store.dispatch(textThunks.setText('tj'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'WRD-0': {
                text: 'tj',
                letters: ['LTR-0', 'LTR-1'],
            },
            'LTR-0': {
                text: 't',
            },
            'LTR-1': {
                text: 'j',
            },
        });
    });

    it('should add dot', () => {
        store.dispatch(textThunks.setText('bk'));
        store.dispatch(textThunks.setText('bc'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'LTR-1': {
                text: 'c',
                dots: ['DOT-0', 'DOT-1', 'DOT-2', 'DOT-3'],
            },
            'DOT-0': {
                parent: 'LTR-1',
            },
            'DOT-1': {
                parent: 'LTR-1',
            },
            'DOT-2': {
                parent: 'LTR-1',
            },
            'DOT-3': {
                parent: 'LTR-1',
            },
        });
    });

    it('should remove dot', () => {
        store.dispatch(textThunks.setText('bl'));
        store.dispatch(textThunks.setText('bk'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'LTR-1': {
                text: 'k',
                dots: ['DOT-0', 'DOT-1'],
            },
            'DOT-0': {
                parent: 'LTR-1',
            },
            'DOT-1': {
                parent: 'LTR-1',
            },
        });

        expect(state.text.elements['DOT-2']).toBeUndefined();
    });

    it('should remain dots', () => {
        store.dispatch(textThunks.setText('bk'));
        store.dispatch(textThunks.setText('br'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'LTR-1': {
                text: 'r',
                dots: ['DOT-0', 'DOT-1', 'DOT-2'],
            },
            'DOT-0': {
                parent: 'LTR-1',
            },
            'DOT-1': {
                parent: 'LTR-1',
            },
            'DOT-2': {
                parent: 'LTR-1',
            },
        });
    });

    it('should add line slot', () => {
        store.dispatch(textThunks.setText('bh'));
        store.dispatch(textThunks.setText('bf'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'LTR-1': {
                text: 'f',
                lineSlots: ['LNS-0', 'LNS-1', 'LNS-2'],
            },
            'LNS-0': {
                parent: 'LTR-1',
            },
            'LNS-1': {
                parent: 'LTR-1',
            },
            'LNS-2': {
                parent: 'LTR-1',
            },
        });
    });

    it('should remove line slot', () => {
        store.dispatch(textThunks.setText('bf'));
        store.dispatch(textThunks.setText('bh'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'LTR-1': {
                text: 'h',
                lineSlots: ['LNS-0', 'LNS-1'],
            },
            'LNS-0': {
                parent: 'LTR-1',
            },
            'LNS-1': {
                parent: 'LTR-1',
            },
        });

        expect(state.text.elements['LNS-2']).toBeUndefined();
    });

    it('should remain line slots', () => {
        store.dispatch(textThunks.setText('bf'));
        store.dispatch(textThunks.setText('bm'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'LTR-1': {
                text: 'm',
                lineSlots: ['LNS-0', 'LNS-1', 'LNS-2'],
            },
            'LNS-0': {
                parent: 'LTR-1',
            },
            'LNS-1': {
                parent: 'LTR-1',
            },
            'LNS-2': {
                parent: 'LTR-1',
            },
        });
    });

    it('should merge consonants to a digraph', () => {
        store.dispatch(
            settingsActions.setSplitLetterOptions({ digraphs: false }),
        );
        store.dispatch(textThunks.setText('sh'));

        store.dispatch(textThunks.mergeToDigraph('LTR-0', 'LTR-1'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'WRD-0': {
                letters: ['LTR-0'],
            },
            'LTR-0': {
                text: 'sh',
                letter: {
                    letterType: LetterType.Digraph,
                    value: DigraphValue.SH,
                    decoration: LetterDecoration.DoubleDot,
                    placement: LetterPlacement.ShallowCut,
                },
                dots: ['DOT-0', 'DOT-1'],
                lineSlots: [],
            },
        });

        expect(state.text.elements['LTR-1']).toBeUndefined();
        expect(
            Object.keys(state.text.elements).some((id) => id.startsWith('LNS')),
        ).toBeFalsy();
    });

    it('should split digraph to letters', () => {
        store.dispatch(
            settingsActions.setSplitLetterOptions({ digraphs: true }),
        );
        store.dispatch(textThunks.setText('qu'));

        store.dispatch(textThunks.splitDigraph('LTR-0'));

        const state = store.getState();

        expect(state.text.elements).toMatchObject({
            'WRD-0': {
                letters: ['LTR-0', 'LTR-1'],
            },
            'LTR-0': {
                text: 'q',
                letter: {
                    letterType: LetterType.Consonant,
                    value: ConsonantValue.Q,
                    decoration: LetterDecoration.QuadrupleDot,
                    placement: LetterPlacement.OnLine,
                },
                dots: ['DOT-0', 'DOT-1', 'DOT-2', 'DOT-3'],
                lineSlots: [],
            },
            'LTR-1': {
                text: 'u',
                letter: {
                    letterType: LetterType.Vocal,
                    value: VocalValue.U,
                    decoration: LetterDecoration.LineOutside,
                    placement: LetterPlacement.OnLine,
                },
                dots: [],
                lineSlots: ['LNS-1'],
            },
            'DOT-0': {},
            'DOT-1': {},
            'DOT-2': {},
            'DOT-3': {},
            'LNS-1': {},
        });

        expect(state.text.elements['LNS-0']).toBeUndefined();
    });
});
