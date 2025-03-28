import mAngle from '@/math/angle';
import mCircle, {
    CircleIntersectionType,
    type Circle as MCircle,
    type TwoCircleIntersections,
} from '@/math/circle';
import mVec2 from '@/math/vec';
import type { MainState } from '@/redux/reducer';
import svgActions from '@/redux/svg/svgActions';
import type { CirclesDict, LineSlotDict } from '@/redux/svg/svgTypes';
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
    isAttachedLetterId,
    isLetterId,
    isStackedLetterId,
} from '@/redux/text/ids';
import {
    ConsonantPlacement,
    LetterType,
    VocalDecoration,
} from '@/redux/text/letterTypes';
import textActions from '@/redux/text/textActions';
import { TextElementType } from '@/redux/text/textTypes';
import { type ActionReducerMapBuilder, isAnyOf } from '@reduxjs/toolkit';
import { match } from 'ts-pattern';

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

                word.letters.forEach((childId, letterIndex) => {
                    match(childId)
                        .when(isLetterId, (letterId) => {
                            const letter = state.text.elements[letterId];
                            const letterCircle = state.svg.circles[letterId];

                            if (letter.letter.letterType === LetterType.Vocal) {
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
                            } else {
                                letterCircle.radius = defaultConsonantRadius(
                                    wordCircle.radius,
                                    word.letters.length,
                                );

                                letterCircle.position =
                                    defaultConsonantPosition(
                                        wordCircle.radius,
                                        letterCircle.radius,
                                        word.letters.length,
                                        letter.letter.placement,
                                        letterIndex,
                                    );
                            }

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
                        })
                        .when(isStackedLetterId, () => {
                            // TODO
                        })
                        .when(isAttachedLetterId, () => {
                            // TODO
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

            for (const childId of letters) {
                match(childId)
                    .when(isLetterId, (letterId) => {
                        const letter = state.text.elements[letterId].letter;
                        const letterCircle = state.svg.circles[letterId];

                        if (
                            !(
                                letter.placement ===
                                    ConsonantPlacement.DeepCut ||
                                letter.placement ===
                                    ConsonantPlacement.ShallowCut
                            )
                        ) {
                            letterCircle.intersections = {
                                type: CircleIntersectionType.None,
                            };
                            return;
                        }

                        const letterMCircle: MCircle = {
                            radius: letterCircle.radius,
                            position: circleTransform(letterCircle.position),
                        };

                        const intersections = mCircle.intersections(
                            wordMCircle,
                            letterMCircle,
                        );

                        if (intersections.type === CircleIntersectionType.Two) {
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
                        } else if (
                            intersections.type === CircleIntersectionType.One
                        ) {
                            const transformedIntersection = mVec2.sub(
                                intersections.value,
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
                        } else {
                            letterCircle.intersections = intersections;
                        }
                    })
                    .when(isStackedLetterId, () => {
                        // TODO
                    })
                    .when(isAttachedLetterId, () => {
                        // TODO
                    })
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
        .addMatcher(textActions.addLetter.match, (state, action) => {
            state.svg.circles[action.payload.id] = {
                ...defaultCircle(),
                type: TextElementType.Letter,
                intersections: {
                    type: CircleIntersectionType.None,
                },
            };
        })
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
        .addMatcher(isAnyOf(textActions.addLineSlot), (state, action) => {
            state.svg.lineSlots[action.payload.id] = {
                position: {
                    distance: 0,
                    angle: mAngle.degree(0),
                },
            };
        })
        .addMatcher(isAnyOf(textActions.removeLineSlot), (state, action) => {
            delete state.svg.lineSlots[action.payload];
        });
};
