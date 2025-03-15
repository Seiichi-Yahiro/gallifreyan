import mAngle from '@/math/angle';
import mCircle, {
    CircleIntersectionType,
    type Circle as MCircle,
    type TwoCircleIntersections,
} from '@/math/circle';
import mVec2 from '@/math/vec';
import type { MainState } from '@/redux/reducer';
import svgActions from '@/redux/svg/svgActions';
import type {
    CirclesDict,
    ConsonantCircle,
    LineSlotDict,
    VocalCircle,
} from '@/redux/svg/svgTypes';
import {
    circleTransform,
    defaultCircle,
    defaultConsonantPosition,
    defaultConsonantRadius,
    defaultDotPosition,
    defaultDotRadius,
    defaultLineSlotPosition,
    defaultSentencePosition,
    defaultSentenceRadius,
    defaultVocalPosition,
    defaultVocalRadius,
    defaultWordPosition,
    defaultWordRadius,
    sortIntersectionsByAngle,
    wordArcsFromIntersections,
} from '@/redux/svg/svgUtils';
import {
    convertConsonantIdToVocalId,
    convertVocalIdToConsonantId,
    isConsonantId,
    isVocalId,
} from '@/redux/text/ids';
import { ConsonantPlacement, VocalDecoration } from '@/redux/text/letterTypes';
import textActions from '@/redux/text/textActions';
import {
    type ConsonantElement,
    TextElementType,
    type VocalElement,
} from '@/redux/text/textTypes';
import { type ActionReducerMapBuilder, isAnyOf } from '@reduxjs/toolkit';
import { match, P } from 'ts-pattern';

export interface SvgState {
    size: number;
    circles: CirclesDict;
    lineSlots: LineSlotDict;
}

export const createInitialSvgState = (): SvgState => ({
    size: 1000,
    circles: {},
    lineSlots: {},
});

export const createSvgReducerCases = (
    builder: ActionReducerMapBuilder<MainState>,
) => {
    builder
        .addCase(svgActions.reset, (state, _action) => {
            if (!state.text.rootElement) {
                return;
            }

            const sentence = state.text.elements[state.text.rootElement];
            const sentenceCircle = state.svg.circles[sentence.id];

            sentenceCircle.radius = defaultSentenceRadius(state.svg.size);
            sentenceCircle.position = defaultSentencePosition();

            sentence.words.forEach((wordId, wordIndex) => {
                const word = state.text.elements[wordId];
                const wordCircle = state.svg.circles[wordId];

                wordCircle.radius = defaultWordRadius(
                    sentenceCircle.radius,
                    sentence.words.length,
                );

                wordCircle.position = defaultWordPosition(
                    sentenceCircle.radius,
                    wordCircle.radius,
                    sentence.words.length,
                    wordIndex,
                );

                word.letters.forEach((letterId, letterIndex) => {
                    const resetLineSlots = (
                        letter: VocalElement | ConsonantElement,
                        letterCircle: VocalCircle | ConsonantCircle,
                    ) => {
                        letter.lineSlots.forEach(
                            (lineSlotId, lineSlotIndex) => {
                                state.svg.lineSlots[lineSlotId].position =
                                    defaultLineSlotPosition(
                                        letterCircle.radius,
                                        letter.lineSlots.length,
                                        lineSlotIndex,
                                        letter.letter.decoration ===
                                            VocalDecoration.LineOutside,
                                    );
                            },
                        );
                    };

                    match(letterId)
                        .when(isVocalId, (vocalId) => {
                            const letter = state.text.elements[vocalId];
                            const letterCircle = state.svg.circles[vocalId];

                            letterCircle.radius = defaultVocalRadius(
                                wordCircle.radius,
                                word.letters.length,
                            );

                            letterCircle.position = defaultVocalPosition(
                                wordCircle.radius,
                                letterCircle.radius,
                                word.letters.length,
                                letter.letter.placement,
                                letterIndex,
                            );

                            resetLineSlots(letter, letterCircle);
                        })
                        .when(isConsonantId, (consonantId) => {
                            const letter = state.text.elements[consonantId];
                            const letterCircle = state.svg.circles[consonantId];

                            letterCircle.radius = defaultConsonantRadius(
                                wordCircle.radius,
                                word.letters.length,
                            );

                            letterCircle.position = defaultConsonantPosition(
                                wordCircle.radius,
                                letterCircle.radius,
                                word.letters.length,
                                letter.letter.placement,
                                letterIndex,
                            );

                            letter.dots.forEach((dotId, dotIndex) => {
                                const dotCircle = state.svg.circles[dotId];

                                dotCircle.radius = defaultDotRadius(
                                    letterCircle.radius,
                                );

                                dotCircle.position = defaultDotPosition(
                                    letterCircle.radius,
                                    dotCircle.radius,
                                    letter.dots.length,
                                    dotIndex,
                                );
                            });

                            resetLineSlots(letter, letterCircle);
                        })
                        .exhaustive();
                });
            });
        })
        .addCase(svgActions.calculateCircleIntersections, (state, action) => {
            const wordCircle = state.svg.circles[action.payload];
            wordCircle.intersections = [];

            const wordMCircle: MCircle = {
                radius: wordCircle.radius,
                position: mVec2.create(0, 0),
            };

            const letters = state.text.elements[action.payload].letters;

            for (const letterId of letters) {
                if (isVocalId(letterId)) {
                    continue;
                }

                const letter = state.text.elements[letterId].letter;
                const letterCircle = state.svg.circles[letterId];

                if (
                    !(
                        letter.placement === ConsonantPlacement.DeepCut ||
                        letter.placement === ConsonantPlacement.ShallowCut
                    )
                ) {
                    letterCircle.intersections = {
                        type: CircleIntersectionType.None,
                    };
                    continue;
                }

                const letterMCircle: MCircle = {
                    radius: letterCircle.radius,
                    position: circleTransform(letterCircle.position),
                };

                const intersections = mCircle.intersections(
                    wordMCircle,
                    letterMCircle,
                );

                match(intersections)
                    .with(
                        { type: CircleIntersectionType.Two },
                        (intersections) => {
                            const sortedIntersections =
                                sortIntersectionsByAngle(
                                    wordMCircle,
                                    letterMCircle,
                                    intersections.values,
                                );

                            wordCircle.intersections.push(sortedIntersections);

                            const transformedIntersections = sortedIntersections
                                .map((pos) =>
                                    mVec2.sub(pos, letterMCircle.position),
                                )
                                .map((pos) =>
                                    mVec2.rotate(pos, {
                                        ...letterCircle.position.angle,
                                        value: -letterCircle.position.angle
                                            .value,
                                    }),
                                ) as TwoCircleIntersections['values'];

                            letterCircle.intersections = {
                                type: CircleIntersectionType.Two,
                                values: transformedIntersections,
                            };
                        },
                    )
                    .with(
                        { type: CircleIntersectionType.One },
                        (intersection) => {
                            const transformedIntersection = mVec2.sub(
                                intersection.value,
                                letterMCircle.position,
                            );

                            const rotatedIntersection = mVec2.rotate(
                                transformedIntersection,
                                {
                                    ...letterCircle.position.angle,
                                    value: -letterCircle.position.angle.value,
                                },
                            );

                            letterCircle.intersections = {
                                type: CircleIntersectionType.One,
                                value: rotatedIntersection,
                            };
                        },
                    )
                    .with(
                        {
                            type: P.union(
                                CircleIntersectionType.None,
                                CircleIntersectionType.Infinity,
                            ),
                        },
                        (intersections) => {
                            letterCircle.intersections = intersections;
                        },
                    )
                    .exhaustive();
            }

            wordCircle.arcs = wordArcsFromIntersections(
                wordCircle.intersections,
            );
        });
};

