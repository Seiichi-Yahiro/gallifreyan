import { createStore } from '../AppState';
import { moveDot, moveSentence } from './ImageThunks';
import { Consonant, ConsonantDecoration, ConsonantPlacement, Dot, ImageType, Sentence } from './ImageTypes';

describe('ImageThunks', () => {
    describe('Move Sentence', () => {
        const setup = () => {
            const sentence: Sentence = {
                circle: { angle: 0, distance: 0, r: 10 },
                id: '0',
                lineSlots: [],
                text: '',
                type: ImageType.Sentence,
                words: [],
            };

            const store = createStore({
                image: {
                    rootCircleId: sentence.id,
                    circles: { [sentence.id]: sentence },
                    lineSlots: {},
                    lineConnections: {},
                    svgSize: 1000,
                },
            });

            return { store, sentence };
        };

        it('should adjust sentence distance being outside of svg canvas', () => {
            const { store, sentence } = setup();
            store.dispatch(moveSentence(sentence.id, { distance: 2000 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ distance: 490 });
        });

        it('should adjust sentence distance partially being outside of svg canvas', () => {
            const { store, sentence } = setup();
            store.dispatch(moveSentence(sentence.id, { distance: 1000 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ distance: 490 });
        });

        it('should not adjust sentence distance inside of svg canvas', () => {
            const { store, sentence } = setup();
            store.dispatch(moveSentence(sentence.id, { distance: 10 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ distance: 10 });
        });

        it('should adjust sentence angle being greater 360 degrees', () => {
            const { store, sentence } = setup();
            store.dispatch(moveSentence(sentence.id, { angle: 370 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ angle: 0 });
        });

        it('should adjust sentence angle being less than 0 degrees', () => {
            const { store, sentence } = setup();
            store.dispatch(moveSentence(sentence.id, { angle: -10 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ angle: 360 });
        });

        it('should not adjust sentence angle being between 0 and 360 degrees', () => {
            const { store, sentence } = setup();
            store.dispatch(moveSentence(sentence.id, { angle: 180 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ angle: 180 });
        });
    });

    describe('Move Dot', () => {
        const setup = () => {
            const consonant: Consonant = {
                circle: { r: 100, angle: 180, distance: 50 },
                decoration: ConsonantDecoration.SingleDot,
                dots: [],
                id: '10',
                lineSlots: [],
                parentId: '',
                placement: ConsonantPlacement.Inside,
                text: '',
                type: ImageType.Consonant,
            };

            const dot: Dot = {
                circle: { angle: 90, distance: 0, r: 10 },
                id: '100',
                parentId: consonant.id,
                type: ImageType.Dot,
            };

            const store = createStore({
                image: {
                    rootCircleId: '',
                    circles: { [dot.id]: dot, [consonant.id]: consonant },
                    lineSlots: {},
                    lineConnections: {},
                    svgSize: 1000,
                },
            });

            return { dot, store };
        };

        it('should adjust dot being outside of consonant', () => {
            const { store, dot } = setup();
            store.dispatch(moveDot(dot.id, { distance: 2000 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ distance: 100 });
        });

        it('should not adjust dot on consonant line', () => {
            const { store, dot } = setup();
            store.dispatch(moveDot(dot.id, { distance: 100 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ distance: 100 });
        });

        it('should not adjust dot inside of consonant', () => {
            const { store, dot } = setup();
            store.dispatch(moveDot(dot.id, { distance: 1 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ distance: 1 });
        });

        it('should adjust dot angle being greater 360 degrees', () => {
            const { store, dot } = setup();
            store.dispatch(moveDot(dot.id, { angle: 370 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ angle: 0 });
        });

        it('should adjust dot angle being less than 0 degrees', () => {
            const { store, dot } = setup();
            store.dispatch(moveDot(dot.id, { angle: -10 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ angle: 360 });
        });

        it('should not adjust dot angle being between 0 and 360 degrees', () => {
            const { store, dot } = setup();
            store.dispatch(moveDot(dot.id, { angle: 180 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ angle: 180 });
        });
    });
});
