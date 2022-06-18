import { zip } from 'lodash';
import { createTestStore } from '../../utils/TestUtils';
import {
    selectConsonant,
    selectDot,
    selectLineSlot,
    selectSentence,
    selectVocal,
    selectWord,
} from '../work/WorkThunks';
import { moveConsonant, moveDot, moveLineSlot, moveSentence, moveVocal, moveWord } from './ImageThunks';
import {
    Consonant,
    ConsonantDecoration,
    ConsonantPlacement,
    Dot,
    ImageType,
    LineSlot,
    Sentence,
    Vocal,
    VocalDecoration,
    VocalPlacement,
    Word,
} from './ImageTypes';

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

            const store = createTestStore({
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
            store.dispatch(selectSentence(sentence.id));
            store.dispatch(moveSentence(sentence.id, { distance: 2000 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ distance: 490 });
        });

        it('should adjust sentence distance partially being outside of svg canvas', () => {
            const { store, sentence } = setup();
            store.dispatch(selectSentence(sentence.id));
            store.dispatch(moveSentence(sentence.id, { distance: 1000 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ distance: 490 });
        });

        it('should not adjust sentence distance inside of svg canvas', () => {
            const { store, sentence } = setup();
            store.dispatch(selectSentence(sentence.id));
            store.dispatch(moveSentence(sentence.id, { distance: 10 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ distance: 10 });
        });

        it('should adjust sentence angle being greater 360 degrees', () => {
            const { store, sentence } = setup();
            store.dispatch(selectSentence(sentence.id));
            store.dispatch(moveSentence(sentence.id, { angle: 370 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ angle: 0 });
        });

        it('should adjust sentence angle being less than 0 degrees', () => {
            const { store, sentence } = setup();
            store.dispatch(selectSentence(sentence.id));
            store.dispatch(moveSentence(sentence.id, { angle: -10 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ angle: 360 });
        });

        it('should not adjust sentence angle being between 0 and 360 degrees', () => {
            const { store, sentence } = setup();
            store.dispatch(selectSentence(sentence.id));
            store.dispatch(moveSentence(sentence.id, { angle: 180 }));

            const state = store.getState();
            const circle = state.image.circles[sentence.id]!.circle;

            expect(circle).toMatchObject({ angle: 180 });
        });
    });

    describe('Move Word', () => {
        const setup = () => {
            const sentence: Sentence = {
                circle: { angle: 0, distance: 0, r: 500 },
                id: '0',
                lineSlots: [],
                text: '',
                type: ImageType.Sentence,
                words: ['1', '2', '3'],
            };

            const words = [90, 180, 270].map<Word>((angle, i) => ({
                circle: { distance: 250, angle, r: 100 },
                id: (i + 1).toString(),
                letters: [],
                lineSlots: [],
                parentId: sentence.id,
                text: '',
                type: ImageType.Word,
            }));

            const store = createTestStore({
                image: {
                    rootCircleId: '',
                    circles: {
                        [words[0].id]: words[0],
                        [words[1].id]: words[1],
                        [words[2].id]: words[2],
                        [sentence.id]: sentence,
                    },
                    lineSlots: {},
                    lineConnections: {},
                    svgSize: 1000,
                },
            });

            return { store, words };
        };

        it('should adjust word being outside of sentence', () => {
            const { store, words } = setup();
            store.dispatch(selectWord(words[0].id));
            store.dispatch(moveWord(words[0].id, { distance: 2000 }));

            const state = store.getState();
            const circle = state.image.circles[words[0].id]!.circle;

            expect(circle).toMatchObject({ distance: 400 });
        });

        it('should not adjust word on sentence line', () => {
            const { store, words } = setup();
            store.dispatch(selectWord(words[0].id));
            store.dispatch(moveWord(words[0].id, { distance: 500 }));

            const state = store.getState();
            const circle = state.image.circles[words[0].id]!.circle;

            expect(circle).toMatchObject({ distance: 400 });
        });

        it('should not adjust word inside of sentence', () => {
            const { store, words } = setup();
            store.dispatch(selectWord(words[0].id));
            store.dispatch(moveWord(words[0].id, { distance: 1 }));

            const state = store.getState();
            const circle = state.image.circles[words[0].id]!.circle;

            expect(circle).toMatchObject({ distance: 1 });
        });

        it('should adjust first word angle if less than 0 degrees', () => {
            const { store, words } = setup();
            store.dispatch(selectWord(words[0].id));
            store.dispatch(moveWord(words[0].id, { angle: -10 }));

            const state = store.getState();
            const circle = state.image.circles[words[0].id]!.circle;

            expect(circle).toMatchObject({ angle: 0 });
        });

        it('should adjust word angle to stay after lesser angle word', () => {
            const { store, words } = setup();
            store.dispatch(selectWord(words[1].id));
            store.dispatch(moveWord(words[1].id, { angle: 80 }));

            const state = store.getState();
            const circle = state.image.circles[words[1].id]!.circle;

            expect(circle).toMatchObject({ angle: 90 });
        });

        it('should adjust word angle to stay before greater angle word', () => {
            const { store, words } = setup();
            store.dispatch(selectWord(words[1].id));
            store.dispatch(moveWord(words[1].id, { angle: 280 }));

            const state = store.getState();
            const circle = state.image.circles[words[1].id]!.circle;

            expect(circle).toMatchObject({ angle: 270 });
        });

        it('should adjust last word angle if greater than 360 degrees', () => {
            const { store, words } = setup();
            store.dispatch(selectWord(words[2].id));
            store.dispatch(moveWord(words[2].id, { angle: 370 }));

            const state = store.getState();
            const circle = state.image.circles[words[2].id]!.circle;

            expect(circle).toMatchObject({ angle: 360 });
        });
    });

    describe('Move consonant', () => {
        const setup = () => {
            const word: Word = {
                id: '0',
                circle: { distance: 0, angle: 0, r: 100 },
                letters: ['1', '2', '3', '4'],
                lineSlots: [],
                parentId: '',
                text: '',
                type: ImageType.Word,
            };

            const consonants = [
                ConsonantPlacement.DeepCut,
                ConsonantPlacement.Inside,
                ConsonantPlacement.ShallowCut,
                ConsonantPlacement.OnLine,
            ].map<Consonant>((placement, i) => ({
                circle: { distance: 250, angle: i * 90, r: 10 },
                id: (i + 1).toString(),
                dots: [],
                lineSlots: [],
                parentId: word.id,
                text: '',
                type: ImageType.Consonant,
                placement,
                decoration: ConsonantDecoration.None,
            }));

            const store = createTestStore({
                image: {
                    rootCircleId: '',
                    circles: {
                        [consonants[0].id]: consonants[0],
                        [consonants[1].id]: consonants[1],
                        [consonants[2].id]: consonants[2],
                        [consonants[3].id]: consonants[3],
                        [word.id]: word,
                    },
                    lineSlots: {},
                    lineConnections: {},
                    svgSize: 1000,
                },
            });

            return { store, consonants };
        };

        it('should adjust deep cut consonant being outside of word', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[0].id));
            store.dispatch(moveConsonant(consonants[0].id, { distance: 1000 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[0].id]!.circle;

            expect(circle.distance).toBeLessThanOrEqual(100);
        });

        it('should adjust deep cut consonant being inside of word', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[0].id));
            store.dispatch(moveConsonant(consonants[0].id, { distance: 0 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[0].id]!.circle;

            expect(circle.distance).toBeGreaterThan(90);
        });

        it('should adjust inside consonant being outside of word', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[1].id));
            store.dispatch(moveConsonant(consonants[1].id, { distance: 1000 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[1].id]!.circle;

            expect(circle.distance).toBe(90);
        });

        it('should adjust inside consonant on word line', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[1].id));
            store.dispatch(moveConsonant(consonants[1].id, { distance: 100 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[1].id]!.circle;

            expect(circle.distance).toBe(90);
        });

        it('should not adjust inside consonant being inside of word', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[1].id));
            store.dispatch(moveConsonant(consonants[1].id, { distance: 0 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[1].id]!.circle;

            expect(circle.distance).toBe(0);
        });

        it('should adjust shallow cut consonant being outside of word', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[2].id));
            store.dispatch(moveConsonant(consonants[2].id, { distance: 1000 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[2].id]!.circle;

            expect(circle.distance).toBeLessThan(110);
        });

        it('should adjust shallow cut consonant being inside of word', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[2].id));
            store.dispatch(moveConsonant(consonants[2].id, { distance: 0 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[2].id]!.circle;

            expect(circle.distance).toBeGreaterThanOrEqual(100);
        });

        it('should adjust online consonant being outside of word', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[3].id));
            store.dispatch(moveConsonant(consonants[3].id, { distance: 1000 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[3].id]!.circle;

            expect(circle.distance).toBeGreaterThanOrEqual(100);
        });

        it('should not adjust online consonant on word line', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[3].id));
            store.dispatch(moveConsonant(consonants[3].id, { distance: 100 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[3].id]!.circle;

            expect(circle.distance).toBeGreaterThanOrEqual(100);
        });

        it('should adjust online consonant being inside of word', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[3].id));
            store.dispatch(moveConsonant(consonants[3].id, { distance: 0 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[3].id]!.circle;

            expect(circle.distance).toBeGreaterThanOrEqual(100);
        });

        it('should adjust first consonant angle if less than 0 degrees', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[0].id));
            store.dispatch(moveConsonant(consonants[0].id, { angle: -10 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[0].id]!.circle;

            expect(circle).toMatchObject({ angle: 0 });
        });

        it('should adjust consonant angle to stay after lesser angle consonant', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[2].id));
            store.dispatch(moveConsonant(consonants[2].id, { angle: 80 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[2].id]!.circle;

            expect(circle).toMatchObject({ angle: 90 });
        });

        it('should adjust consonant angle to stay before greater angle consonant', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[2].id));
            store.dispatch(moveConsonant(consonants[2].id, { angle: 280 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[2].id]!.circle;

            expect(circle).toMatchObject({ angle: 270 });
        });

        it('should adjust last consonant angle if greater than 360 degrees', () => {
            const { store, consonants } = setup();
            store.dispatch(selectConsonant(consonants[3].id));
            store.dispatch(moveConsonant(consonants[3].id, { angle: 370 }));

            const state = store.getState();
            const circle = state.image.circles[consonants[3].id]!.circle;

            expect(circle).toMatchObject({ angle: 360 });
        });
    });

    describe('Move Vocal', () => {
        const setup = () => {
            const word: Word = {
                id: '0',
                circle: { distance: 0, angle: 0, r: 100 },
                letters: ['1', '2', '3'],
                lineSlots: [],
                parentId: '',
                text: '',
                type: ImageType.Word,
            };

            const vocals = [VocalPlacement.OnLine, VocalPlacement.Outside, VocalPlacement.Inside].map<Vocal>(
                (placement, i) => ({
                    circle: {
                        distance: {
                            [VocalPlacement.OnLine]: 100,
                            [VocalPlacement.Outside]: 110,
                            [VocalPlacement.Inside]: 90,
                        }[placement],
                        angle: (i + 1) * 90,
                        r: 10,
                    },
                    id: (i + 1).toString(),
                    dots: [],
                    lineSlots: [],
                    parentId: word.id,
                    text: '',
                    type: ImageType.Vocal,
                    placement,
                    decoration: VocalDecoration.None,
                })
            );

            const store = createTestStore({
                image: {
                    rootCircleId: '',
                    circles: {
                        [vocals[0].id]: vocals[0],
                        [vocals[1].id]: vocals[1],
                        [vocals[2].id]: vocals[2],
                        [word.id]: word,
                    },
                    lineSlots: {},
                    lineConnections: {},
                    svgSize: 1000,
                },
            });

            return { store, vocals };
        };

        it('should adjust OnLine vocal being outside of word', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[0].id));
            store.dispatch(moveVocal(vocals[0].id, { distance: 1000 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[0].id]!.circle;

            expect(circle.distance).toBeLessThanOrEqual(100);
        });

        it('should adjust OnLine vocal being inside of word', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[0].id));
            store.dispatch(moveVocal(vocals[0].id, { distance: 0 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[0].id]!.circle;

            expect(circle.distance).toBeLessThanOrEqual(100);
        });

        it('should not adjust OnLine vocal being on word line', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[0].id));
            store.dispatch(moveVocal(vocals[0].id, { distance: 100 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[0].id]!.circle;

            expect(circle.distance).toBeLessThanOrEqual(100);
        });

        it('should adjust Outside vocal being inside of word', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[1].id));
            store.dispatch(moveVocal(vocals[1].id, { distance: 0 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[1].id]!.circle;

            expect(circle.distance).toBeLessThanOrEqual(110);
        });

        it('should not adjust Outside vocal being outside of word', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[1].id));
            store.dispatch(moveVocal(vocals[1].id, { distance: 1000 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[1].id]!.circle;

            expect(circle.distance).toBeLessThanOrEqual(1000);
        });

        it('should adjust Outside vocal being on word line', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[1].id));
            store.dispatch(moveVocal(vocals[1].id, { distance: 100 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[1].id]!.circle;

            expect(circle.distance).toBeLessThanOrEqual(110);
        });

        it('should not adjust Inside vocal being inside of word', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[2].id));
            store.dispatch(moveVocal(vocals[2].id, { distance: 0 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[2].id]!.circle;

            expect(circle.distance).toBeLessThanOrEqual(0);
        });

        it('should adjust Inside vocal being outside of word', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[2].id));
            store.dispatch(moveVocal(vocals[2].id, { distance: 1000 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[2].id]!.circle;

            expect(circle.distance).toBeLessThanOrEqual(90);
        });

        it('should adjust Inside vocal being on word line', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[2].id));
            store.dispatch(moveVocal(vocals[2].id, { distance: 100 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[2].id]!.circle;

            expect(circle.distance).toBeLessThanOrEqual(90);
        });

        it('should adjust first vocal angle if less than 0 degrees', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[0].id));
            store.dispatch(moveVocal(vocals[0].id, { angle: -10 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[0].id]!.circle;

            expect(circle).toMatchObject({ angle: 0 });
        });

        it('should adjust vocal angle to stay after lesser angle vocal', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[1].id));
            store.dispatch(moveVocal(vocals[1].id, { angle: 80 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[1].id]!.circle;

            expect(circle).toMatchObject({ angle: 90 });
        });

        it('should adjust vocal angle to stay before greater angle vocal', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[1].id));
            store.dispatch(moveVocal(vocals[1].id, { angle: 280 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[1].id]!.circle;

            expect(circle).toMatchObject({ angle: 270 });
        });

        it('should adjust last vocal angle if greater than 360 degrees', () => {
            const { store, vocals } = setup();
            store.dispatch(selectVocal(vocals[2].id));
            store.dispatch(moveVocal(vocals[2].id, { angle: 370 }));

            const state = store.getState();
            const circle = state.image.circles[vocals[2].id]!.circle;

            expect(circle).toMatchObject({ angle: 360 });
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

            const store = createTestStore({
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
            store.dispatch(selectDot(dot.id));
            store.dispatch(moveDot(dot.id, { distance: 2000 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ distance: 100 });
        });

        it('should not adjust dot on consonant line', () => {
            const { store, dot } = setup();
            store.dispatch(selectDot(dot.id));
            store.dispatch(moveDot(dot.id, { distance: 100 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ distance: 100 });
        });

        it('should not adjust dot inside of consonant', () => {
            const { store, dot } = setup();
            store.dispatch(selectDot(dot.id));
            store.dispatch(moveDot(dot.id, { distance: 1 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ distance: 1 });
        });

        it('should adjust dot angle being greater 360 degrees', () => {
            const { store, dot } = setup();
            store.dispatch(selectDot(dot.id));
            store.dispatch(moveDot(dot.id, { angle: 370 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ angle: 0 });
        });

        it('should adjust dot angle being less than 0 degrees', () => {
            const { store, dot } = setup();
            store.dispatch(selectDot(dot.id));
            store.dispatch(moveDot(dot.id, { angle: -10 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ angle: 360 });
        });

        it('should not adjust dot angle being between 0 and 360 degrees', () => {
            const { store, dot } = setup();
            store.dispatch(selectDot(dot.id));
            store.dispatch(moveDot(dot.id, { angle: 180 }));

            const state = store.getState();
            const circle = state.image.circles[dot.id]!.circle;

            expect(circle).toMatchObject({ angle: 180 });
        });
    });

    describe('Move Line Slot', () => {
        describe('Sentence', () => {
            const setup = () => {
                const sentence: Sentence = {
                    circle: { r: 500, angle: 0, distance: 0 },
                    id: '0',
                    lineSlots: ['1'],
                    text: '',
                    type: ImageType.Sentence,
                    words: [],
                };

                const lineSlot: LineSlot = {
                    angle: 180,
                    distance: 500,
                    id: '1',
                    parentId: sentence.id,
                    type: ImageType.LineSlot,
                };

                const store = createTestStore({
                    image: {
                        rootCircleId: '',
                        circles: { [sentence.id]: sentence },
                        lineSlots: { [lineSlot.id]: lineSlot },
                        lineConnections: {},
                        svgSize: 1000,
                    },
                });

                return { lineSlot, store };
            };

            it('should not change distance', () => {
                const { lineSlot, store } = setup();

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { distance: 400 }));

                const state = store.getState();
                const distance = state.image.lineSlots[lineSlot.id]!.distance;

                expect(distance).toBe(500);
            });

            it('should change angle', () => {
                const { lineSlot, store } = setup();

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 270 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;

                expect(angle).toBe(270);
            });
        });

        describe('Word', () => {
            const setup = () => {
                const word: Word = {
                    circle: { r: 200, angle: 0, distance: 0 },
                    id: '0',
                    lineSlots: ['1'],
                    parentId: '',
                    text: '',
                    type: ImageType.Word,
                    letters: [],
                };

                const lineSlot: LineSlot = {
                    angle: 180,
                    distance: 200,
                    id: '1',
                    parentId: word.id,
                    type: ImageType.LineSlot,
                };

                const store = createTestStore({
                    image: {
                        rootCircleId: '',
                        circles: { [word.id]: word },
                        lineSlots: { [lineSlot.id]: lineSlot },
                        lineConnections: {},
                        svgSize: 1000,
                    },
                });

                return { lineSlot, store };
            };

            it('should not change distance', () => {
                const { lineSlot, store } = setup();

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { distance: 200 }));

                const state = store.getState();
                const distance = state.image.lineSlots[lineSlot.id]!.distance;

                expect(distance).toBe(200);
            });

            it('should change angle', () => {
                const { lineSlot, store } = setup();

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 270 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;

                expect(angle).toBe(270);
            });
        });

        describe('Consonant', () => {
            const word: Word = {
                circle: { r: 200, angle: 0, distance: 0 },
                id: '0',
                lineSlots: ['1'],
                parentId: '',
                text: '',
                type: ImageType.Word,
                letters: ['1'],
            };

            const consonants = [
                ConsonantPlacement.DeepCut,
                ConsonantPlacement.Inside,
                ConsonantPlacement.ShallowCut,
                ConsonantPlacement.OnLine,
            ].map<Consonant>((placement, index) => ({
                circle: {
                    r: 50,
                    angle: 0,
                    distance: {
                        [ConsonantPlacement.DeepCut]: 225,
                        [ConsonantPlacement.Inside]: 50,
                        [ConsonantPlacement.ShallowCut]: 200,
                        [ConsonantPlacement.OnLine]: 200,
                    }[placement],
                },
                decoration: ConsonantDecoration.SingleLine,
                dots: [],
                id: (index + 1).toString(),
                lineSlots: [],
                parentId: '0',
                placement,
                text: '',
                type: ImageType.Consonant,
            }));

            const lineSlots = consonants.map<LineSlot>((consonant, index) => ({
                angle: 180,
                distance: 50,
                id: (index + consonants.length + 1).toString(),
                parentId: consonant.id,
                type: ImageType.LineSlot,
            }));

            const pairs = zip(consonants, lineSlots) as [Consonant, LineSlot][];

            const setupStore = () =>
                createTestStore({
                    image: {
                        rootCircleId: '',
                        circles: [word, ...consonants].reduce((acc, it) => ({ ...acc, [it.id]: it }), {}),
                        lineSlots: lineSlots.reduce((acc, it) => ({ ...acc, [it.id]: it }), {}),
                        lineConnections: {},
                        svgSize: 1000,
                    },
                });

            pairs.forEach(([consonant, lineSlot]) => {
                it(`should not change distance for ${consonant.placement}`, () => {
                    const store = setupStore();
                    store.dispatch(selectLineSlot(lineSlot.id));
                    store.dispatch(moveLineSlot(lineSlot.id, { distance: 10 }));

                    const state = store.getState();
                    const distance = state.image.lineSlots[lineSlot.id]!.distance;

                    expect(distance).toBe(50);
                });
            });

            it('should clamp angle to minAngle for DeepCut', () => {
                const store = setupStore();
                const [_consonant, lineSlot] = pairs[0];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 10 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const minAngle = state.work.constraints[lineSlot.id]!.angle.minAngle;

                expect(angle).toBe(minAngle);
            });

            it('should clamp angle to maxAngle for DeepCut', () => {
                const store = setupStore();
                const [_consonant, lineSlot] = pairs[0];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 350 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const maxAngle = state.work.constraints[lineSlot.id]!.angle.maxAngle;

                expect(angle).toBe(maxAngle);
            });

            it('should clamp angle to minAngle for Inside', () => {
                const store = setupStore();
                const [_consonant, lineSlot] = pairs[1];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 360 + 10 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const minAngle = state.work.constraints[lineSlot.id]!.angle.minAngle;

                expect(angle).toBe(minAngle);
            });

            it('should clamp angle to maxAngle for Inside', () => {
                const store = setupStore();
                const [_consonant, lineSlot] = pairs[1];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: -360 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const maxAngle = state.work.constraints[lineSlot.id]!.angle.maxAngle;

                expect(angle).toBe(maxAngle);
            });

            it('should clamp angle to minAngle for ShallowCut', () => {
                const store = setupStore();
                const [_consonant, lineSlot] = pairs[2];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 10 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const minAngle = state.work.constraints[lineSlot.id]!.angle.minAngle;

                expect(angle).toBe(minAngle);
            });

            it('should clamp angle to maxAngle for ShallowCut', () => {
                const store = setupStore();
                const [_consonant, lineSlot] = pairs[2];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 350 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const maxAngle = state.work.constraints[lineSlot.id]!.angle.maxAngle;

                expect(angle).toBe(maxAngle);
            });

            it('should clamp angle to minAngle for OnLine', () => {
                const store = setupStore();
                const [_consonant, lineSlot] = pairs[3];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 360 + 10 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const minAngle = state.work.constraints[lineSlot.id]!.angle.minAngle;

                expect(angle).toBe(minAngle);
            });

            it('should clamp angle to maxAngle for OnLine', () => {
                const store = setupStore();
                const [_consonant, lineSlot] = pairs[3];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: -360 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const maxAngle = state.work.constraints[lineSlot.id]!.angle.maxAngle;

                expect(angle).toBe(maxAngle);
            });
        });

        describe('Vocal', () => {
            const word: Word = {
                circle: { r: 200, angle: 0, distance: 0 },
                id: '0',
                lineSlots: ['1'],
                parentId: '',
                text: '',
                type: ImageType.Word,
                letters: ['1'],
            };

            const vocals = [VocalDecoration.LineInside, VocalDecoration.LineOutside].map<Vocal>(
                (decoration, index) => ({
                    circle: { r: 50, angle: 0, distance: 200 },
                    id: (index + 1).toString(),
                    lineSlots: [],
                    parentId: '1',
                    placement: VocalPlacement.OnLine,
                    text: '',
                    type: ImageType.Vocal,
                    decoration,
                })
            );

            const lineSlots = vocals.map<LineSlot>((vocal, index) => ({
                angle: vocal.decoration === VocalDecoration.LineInside ? 180 : 0,
                distance: 50,
                id: (index + vocals.length + 1).toString(),
                parentId: vocal.id,
                type: ImageType.LineSlot,
            }));

            const pairs = zip(vocals, lineSlots) as [Vocal, LineSlot][];

            const setupStore = () =>
                createTestStore({
                    image: {
                        rootCircleId: '',
                        circles: [word, ...vocals].reduce((acc, it) => ({ ...acc, [it.id]: it }), {}),
                        lineSlots: lineSlots.reduce((acc, it) => ({ ...acc, [it.id]: it }), {}),
                        lineConnections: {},
                        svgSize: 1000,
                    },
                });

            pairs.forEach(([vocal, lineSlot]) => {
                it(`should not change distance for ${vocal.decoration}`, () => {
                    const store = setupStore();
                    store.dispatch(selectLineSlot(lineSlot.id));
                    store.dispatch(moveLineSlot(lineSlot.id, { distance: 10 }));

                    const state = store.getState();
                    const distance = state.image.lineSlots[lineSlot.id]!.distance;

                    expect(distance).toBe(50);
                });
            });

            it('should clamp angle to minAngle for LineInside', () => {
                const store = setupStore();
                const [_vocal, lineSlot] = pairs[0];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 10 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const minAngle = state.work.constraints[lineSlot.id]!.angle.minAngle;

                expect(angle).toBe(minAngle);
            });

            it('should clamp angle to maxAngle for LineInside', () => {
                const store = setupStore();
                const [_vocal, lineSlot] = pairs[0];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 280 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const maxAngle = state.work.constraints[lineSlot.id]!.angle.maxAngle;

                expect(angle).toBe(maxAngle);
            });

            it('should clamp angle to minAngle for LineOutside', () => {
                const store = setupStore();
                const [_vocal, lineSlot] = pairs[1];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 260 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const minAngle = state.work.constraints[lineSlot.id]!.angle.minAngle;

                expect(angle).toBe(minAngle);
            });

            it('should clamp angle to maxAngle for LineOutside', () => {
                const store = setupStore();
                const [_vocal, lineSlot] = pairs[1];

                store.dispatch(selectLineSlot(lineSlot.id));
                store.dispatch(moveLineSlot(lineSlot.id, { angle: 100 }));

                const state = store.getState();
                const angle = state.image.lineSlots[lineSlot.id]!.angle;
                const maxAngle = state.work.constraints[lineSlot.id]!.angle.maxAngle;

                expect(angle).toBe(maxAngle);
            });
        });
    });
});
