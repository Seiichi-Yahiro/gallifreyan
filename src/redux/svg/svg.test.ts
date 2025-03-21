import { type AppStore, setupStore } from '@/redux/store';
import { resetIdCounters } from '@/redux/text/ids';
import textActions from '@/redux/text/textActions';
import { TextElementType } from '@/redux/text/textTypes';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('svg', () => {
    let store: AppStore;

    beforeEach(() => {
        store = setupStore();
    });

    afterEach(() => {
        resetIdCounters();
        vi.restoreAllMocks();
    });

    it('should add a sentence circle', () => {
        store.dispatch(textActions.setText('text'));
        const state = store.getState();

        expect(state.main.svg.circles).toMatchObject({
            'SNT-0': {
                type: TextElementType.Sentence,
            },
        });
    });

    it('should remove a sentence circle', () => {
        store.dispatch(textActions.setText('text'));
        store.dispatch(textActions.setText(''));
        const state = store.getState();

        expect(state.main.svg.circles['SNT-0']).toBeUndefined();
    });

    it('should add word circles', () => {
        store.dispatch(textActions.setText('this that'));
        const state = store.getState();

        expect(state.main.svg.circles).toMatchObject({
            'WRD-0': {
                type: TextElementType.Word,
            },
            'WRD-1': {
                type: TextElementType.Word,
            },
        });
    });

    it('should remove a word circle', () => {
        store.dispatch(textActions.setText('this that'));
        store.dispatch(textActions.setText('that'));
        const state = store.getState();

        expect(state.main.svg.circles).toMatchObject({
            'WRD-0': {
                type: TextElementType.Word,
            },
        });

        expect(state.main.svg.circles['WRD-1']).toBeUndefined();
    });

    it('should add letter circles', () => {
        store.dispatch(textActions.setText('bj t'));
        const state = store.getState();

        expect(state.main.svg.circles).toMatchObject({
            'LTR-0': {
                type: TextElementType.Letter,
            },
            'LTR-1': {
                type: TextElementType.Letter,
            },
            'LTR-2': {
                type: TextElementType.Letter,
            },
        });
    });

    it('should remove a letter circle', () => {
        store.dispatch(textActions.setText('bj t'));
        store.dispatch(textActions.setText('b t'));
        const state = store.getState();

        expect(state.main.svg.circles).toMatchObject({
            'LTR-0': {
                type: TextElementType.Letter,
            },
            'LTR-2': {
                type: TextElementType.Letter,
            },
        });

        expect(state.main.svg.circles['LTR-1']).toBeUndefined();
    });

    it('should add dot circles', () => {
        store.dispatch(textActions.setText('l'));
        const state = store.getState();

        expect(state.main.svg.circles).toMatchObject({
            'DOT-0': {
                type: TextElementType.Dot,
            },
            'DOT-1': {
                type: TextElementType.Dot,
            },
            'DOT-2': {
                type: TextElementType.Dot,
            },
        });
    });

    it('should remove a dot circle', () => {
        store.dispatch(textActions.setText('l'));
        store.dispatch(textActions.setText('k'));
        const state = store.getState();

        expect(state.main.svg.circles).toMatchObject({
            'DOT-0': {
                type: TextElementType.Dot,
            },
            'DOT-1': {
                type: TextElementType.Dot,
            },
        });

        expect(state.main.svg.circles['DOT-2']).toBeUndefined();
    });

    it('should add line slots', () => {
        store.dispatch(textActions.setText('m'));
        const state = store.getState();

        expect(state.main.svg.lineSlots).toMatchObject({
            'LNS-0': {},
            'LNS-1': {},
            'LNS-2': {},
        });
    });

    it('should remove a line slot', () => {
        store.dispatch(textActions.setText('m'));
        store.dispatch(textActions.setText('p'));
        const state = store.getState();

        expect(state.main.svg.lineSlots).toMatchObject({
            'LNS-0': {},
            'LNS-1': {},
        });

        expect(state.main.svg.lineSlots['LNS-2']).toBeUndefined();
    });
});
