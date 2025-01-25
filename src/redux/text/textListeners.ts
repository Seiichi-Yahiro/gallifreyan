import type { AppStartListening } from '@/redux/listener';
import {
    dotId,
    letterId,
    lineSlotId,
    sentenceId,
    wordId,
} from '@/redux/text/ids';
import { LetterType } from '@/redux/text/letterTypes';
import textActions from '@/redux/text/textActions';
import { TextElementType, type TextLetterPair } from '@/redux/text/textTypes';
import {
    charToLetter,
    digraphReducer,
    dotAmount,
    lineSlotAmount,
    sanitizeSentence,
} from '@/redux/text/textUtils';
import { zipLongest } from '@/utils/zip';
import { isAnyOf } from '@reduxjs/toolkit';
import { range } from 'lodash';

export const handleSentenceElement = (startListening: AppStartListening) =>
    startListening({
        actionCreator: textActions.setText,
        effect: (action, api) => {
            const state = api.getState();
            const newText = sanitizeSentence(action.payload);

            if (!state.text.rootElement && newText.length > 0) {
                api.dispatch(
                    textActions.addSentence({
                        elementType: TextElementType.Sentence,
                        id: sentenceId(),
                        text: newText,
                        words: [],
                    }),
                );
            } else if (state.text.rootElement && newText.length === 0) {
                api.dispatch(textActions.removeSentence());
            } else if (state.text.rootElement) {
                const currentSentence =
                    state.text.elements[state.text.rootElement];

                if (!currentSentence || currentSentence.text === newText) {
                    return;
                }

                api.dispatch(
                    textActions.updateSentenceText({
                        id: currentSentence.id,
                        text: newText,
                    }),
                );
            }
        },
    });

export const handleWordElement = (startListening: AppStartListening) =>
    startListening({
        matcher: isAnyOf(
            textActions.addSentence,
            textActions.updateSentenceText,
        ),
        effect: (
            action:
                | ReturnType<typeof textActions.addSentence>
                | ReturnType<typeof textActions.updateSentenceText>,
            api,
        ) => {
            const originalState = api.getOriginalState();

            const oldSentenceElement =
                originalState.text.elements[action.payload.id];

            const newSentenceElement = action.payload;

            const oldWords =
                oldSentenceElement?.words.map(
                    (wordId) => originalState.text.elements[wordId],
                ) ?? [];

            const newWords = newSentenceElement.text.split(' ');

            for (const [oldWordElement, newWord] of zipLongest(
                oldWords,
                newWords,
            )) {
                if (!oldWordElement && newWord) {
                    api.dispatch(
                        textActions.addWord({
                            elementType: TextElementType.Word,
                            parent: newSentenceElement.id,
                            id: wordId(),
                            text: newWord,
                            letters: [],
                        }),
                    );
                    continue;
                }

                if (oldWordElement && !newWord) {
                    api.dispatch(textActions.removeWord(oldWordElement.id));
                    continue;
                }

                if (
                    oldWordElement &&
                    newWord &&
                    oldWordElement.text !== newWord
                ) {
                    api.dispatch(
                        textActions.updateWordText({
                            id: oldWordElement.id,
                            text: newWord,
                        }),
                    );
                }
            }
        },
    });

export const handleLetterElement = (startListening: AppStartListening) =>
    startListening({
        matcher: isAnyOf(textActions.addWord, textActions.updateWordText),
        effect: (
            action:
                | ReturnType<typeof textActions.addWord>
                | ReturnType<typeof textActions.updateWordText>,
            api,
        ) => {
            const originalState = api.getOriginalState();

            const oldWordElement =
                originalState.text.elements[action.payload.id];

            const newWordElement = action.payload;

            const oldLetters =
                oldWordElement?.letters.map(
                    (letterId) => originalState.text.elements[letterId],
                ) ?? [];

            const newLetters = newWordElement.text
                .split('')
                .map((text): TextLetterPair => {
                    const letter = charToLetter(text);

                    if (!letter) {
                        throw new Error(`Invalid letter "${text}"`);
                    }

                    return {
                        text,
                        letter,
                    };
                })
                .reduce(digraphReducer, []);

            for (const [oldLetterElement, newLetter] of zipLongest(
                oldLetters,
                newLetters,
            )) {
                if (!oldLetterElement && newLetter) {
                    api.dispatch(
                        textActions.addLetter({
                            elementType: TextElementType.Letter,
                            parent: newWordElement.id,
                            id: letterId(),
                            text: newLetter.text,
                            letter: newLetter.letter,
                            dots: [],
                            lineSlots: [],
                        }),
                    );
                    continue;
                }

                if (oldLetterElement && !newLetter) {
                    api.dispatch(textActions.removeLetter(oldLetterElement.id));
                    continue;
                }

                if (
                    oldLetterElement &&
                    newLetter &&
                    oldLetterElement.text !== newLetter.text
                ) {
                    api.dispatch(
                        textActions.updateLetterText({
                            id: oldLetterElement.id,
                            text: newLetter.text,
                            letter: newLetter.letter,
                        }),
                    );
                }
            }
        },
    });

