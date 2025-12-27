import { resetIdCounters } from '@/redux/ids';
import { type AppStore, setupStore } from '@/redux/store';
import textThunks from '@/redux/thunks/textThunks';
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
        store.dispatch(textThunks.setText('text'));
        const state = store.getState();

        expect(state.svg.circles).toMatchObject({
            'SNT-0': {},
        });
    });

    it('should remove a sentence circle', () => {
        store.dispatch(textThunks.setText('text'));
        store.dispatch(textThunks.setText(''));
        const state = store.getState();

        expect(state.svg.circles['SNT-0']).toBeUndefined();
    });

    it('should add word circles', () => {
        store.dispatch(textThunks.setText('this that'));
        const state = store.getState();

        expect(state.svg.circles).toMatchObject({
            'WRD-0': {},
            'WRD-1': {},
        });
    });

    it('should remove a word circle', () => {
        store.dispatch(textThunks.setText('this that'));
        store.dispatch(textThunks.setText('that'));
        const state = store.getState();

        expect(state.svg.circles).toMatchObject({
            'WRD-0': {},
        });

        expect(state.svg.circles['WRD-1']).toBeUndefined();
    });

    it('should add letter circles', () => {
        store.dispatch(textThunks.setText('bj t'));
        const state = store.getState();

        expect(state.svg.circles).toMatchObject({
            'LTR-0': {},
            'LTR-1': {},
            'LTR-2': {},
        });
    });

    it('should remove a letter circle', () => {
        store.dispatch(textThunks.setText('bj t'));
        store.dispatch(textThunks.setText('b t'));
        const state = store.getState();

        expect(state.svg.circles).toMatchObject({
            'LTR-0': {},
            'LTR-2': {},
        });

        expect(state.svg.circles['LTR-1']).toBeUndefined();
    });

    it('should add dot circles', () => {
        store.dispatch(textThunks.setText('l'));
        const state = store.getState();

        expect(state.svg.circles).toMatchObject({
            'DOT-0': {},
            'DOT-1': {},
            'DOT-2': {},
        });
    });

    it('should remove a dot circle', () => {
        store.dispatch(textThunks.setText('l'));
        store.dispatch(textThunks.setText('k'));
        const state = store.getState();

        expect(state.svg.circles).toMatchObject({
            'DOT-0': {},
            'DOT-1': {},
        });

        expect(state.svg.circles['DOT-2']).toBeUndefined();
    });

    it('should add line slots', () => {
        store.dispatch(textThunks.setText('m'));
        const state = store.getState();

        expect(state.svg.lineSlots).toMatchObject({
            'LNS-0': {},
            'LNS-1': {},
            'LNS-2': {},
        });
    });

    it('should remove a line slot', () => {
        store.dispatch(textThunks.setText('m'));
        store.dispatch(textThunks.setText('p'));
        const state = store.getState();

        expect(state.svg.lineSlots).toMatchObject({
            'LNS-0': {},
            'LNS-1': {},
        });

        expect(state.svg.lineSlots['LNS-2']).toBeUndefined();
    });
});
