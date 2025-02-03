import type { MainState } from '@/redux/reducer';
import svgActions from '@/redux/svg/svgActions';
import type { CirclesDict, LineSlotDict } from '@/redux/svg/svgTypes';
import {
    defaultCircle,
    defaultConsonantPosition,
    defaultConsonantRadius,
    defaultDotPosition,
    defaultDotRadius,
    defaultLineSlot,
    defaultSentencePosition,
    defaultSentenceRadius,
    defaultVocalPosition,
    defaultVocalRadius,
    defaultWordPosition,
    defaultWordRadius,
} from '@/redux/svg/svgUtils';
import { LetterType } from '@/redux/text/letterTypes';
import textActions from '@/redux/text/textActions';
import { type ActionReducerMapBuilder, isAnyOf } from '@reduxjs/toolkit';

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

export const createSvgReducer = (
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

                        letterCircle.position = defaultConsonantPosition(
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

                    // TODO
                    /*letter.lineSlots.forEach((lineSlotId, lineSlotIndex) => {
                         state.svg.lineSlots[lineSlotId].position;
                    });*/
                });
            });
        })
        .addMatcher(
            isAnyOf(
                textActions.addSentence,
                textActions.addWord,
                textActions.addLetter,
                textActions.addDot,
            ),
            (state, action) => {
                state.svg.circles[action.payload.id] = defaultCircle();
            },
        )
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
            state.svg.lineSlots[action.payload.id] = defaultLineSlot();
        })
        .addMatcher(isAnyOf(textActions.removeLineSlot), (state, action) => {
            delete state.svg.lineSlots[action.payload];
        });
};
