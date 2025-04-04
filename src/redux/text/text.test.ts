import { type AppStore, setupStore } from '@/redux/store';
import { resetIdCounters } from '@/redux/text/ids';
import {
    ConsonantDecoration,
    ConsonantPlacement,
    ConsonantValue,
    DigraphValue,
    LetterType,
    VocalDecoration,
    VocalPlacement,
    VocalValue,
} from '@/redux/text/letterTypes';
import textActions from '@/redux/text/textActions';
import { LetterStackType } from '@/redux/text/textSplitter';
import textThunks from '@/redux/text/textThunks';
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
        expect(state.main.text).toStrictEqual({
            value: '',
            rootElement: null,
            elements: {},
            splitLetterOptions: {
                digraphs: true,
                stackLetters: {
                    stackType: LetterStackType.Value,
                    maxStackSize: 2,
                },
                attachVocals: true,
            },
        });
    });

    it('should set the text', () => {
        store.dispatch(textActions.setText('text'));
        const state = store.getState();
        expect(state.main.text.value).toBe('text');
    });

    it('should create the text tree', () => {
        store.dispatch(textActions.setText('what ni'));

        const state = store.getState();

        expect(state.main.text.rootElement).toBe('SNT-0');

        expect(state.main.text.elements).toMatchObject({
            'SNT-0': {
                text: 'what ni',
                words: ['WRD-0', 'WRD-1'],
            },
            'WRD-0': {
                id: 'WRD-0',
                parent: 'SNT-0',
                text: 'what',
                letters: ['ALG-0', 'LTR-2'],
            },
            'WRD-1': {
                id: 'WRD-1',
                parent: 'SNT-0',
                text: 'ni',
                letters: ['ALG-1'],
            },
            'ALG-0': {
                id: 'ALG-0',
                parent: 'WRD-0',
                letters: ['LTR-0', 'LTR-1'],
            },
            'ALG-1': {
                id: 'ALG-1',
                parent: 'WRD-1',
                letters: ['LTR-3', 'LTR-4'],
            },
            'LTR-0': {
                id: 'LTR-0',
                parent: 'ALG-0',
                text: 'wh',
                letter: {
                    value: DigraphValue.WH,
                },
                dots: ['DOT-0'],
                lineSlots: [],
            },
            'LTR-1': {
                id: 'LTR-1',
                parent: 'ALG-0',
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
                parent: 'ALG-1',
                text: 'n',
                letter: {
                    value: ConsonantValue.N,
                },
                dots: [],
                lineSlots: ['LNS-0'],
            },
            'LTR-4': {
                id: 'LTR-4',
                parent: 'ALG-1',
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
        store.dispatch(textActions.setText('this that'));
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

        store.dispatch(textActions.setText('this that'));
        const stateAfter = store.getState();

        expect(stateBefore.main.text).toStrictEqual(stateAfter.main.text);

        expect(updateSentenceTextSpy).toHaveBeenCalledTimes(0);
        expect(updateWordTextSpy).toHaveBeenCalledTimes(0);
        expect(updateLetterTextSpy).toHaveBeenCalledTimes(0);
    });

    it('should not create the text tree when sanitized text is empty', () => {
        store.dispatch(textActions.setText('äöü'));

        const state = store.getState();

        expect(state.main.text.rootElement).toBeNull();
        expect(state.main.text.elements).toStrictEqual({});
    });

    it('should delete the text tree', () => {
        store.dispatch(textActions.setText('this that'));
        store.dispatch(textActions.setText(''));

        const state = store.getState();

        expect(state.main.text.rootElement).toBeNull();
        expect(state.main.text.elements).toStrictEqual({});
    });

    it('should add word', () => {
        store.dispatch(textActions.setText('this that'));
        store.dispatch(textActions.setText('this and that'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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
        store.dispatch(textActions.setText('this and that'));
        store.dispatch(textActions.setText('this that'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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

        expect(state.main.text.elements['WRD-2']).toBeUndefined();
    });

    it('should remove word letter children', () => {
        store.dispatch(textActions.setText('this that'));
        store.dispatch(textActions.setText('this'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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

        expect(state.main.text.elements['WRD-1']).toBeUndefined();
        expect(state.main.text.elements['LTR-3']).toBeUndefined();
        expect(state.main.text.elements['LTR-4']).toBeUndefined();
        expect(state.main.text.elements['LTR-5']).toBeUndefined();
    });

    it('should remove word stacked letter children', () => {
        store.dispatch(textActions.setText('j bb'));
        store.dispatch(textActions.setText('j'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'j',
            },
            'LTR-0': {
                text: 'j',
            },
        });

        expect(state.main.text.elements['WRD-1']).toBeUndefined();
        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(state.main.text.elements['LTR-2']).toBeUndefined();
        expect(state.main.text.elements['SLG-0']).toBeUndefined();
    });

    it('should remove word attached letter children', () => {
        store.dispatch(textActions.setText('j be'));
        store.dispatch(textActions.setText('j'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'j',
            },
            'LTR-0': {
                text: 'j',
            },
        });

        expect(state.main.text.elements['WRD-1']).toBeUndefined();
        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(state.main.text.elements['LTR-2']).toBeUndefined();
        expect(state.main.text.elements['ALG-0']).toBeUndefined();
    });

    it('should update word', () => {
        store.dispatch(textActions.setText('this that'));
        store.dispatch(textActions.setText('that this'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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
        store.dispatch(textActions.setText('b'));
        store.dispatch(textActions.setText('bj'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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
        store.dispatch(textActions.setText('bj'));
        store.dispatch(textActions.setText('b'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'b',
                letters: ['LTR-0'],
            },
            'LTR-0': {
                text: 'b',
            },
        });

        expect(state.main.text.elements['LTR-1']).toBeUndefined();
    });

    it('should remove letter dots', () => {
        store.dispatch(textActions.setText('bk'));
        store.dispatch(textActions.setText('b'));

        const state = store.getState();

        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(state.main.text.elements['DOT-0']).toBeUndefined();
        expect(state.main.text.elements['DOT-1']).toBeUndefined();
    });

    it('should remove letter line slots', () => {
        store.dispatch(textActions.setText('bh'));
        store.dispatch(textActions.setText('b'));

        const state = store.getState();

        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(state.main.text.elements['LNS-0']).toBeUndefined();
        expect(state.main.text.elements['LNS-1']).toBeUndefined();
    });

    it('should update letter', () => {
        store.dispatch(textActions.setText('bj'));
        store.dispatch(textActions.setText('tj'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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

    it('should update stacked letter', () => {
        store.dispatch(textActions.setText('bb'));
        store.dispatch(textActions.setText('jj'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'jj',
                letters: ['SLG-0'],
            },
            'SLG-0': {
                parent: 'WRD-0',
                letters: ['LTR-0', 'LTR-1'],
            },
            'LTR-0': {
                parent: 'SLG-0',
                text: 'j',
            },
            'LTR-1': {
                parent: 'SLG-0',
                text: 'j',
            },
        });
    });

    it('should update attached letter', () => {
        store.dispatch(textActions.setText('be'));
        store.dispatch(textActions.setText('jo'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'jo',
                letters: ['ALG-0'],
            },
            'ALG-0': {
                parent: 'WRD-0',
                letters: ['LTR-0', 'LTR-1'],
            },
            'LTR-0': {
                parent: 'ALG-0',
                text: 'j',
            },
            'LTR-1': {
                parent: 'ALG-0',
                text: 'o',
            },
        });
    });

    it('should add stacked letter', () => {
        store.dispatch(textActions.setText('bb'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'bb',
                letters: ['SLG-0'],
            },
            'SLG-0': {
                id: 'SLG-0',
                parent: 'WRD-0',
                letters: ['LTR-0', 'LTR-1'],
            },
            'LTR-0': {
                parent: 'SLG-0',
            },
            'LTR-1': {
                parent: 'SLG-0',
            },
        });
    });

    it('should add attached letter', () => {
        store.dispatch(textActions.setText('be'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'be',
                letters: ['ALG-0'],
            },
            'ALG-0': {
                id: 'ALG-0',
                parent: 'WRD-0',
                letters: ['LTR-0', 'LTR-1'],
            },
            'LTR-0': {
                parent: 'ALG-0',
            },
            'LTR-1': {
                parent: 'ALG-0',
            },
        });
    });

    it('should add attached letter with stacked letter children', () => {
        store.dispatch(textActions.setText('bee'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'bee',
                letters: ['ALG-0'],
            },
            'ALG-0': {
                id: 'ALG-0',
                parent: 'WRD-0',
                letters: ['LTR-0', 'SLG-0'],
            },
            'SLG-0': {
                parent: 'ALG-0',
            },
            'LTR-0': {
                parent: 'ALG-0',
            },
            'LTR-1': {
                parent: 'SLG-0',
            },
            'LTR-2': {
                parent: 'SLG-0',
            },
        });
    });

    it('should add stacked letter on change', () => {
        store.dispatch(textActions.setText('j'));
        store.dispatch(textActions.setText('jbb'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'jbb',
                letters: ['LTR-0', 'SLG-0'],
            },
            'SLG-0': {
                id: 'SLG-0',
                parent: 'WRD-0',
                letters: ['LTR-1', 'LTR-2'],
            },
            'LTR-0': {
                parent: 'WRD-0',
            },
            'LTR-1': {
                parent: 'SLG-0',
            },
            'LTR-2': {
                parent: 'SLG-0',
            },
        });
    });

    it('should add attached letter on change', () => {
        store.dispatch(textActions.setText('j'));
        store.dispatch(textActions.setText('jbe'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'jbe',
                letters: ['LTR-0', 'ALG-0'],
            },
            'ALG-0': {
                id: 'ALG-0',
                parent: 'WRD-0',
                letters: ['LTR-1', 'LTR-2'],
            },
            'LTR-0': {
                parent: 'WRD-0',
            },
            'LTR-1': {
                parent: 'ALG-0',
            },
            'LTR-2': {
                parent: 'ALG-0',
            },
        });
    });

    it('should convert letter to stacked letter', () => {
        store.dispatch(textActions.setText('b'));
        store.dispatch(textActions.setText('bb'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'bb',
                letters: ['SLG-0'],
            },
            'SLG-0': {
                id: 'SLG-0',
                parent: 'WRD-0',
                letters: ['LTR-1', 'LTR-2'],
            },
            'LTR-1': {
                parent: 'SLG-0',
            },
            'LTR-2': {
                parent: 'SLG-0',
            },
        });

        expect(state.main.text.elements['LTR-0']).toBeUndefined();
    });

    it('should convert letter to attached letter', () => {
        store.dispatch(textActions.setText('b'));
        store.dispatch(textActions.setText('be'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'be',
                letters: ['ALG-0'],
            },
            'ALG-0': {
                id: 'ALG-0',
                parent: 'WRD-0',
                letters: ['LTR-1', 'LTR-2'],
            },
            'LTR-1': {
                parent: 'ALG-0',
            },
            'LTR-2': {
                parent: 'ALG-0',
            },
        });

        expect(state.main.text.elements['LTR-0']).toBeUndefined();
    });

    it('should remove stacked letter', () => {
        store.dispatch(textActions.setText('jbb'));
        store.dispatch(textActions.setText('j'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'j',
                letters: ['LTR-0'],
            },
            'LTR-0': {
                text: 'j',
                parent: 'WRD-0',
            },
        });

        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(state.main.text.elements['LTR-2']).toBeUndefined();
        expect(state.main.text.elements['SLG-0']).toBeUndefined();
    });

    it('should remove attached letter', () => {
        store.dispatch(textActions.setText('jbe'));
        store.dispatch(textActions.setText('j'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'j',
                letters: ['LTR-0'],
            },
            'LTR-0': {
                text: 'j',
                parent: 'WRD-0',
            },
        });

        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(state.main.text.elements['LTR-2']).toBeUndefined();
        expect(state.main.text.elements['ALG-0']).toBeUndefined();
    });

    it('should remove stacked letter children from attached letter', () => {
        store.dispatch(textActions.setText('jbee'));
        store.dispatch(textActions.setText('j'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'j',
                letters: ['LTR-0'],
            },
            'LTR-0': {
                text: 'j',
                parent: 'WRD-0',
            },
        });

        expect(state.main.text.elements['ALG-0']).toBeUndefined();
        expect(state.main.text.elements['SLG-0']).toBeUndefined();
        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(state.main.text.elements['LTR-2']).toBeUndefined();
        expect(state.main.text.elements['LTR-3']).toBeUndefined();
    });

    it('should convert stacked letter to letter', () => {
        store.dispatch(textActions.setText('bb'));
        store.dispatch(textActions.setText('b'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'b',
                letters: ['LTR-2'],
            },
            'LTR-2': {
                parent: 'WRD-0',
            },
        });

        expect(state.main.text.elements['LTR-0']).toBeUndefined();
        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(state.main.text.elements['SLG-0']).toBeUndefined();
    });

    it('should convert attached letter to letter', () => {
        store.dispatch(textActions.setText('be'));
        store.dispatch(textActions.setText('b'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'b',
                letters: ['LTR-2'],
            },
            'LTR-2': {
                parent: 'WRD-0',
            },
        });

        expect(state.main.text.elements['LTR-0']).toBeUndefined();
        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(state.main.text.elements['ALG-0']).toBeUndefined();
    });

    it('should convert stacked letter to attached letter', () => {
        store.dispatch(textActions.setText('bb'));
        store.dispatch(textActions.setText('be'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'be',
                letters: ['ALG-0'],
            },
            'ALG-0': {
                id: 'ALG-0',
                parent: 'WRD-0',
                letters: ['LTR-2', 'LTR-3'],
            },
            'LTR-2': {
                parent: 'ALG-0',
            },
            'LTR-3': {
                parent: 'ALG-0',
            },
        });

        expect(state.main.text.elements['LTR-0']).toBeUndefined();
        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(state.main.text.elements['SLG-0']).toBeUndefined();
    });

    it('should convert attached letter to stacked letter', () => {
        store.dispatch(textActions.setText('be'));
        store.dispatch(textActions.setText('bb'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'bb',
                letters: ['SLG-0'],
            },
            'SLG-0': {
                id: 'SLG-0',
                parent: 'WRD-0',
                letters: ['LTR-2', 'LTR-3'],
            },
            'LTR-2': {
                parent: 'SLG-0',
            },
            'LTR-3': {
                parent: 'SLG-0',
            },
        });

        expect(state.main.text.elements['LTR-0']).toBeUndefined();
        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(state.main.text.elements['ALG-0']).toBeUndefined();
    });

    it('should add dot', () => {
        store.dispatch(textActions.setText('bk'));
        store.dispatch(textActions.setText('bc'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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
        store.dispatch(textActions.setText('bl'));
        store.dispatch(textActions.setText('bk'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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

        expect(state.main.text.elements['DOT-2']).toBeUndefined();
    });

    it('should remain dots', () => {
        store.dispatch(textActions.setText('bk'));
        store.dispatch(textActions.setText('br'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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
        store.dispatch(textActions.setText('bh'));
        store.dispatch(textActions.setText('bf'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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
        store.dispatch(textActions.setText('bf'));
        store.dispatch(textActions.setText('bh'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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

        expect(state.main.text.elements['LNS-2']).toBeUndefined();
    });

    it('should remain line slots', () => {
        store.dispatch(textActions.setText('bf'));
        store.dispatch(textActions.setText('bm'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
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
        store.dispatch(textActions.setSplitLetterOptions({ digraphs: false }));
        store.dispatch(textActions.setText('sh'));

        store.dispatch(textThunks.mergeToDigraph('LTR-0', 'LTR-1'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                letters: ['LTR-0'],
            },
            'LTR-0': {
                text: 'sh',
                letter: {
                    letterType: LetterType.Digraph,
                    value: DigraphValue.SH,
                    decoration: ConsonantDecoration.DoubleDot,
                    placement: ConsonantPlacement.ShallowCut,
                },
                dots: ['DOT-0', 'DOT-1'],
                lineSlots: [],
            },
        });

        expect(state.main.text.elements['LTR-1']).toBeUndefined();
        expect(
            Object.keys(state.main.text.elements).some((id) =>
                id.startsWith('LNS'),
            ),
        ).toBeFalsy();
    });

    it('should split digraph to letters', () => {
        store.dispatch(textActions.setSplitLetterOptions({ digraphs: true }));
        store.dispatch(textActions.setText('qu'));

        store.dispatch(textThunks.splitDigraph('LTR-0'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                letters: ['LTR-0', 'LTR-1'],
            },
            'LTR-0': {
                text: 'q',
                letter: {
                    letterType: LetterType.Consonant,
                    value: ConsonantValue.Q,
                    decoration: ConsonantDecoration.QuadrupleDot,
                    placement: ConsonantPlacement.OnLine,
                },
                dots: ['DOT-0', 'DOT-1', 'DOT-2', 'DOT-3'],
                lineSlots: [],
            },
            'LTR-1': {
                text: 'u',
                letter: {
                    letterType: LetterType.Vocal,
                    value: VocalValue.U,
                    decoration: VocalDecoration.LineOutside,
                    placement: VocalPlacement.OnLine,
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

        expect(state.main.text.elements['LNS-0']).toBeUndefined();
    });
});
