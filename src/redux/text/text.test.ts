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
                letters: ['CON-0', 'VOC-1', 'CON-2'],
            },
            'WRD-1': {
                id: 'WRD-1',
                parent: 'SNT-0',
                text: 'ni',
                letters: ['CON-3', 'VOC-4'],
            },
            'CON-0': {
                id: 'CON-0',
                parent: 'WRD-0',
                text: 'wh',
                letter: {
                    value: DigraphValue.WH,
                },
                dots: ['DOT-0'],
                lineSlots: [],
            },
            'VOC-1': {
                id: 'VOC-1',
                parent: 'WRD-0',
                text: 'a',
                letter: {
                    value: VocalValue.A,
                },
                lineSlots: [],
            },
            'CON-2': {
                id: 'CON-2',
                parent: 'WRD-0',
                text: 't',
                letter: {
                    value: ConsonantValue.T,
                },
                lineSlots: [],
            },
            'CON-3': {
                id: 'CON-3',
                parent: 'WRD-1',
                text: 'n',
                letter: {
                    value: ConsonantValue.N,
                },
                dots: [],
                lineSlots: ['LNS-0'],
            },
            'VOC-4': {
                id: 'VOC-4',
                parent: 'WRD-1',
                text: 'i',
                letter: {
                    value: VocalValue.I,
                },
                lineSlots: ['LNS-1'],
            },
            'DOT-0': {
                id: 'DOT-0',
                parent: 'CON-0',
            },
            'LNS-0': {
                id: 'LNS-0',
                parent: 'CON-3',
            },
            'LNS-1': {
                id: 'LNS-1',
                parent: 'VOC-4',
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
        const updateConsonantTextSpy = spyOnAction(
            textActions,
            'updateConsonantText',
        );
        const updateVocalTextSpy = spyOnAction(textActions, 'updateVocalText');

        store.dispatch(textActions.setText('this that'));
        const stateAfter = store.getState();

        expect(stateBefore.main.text).toStrictEqual(stateAfter.main.text);

        expect(updateSentenceTextSpy).toHaveBeenCalledTimes(0);
        expect(updateWordTextSpy).toHaveBeenCalledTimes(0);
        expect(updateConsonantTextSpy).toHaveBeenCalledTimes(0);
        expect(updateVocalTextSpy).toHaveBeenCalledTimes(0);
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

    it('should remove word children', () => {
        store.dispatch(textActions.setText('this that'));
        store.dispatch(textActions.setText('this'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'this',
            },
            'CON-0': {
                text: 'th',
            },
            'VOC-1': {
                text: 'i',
            },
            'CON-2': {
                text: 's',
            },
        });

        expect(state.main.text.elements['WRD-1']).toBeUndefined();
        expect(state.main.text.elements['CON-3']).toBeUndefined();
        expect(state.main.text.elements['VOC-4']).toBeUndefined();
        expect(state.main.text.elements['CON-5']).toBeUndefined();
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
                letters: ['CON-0', 'CON-1'],
            },
            'CON-0': {
                text: 'b',
            },
            'CON-1': {
                text: 'j',
            },
        });
    });

    it('should convert consonant to vocal', () => {
        store.dispatch(textActions.setText('pk'));
        store.dispatch(textActions.setText('iu'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'iu',
                letters: ['VOC-0', 'VOC-1'],
            },
            'VOC-0': {
                id: 'VOC-0',
                parent: 'WRD-0',
                text: 'i',
            },
            'LNS-0': {
                id: 'LNS-0',
                parent: 'VOC-0',
            },
            'VOC-1': {
                id: 'VOC-1',
                parent: 'WRD-0',
                text: 'u',
            },
        });

        expect(state.main.text.elements['CON-0']).toBeUndefined();
        expect(state.main.text.elements['CON-1']).toBeUndefined();
        expect(state.main.text.elements['VOC-0']).not.toHaveProperty('dots');
        expect(state.main.text.elements['VOC-1']).not.toHaveProperty('dots');
        expect(state.main.text.elements['DOT-0']).toBeUndefined();
        expect(state.main.text.elements['DOT-1']).toBeUndefined();
    });

    it('should convert vocal to consonant', () => {
        store.dispatch(textActions.setText('iu'));
        store.dispatch(textActions.setText('pk'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'pk',
                letters: ['CON-0', 'CON-1'],
            },
            'CON-0': {
                id: 'CON-0',
                parent: 'WRD-0',
                text: 'p',
                dots: [],
                lineSlots: ['LNS-0', 'LNS-2'],
            },
            'LNS-0': {
                id: 'LNS-0',
                parent: 'CON-0',
            },
            'LNS-2': {
                id: 'LNS-2',
                parent: 'CON-0',
            },
            'CON-1': {
                id: 'CON-1',
                parent: 'WRD-0',
                lineSlots: [],
                dots: ['DOT-0', 'DOT-1'],
            },
            'DOT-0': {
                id: 'DOT-0',
                parent: 'CON-1',
            },
            'DOT-1': {
                id: 'DOT-1',
                parent: 'CON-1',
            },
        });

        expect(state.main.text.elements['VOC-0']).toBeUndefined();
        expect(state.main.text.elements['VOC-1']).toBeUndefined();
        expect(state.main.text.elements['LNS-1']).toBeUndefined();
    });

    it('should remove letter', () => {
        store.dispatch(textActions.setText('bj'));
        store.dispatch(textActions.setText('b'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'b',
                letters: ['CON-0'],
            },
            'CON-0': {
                text: 'b',
            },
        });

        expect(state.main.text.elements['CON-1']).toBeUndefined();
    });

    it('should remove letter dots', () => {
        store.dispatch(textActions.setText('bk'));
        store.dispatch(textActions.setText('b'));

        const state = store.getState();

        expect(state.main.text.elements['CON-1']).toBeUndefined();
        expect(state.main.text.elements['DOT-0']).toBeUndefined();
        expect(state.main.text.elements['DOT-1']).toBeUndefined();
    });

    it('should remove letter line slots', () => {
        store.dispatch(textActions.setText('bh'));
        store.dispatch(textActions.setText('b'));

        const state = store.getState();

        expect(state.main.text.elements['CON-1']).toBeUndefined();
        expect(state.main.text.elements['LNS-0']).toBeUndefined();
        expect(state.main.text.elements['LNS-1']).toBeUndefined();
    });

    it('should update letter', () => {
        store.dispatch(textActions.setText('bjoa'));
        store.dispatch(textActions.setText('jbao'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                text: 'jbao',
                letters: ['CON-0', 'CON-1', 'VOC-2', 'VOC-3'],
            },
            'CON-0': {
                id: 'CON-0',
                text: 'j',
            },
            'CON-1': {
                id: 'CON-1',
                text: 'b',
            },
            'VOC-2': {
                id: 'VOC-2',
                text: 'a',
            },
            'VOC-3': {
                id: 'VOC-3',
                text: 'o',
            },
        });
    });

    it('should add dot', () => {
        store.dispatch(textActions.setText('bk'));
        store.dispatch(textActions.setText('bc'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'CON-1': {
                text: 'c',
                dots: ['DOT-0', 'DOT-1', 'DOT-2', 'DOT-3'],
            },
            'DOT-0': {
                parent: 'CON-1',
            },
            'DOT-1': {
                parent: 'CON-1',
            },
            'DOT-2': {
                parent: 'CON-1',
            },
            'DOT-3': {
                parent: 'CON-1',
            },
        });
    });

    it('should remove dot', () => {
        store.dispatch(textActions.setText('bl'));
        store.dispatch(textActions.setText('bk'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'CON-1': {
                text: 'k',
                dots: ['DOT-0', 'DOT-1'],
            },
            'DOT-0': {
                parent: 'CON-1',
            },
            'DOT-1': {
                parent: 'CON-1',
            },
        });

        expect(state.main.text.elements['DOT-2']).toBeUndefined();
    });

    it('should remain dots', () => {
        store.dispatch(textActions.setText('bk'));
        store.dispatch(textActions.setText('br'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'CON-1': {
                text: 'r',
                dots: ['DOT-0', 'DOT-1', 'DOT-2'],
            },
            'DOT-0': {
                parent: 'CON-1',
            },
            'DOT-1': {
                parent: 'CON-1',
            },
            'DOT-2': {
                parent: 'CON-1',
            },
        });
    });

    it('should add line slot', () => {
        store.dispatch(textActions.setText('bh'));
        store.dispatch(textActions.setText('bf'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'CON-1': {
                text: 'f',
                lineSlots: ['LNS-0', 'LNS-1', 'LNS-2'],
            },
            'LNS-0': {
                parent: 'CON-1',
            },
            'LNS-1': {
                parent: 'CON-1',
            },
            'LNS-2': {
                parent: 'CON-1',
            },
        });
    });

    it('should remove line slot', () => {
        store.dispatch(textActions.setText('bf'));
        store.dispatch(textActions.setText('bh'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'CON-1': {
                text: 'h',
                lineSlots: ['LNS-0', 'LNS-1'],
            },
            'LNS-0': {
                parent: 'CON-1',
            },
            'LNS-1': {
                parent: 'CON-1',
            },
        });

        expect(state.main.text.elements['LNS-2']).toBeUndefined();
    });

    it('should remain line slots', () => {
        store.dispatch(textActions.setText('bf'));
        store.dispatch(textActions.setText('bm'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'CON-1': {
                text: 'm',
                lineSlots: ['LNS-0', 'LNS-1', 'LNS-2'],
            },
            'LNS-0': {
                parent: 'CON-1',
            },
            'LNS-1': {
                parent: 'CON-1',
            },
            'LNS-2': {
                parent: 'CON-1',
            },
        });
    });

    it('should merge consonants to a digraph', () => {
        store.dispatch(textActions.setSplitLetterOptions({ digraphs: false }));
        store.dispatch(textActions.setText('sh'));

        store.dispatch(textThunks.mergeToDigraph('CON-0', 'CON-1'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                letters: ['CON-0'],
            },
            'CON-0': {
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

        expect(state.main.text.elements['CON-1']).toBeUndefined();
        expect(
            Object.keys(state.main.text.elements).some((id) =>
                id.startsWith('LNS'),
            ),
        ).toBeFalsy();
    });

    it('should split digraph qu to letters', () => {
        store.dispatch(textActions.setSplitLetterOptions({ digraphs: true }));
        store.dispatch(textActions.setText('bqub'));

        store.dispatch(textThunks.splitDigraph('CON-1'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                letters: ['CON-0', 'CON-1', 'VOC-3', 'CON-2'],
            },
            'CON-1': {
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
            'VOC-3': {
                text: 'u',
                letter: {
                    letterType: LetterType.Vocal,
                    value: VocalValue.U,
                    decoration: VocalDecoration.LineOutside,
                    placement: VocalPlacement.OnLine,
                },
                lineSlots: ['LNS-1'],
            },
            'DOT-0': {
                parent: 'CON-1',
            },
            'DOT-1': {
                parent: 'CON-1',
            },
            'DOT-2': {
                parent: 'CON-1',
            },
            'DOT-3': {
                parent: 'CON-1',
            },
            'LNS-1': {
                parent: 'VOC-3',
            },
        });

        expect(state.main.text.elements['LNS-0']).toBeUndefined();
    });

    it('should split digraph sh to letters', () => {
        store.dispatch(textActions.setSplitLetterOptions({ digraphs: true }));
        store.dispatch(textActions.setText('bshb'));

        store.dispatch(textThunks.splitDigraph('CON-1'));

        const state = store.getState();

        expect(state.main.text.elements).toMatchObject({
            'WRD-0': {
                letters: ['CON-0', 'CON-1', 'CON-3', 'CON-2'],
            },
            'CON-1': {
                text: 's',
                letter: {
                    letterType: LetterType.Consonant,
                    value: ConsonantValue.S,
                    decoration: ConsonantDecoration.TripleLine,
                    placement: ConsonantPlacement.ShallowCut,
                },
                dots: [],
                lineSlots: ['LNS-0', 'LNS-1', 'LNS-2'],
            },
            'CON-3': {
                text: 'h',
                letter: {
                    letterType: LetterType.Consonant,
                    value: ConsonantValue.H,
                    decoration: ConsonantDecoration.DoubleLine,
                    placement: ConsonantPlacement.DeepCut,
                },
                lineSlots: ['LNS-3', 'LNS-4'],
                dots: [],
            },
            'LNS-0': {
                parent: 'CON-1',
            },
            'LNS-1': {
                parent: 'CON-1',
            },
            'LNS-2': {
                parent: 'CON-1',
            },
            'LNS-3': {
                parent: 'CON-3',
            },
            'LNS-4': {
                parent: 'CON-3',
            },
        });

        expect(state.main.text.elements['DOT-0']).toBeUndefined();
        expect(state.main.text.elements['DOT-1']).toBeUndefined();
    });
});