export const handleDotElement = (startListening: AppStartListening) =>
    startListening({
        matcher: isAnyOf(textActions.addLetter, textActions.updateLetterText),
        effect: (
            action:
                | ReturnType<typeof textActions.addLetter>
                | ReturnType<typeof textActions.updateLetterText>,
            api,
        ) => {
            const originalState = api.getOriginalState();

            const oldLetterElement =
                originalState.text.elements[action.payload.id];

            const newLetterElement = action.payload;

            const oldDots =
                oldLetterElement?.dots.map(
                    (dotId) => originalState.text.elements[dotId],
                ) ?? [];

            const numberOfDots =
                newLetterElement.letter.letterType === LetterType.Vocal
                    ? 0
                    : dotAmount(newLetterElement.letter.decoration);

            for (const [oldDotElement, newDotIndex] of zipLongest(
                oldDots,
                range(numberOfDots),
            )) {
                if (!oldDotElement && newDotIndex !== undefined) {
                    api.dispatch(
                        textActions.addDot({
                            elementType: TextElementType.Dot,
                            parent: newLetterElement.id,
                            id: dotId(),
                        }),
                    );
                } else if (oldDotElement && newDotIndex === undefined) {
                    api.dispatch(textActions.removeDot(oldDotElement.id));
                }
            }
        },
    });

export const handleLineSlotElement = (startListening: AppStartListening) =>
    startListening({
        matcher: isAnyOf(textActions.addLetter, textActions.updateLetterText),
        effect: (
            action:
                | ReturnType<typeof textActions.addLetter>
                | ReturnType<typeof textActions.updateLetterText>,
            api,
        ) => {
            const originalState = api.getOriginalState();

            const oldLetterElement =
                originalState.text.elements[action.payload.id];

            const newLetterElement = action.payload;

            const oldLineSlots =
                oldLetterElement?.lineSlots.map(
                    (lineSlotId) => originalState.text.elements[lineSlotId],
                ) ?? [];

            const numberOfLineSlots = lineSlotAmount(
                newLetterElement.letter.decoration,
            );

            for (const [oldLineSlotElement, newLineSlotIndex] of zipLongest(
                oldLineSlots,
                range(numberOfLineSlots),
            )) {
                if (!oldLineSlotElement && newLineSlotIndex !== undefined) {
                    api.dispatch(
                        textActions.addLineSlot({
                            elementType: TextElementType.LineSlot,
                            parent: newLetterElement.id,
                            id: lineSlotId(),
                        }),
                    );
                } else if (
                    oldLineSlotElement &&
                    newLineSlotIndex === undefined
                ) {
                    api.dispatch(
                        textActions.removeLineSlot(oldLineSlotElement.id),
                    );
                }
            }
        },
    });

export const removeWordChildren = (startListening: AppStartListening) =>
    startListening({
        actionCreator: textActions.removeWord,
        effect: (action, api) => {
            const originalState = api.getOriginalState();
            const removedWordElement =
                originalState.text.elements[action.payload];

            if (!removedWordElement) {
                // reducer already throws
                return;
            }

            for (const letter of removedWordElement.letters) {
                api.dispatch(textActions.removeLetter(letter));
            }
        },
    });

export const removeLetterChildren = (startListening: AppStartListening) =>
    startListening({
        actionCreator: textActions.removeLetter,
        effect: (action, api) => {
            const originalState = api.getOriginalState();
            const removedLetterElement =
                originalState.text.elements[action.payload];

            if (!removedLetterElement) {
                // reducer already throws
                return;
            }

            for (const dot of removedLetterElement.dots) {
                api.dispatch(textActions.removeDot(dot));
            }

            for (const lineSlot of removedLetterElement.lineSlots) {
                api.dispatch(textActions.removeLineSlot(lineSlot));
            }
        },
    });

export const setupTextListeners = (startListening: AppStartListening) => {
    handleSentenceElement(startListening);
    handleWordElement(startListening);
    handleLetterElement(startListening);
    handleDotElement(startListening);
    handleLineSlotElement(startListening);

    removeWordChildren(startListening);
    removeLetterChildren(startListening);
};