export const createSvgReducerMatches = (
    builder: ActionReducerMapBuilder<MainState>,
) => {
    builder
        .addMatcher(textActions.addSentence.match, (state, action) => {
            state.svg.circles[action.payload.id] = {
                ...defaultCircle(),
                type: TextElementType.Sentence,
            };
        })
        .addMatcher(textActions.addWord.match, (state, action) => {
            state.svg.circles[action.payload.id] = {
                ...defaultCircle(),
                type: TextElementType.Word,
                intersections: [],
                arcs: [],
            };
        })
        .addMatcher(textActions.addVocal.match, (state, action) => {
            state.svg.circles[action.payload.id] = {
                ...defaultCircle(),
                type: TextElementType.Vocal,
            };
        })
        .addMatcher(
            textActions.convertConsonantToVocal.match,
            (state, action) => {
                state.svg.circles[
                    convertConsonantIdToVocalId(action.payload.oldId)
                ] = {
                    ...defaultCircle(),
                    type: TextElementType.Vocal,
                };

                delete state.svg.circles[action.payload.oldId];
            },
        )
        .addMatcher(textActions.addConsonant.match, (state, action) => {
            state.svg.circles[action.payload.id] = {
                ...defaultCircle(),
                type: TextElementType.Consonant,
                intersections: {
                    type: CircleIntersectionType.None,
                },
            };
        })
        .addMatcher(
            textActions.convertVocalToConsonant.match,
            (state, action) => {
                state.svg.circles[
                    convertVocalIdToConsonantId(action.payload.oldId)
                ] = {
                    ...defaultCircle(),
                    type: TextElementType.Consonant,
                    intersections: {
                        type: CircleIntersectionType.None,
                    },
                };

                delete state.svg.circles[action.payload.oldId];
            },
        )
        .addMatcher(textActions.addDot.match, (state, action) => {
            state.svg.circles[action.payload.id] = {
                ...defaultCircle(),
                type: TextElementType.Dot,
            };
        })
        .addMatcher(
            isAnyOf(
                textActions.removeSentence,
                textActions.removeWord,
                textActions.removeLetter,
                textActions.removeDot,
            ),
            (state, action) => {
                delete state.svg.circles[action.payload];
            },
        )
        .addMatcher(textActions.addLineSlot.match, (state, action) => {
            state.svg.lineSlots[action.payload.id] = {
                position: {
                    distance: 0,
                    angle: mAngle.degree(0),
                },
            };
        })
        .addMatcher(textActions.removeLineSlot.match, (state, action) => {
            delete state.svg.lineSlots[action.payload];
        });
};
