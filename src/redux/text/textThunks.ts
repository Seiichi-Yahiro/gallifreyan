import type { AppThunkAction } from '@/redux/store';
import svgActions from '@/redux/svg/svgActions';
import {
    type ConsonantId,
    consonantId,
    convertConsonantIdToVocalId,
    convertVocalIdToConsonantId,
    type DotId,
    dotId,
    type LetterId,
    type LineSlotId,
    lineSlotId,
    sentenceId,
    type SentenceId,
    type VocalId,
    vocalId,
    type WordId,
    wordId,
} from '@/redux/text/ids';
import {
    ConsonantDecoration,
    LetterType,
    VocalDecoration,
} from '@/redux/text/letterTypes';
import textActions from '@/redux/text/textActions';
import {
    type RawConsonantElement,
    type RawLetterElement,
    type RawVocalElement,
    TextElementType,
} from '@/redux/text/textTypes';
import {
    charToSingleLetter,
    dotAmount,
    lineSlotAmount,
    splitLetters,
    splitWords,
    textToDigraph,
} from '@/redux/text/textUtils';
import { range, zip } from 'lodash';
import { match, P } from 'ts-pattern';

const updateTree =
    (text: string): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        dispatch(compareSentence(text, state.main.text.rootElement));
    };

const compareSentence =
    (newSentenceText: string, existingId: SentenceId | null): AppThunkAction =>
    (dispatch, getState) => {
        if (!existingId && newSentenceText.length > 0) {
            dispatch(addSentence(newSentenceText));
            return;
        }

        if (existingId && newSentenceText.length === 0) {
            dispatch(removeSentence(existingId));
            return;
        }

        if (!existingId) {
            return;
        }

        const state = getState();
        const sentenceElement = state.main.text.elements[existingId];

        if (sentenceElement.text !== newSentenceText) {
            dispatch(
                textActions.updateSentenceText({
                    id: existingId,
                    text: newSentenceText,
                }),
            );

            zip(splitWords(newSentenceText), sentenceElement.words).forEach(
                ([newWordText, wordId]) =>
                    dispatch(
                        compareWord(existingId, newWordText ?? '', wordId),
                    ),
            );
        }
    };

const compareWord =
    (
        parent: SentenceId,
        newWordText: string,
        existingId?: WordId,
    ): AppThunkAction =>
    (dispatch, getState) => {
        if (!existingId && newWordText.length > 0) {
            dispatch(addWord(newWordText, parent));
            return;
        }

        if (existingId && newWordText.length === 0) {
            dispatch(removeWord(existingId));
            return;
        }

        if (!existingId) {
            return;
        }

        const state = getState();
        const wordElement = state.main.text.elements[existingId];

        if (wordElement.text !== newWordText) {
            dispatch(
                textActions.updateWordText({
                    id: existingId,
                    text: newWordText,
                }),
            );

            zip(
                splitLetters(newWordText, state.main.text.splitLetterOptions),
                wordElement.letters,
            ).forEach(([rawLetter, letterId]) =>
                dispatch(compareLetter(existingId, rawLetter, letterId)),
            );
        }
    };

const compareLetter =
    (
        parent: WordId,
        newRawLetter?: RawLetterElement,
        existingId?: LetterId,
    ): AppThunkAction =>
    (dispatch, getState) => {
        if (!existingId && newRawLetter) {
            dispatch(addLetter(newRawLetter, parent));
            return;
        }

        if (existingId && !newRawLetter) {
            dispatch(removeLetter(existingId));
            return;
        }

        if (!existingId || !newRawLetter) {
            return;
        }

        const state = getState();
        const letterElement = state.main.text.elements[existingId];

        if (letterElement.text !== newRawLetter.text) {
            match([letterElement, newRawLetter])
                .with(
                    [
                        { elementType: TextElementType.Vocal },
                        { letter: { letterType: LetterType.Vocal } },
                    ],
                    ([vocalElement, newRawVocal]) => {
                        dispatch(
                            textActions.updateVocalText({
                                id: vocalElement.id,
                                text: newRawVocal.text,
                                letter: newRawVocal.letter,
                            }),
                        );

                        dispatch(
                            compareLineSlots(
                                vocalElement.id,
                                newRawVocal.letter.decoration,
                                vocalElement.lineSlots,
                            ),
                        );
                    },
                )
                .with(
                    [
                        { elementType: TextElementType.Consonant },
                        {
                            letter: {
                                letterType: P.union(
                                    LetterType.Consonant,
                                    LetterType.Digraph,
                                ),
                            },
                        },
                    ],
                    ([consonantElement, newRawConsonant]) => {
                        dispatch(
                            textActions.updateConsonantText({
                                id: consonantElement.id,
                                text: newRawConsonant.text,
                                letter: newRawConsonant.letter,
                            }),
                        );

                        zip(
                            range(dotAmount(newRawConsonant.letter.decoration)),
                            consonantElement.dots,
                        ).forEach(([newIndex, dotId]) =>
                            dispatch(
                                compareDot(
                                    consonantElement.id,
                                    newIndex,
                                    dotId,
                                ),
                            ),
                        );

                        dispatch(
                            compareLineSlots(
                                consonantElement.id,
                                newRawConsonant.letter.decoration,
                                consonantElement.lineSlots,
                            ),
                        );
                    },
                )
                .with(
                    [
                        { elementType: TextElementType.Vocal },
                        {
                            letter: {
                                letterType: P.union(
                                    LetterType.Consonant,
                                    LetterType.Digraph,
                                ),
                            },
                        },
                    ],
                    ([vocalElement, newRawConsonant]) => {
                        dispatch(
                            convertVocalToConsonant(
                                vocalElement.id,
                                newRawConsonant,
                            ),
                        );
                    },
                )
                .with(
                    [
                        { elementType: TextElementType.Consonant },
                        { letter: { letterType: LetterType.Vocal } },
                    ],
                    ([consonantElement, newRawVocal]) => {
                        dispatch(
                            convertConsonantToVocal(
                                consonantElement.id,
                                newRawVocal,
                            ),
                        );
                    },
                )
                .exhaustive();
        }
    };

const convertConsonantToVocal =
    (oldId: ConsonantId, rawVocal: RawVocalElement): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const oldConsonant = state.main.text.elements[oldId];

        oldConsonant.dots.forEach((dotId) => {
            dispatch(textActions.removeDot(dotId));
        });

        dispatch(
            textActions.convertConsonantToVocal({
                oldId,
                text: rawVocal.text,
                letter: rawVocal.letter,
            }),
        );

        const newId = convertConsonantIdToVocalId(oldId);

        dispatch(
            compareLineSlots(
                newId,
                rawVocal.letter.decoration,
                oldConsonant.lineSlots,
            ),
        );
    };

const convertVocalToConsonant =
    (oldId: VocalId, rawConsonant: RawConsonantElement): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const oldVocal = state.main.text.elements[oldId];

        dispatch(
            textActions.convertVocalToConsonant({
                oldId,
                text: rawConsonant.text,
                letter: rawConsonant.letter,
            }),
        );

        const newId = convertVocalIdToConsonantId(oldId);

        range(dotAmount(rawConsonant.letter.decoration)).forEach(() =>
            dispatch(textActions.addDot({ id: dotId(), parent: newId })),
        );

        dispatch(
            compareLineSlots(
                newId,
                rawConsonant.letter.decoration,
                oldVocal.lineSlots,
            ),
        );
    };

const compareDot =
    (
        parent: ConsonantId,
        newIndex?: number,
        existingId?: DotId,
    ): AppThunkAction =>
    (dispatch, _getState) => {
        if (!existingId && newIndex !== undefined) {
            dispatch(textActions.addDot({ id: dotId(), parent }));
            return;
        }

        if (existingId && newIndex === undefined) {
            dispatch(textActions.removeDot(existingId));
        }
    };

const compareLineSlots =
    (
        parent: LetterId,
        newDecoration: VocalDecoration | ConsonantDecoration,
        currentIds: LineSlotId[],
    ): AppThunkAction =>
    (dispatch, _getState) => {
        zip(range(lineSlotAmount(newDecoration)), currentIds).forEach(
            ([newIndex, existingId]) => {
                if (!existingId && newIndex !== undefined) {
                    dispatch(
                        textActions.addLineSlot({ id: lineSlotId(), parent }),
                    );
                    return;
                }

                if (existingId && newIndex === undefined) {
                    dispatch(textActions.removeLineSlot(existingId));
                }
            },
        );
    };

const addSentence =
    (newSentenceText: string): AppThunkAction =>
    (dispatch, _getState) => {
        const id = sentenceId();

        dispatch(
            textActions.addSentence({
                id,
                text: newSentenceText,
            }),
        );

        splitWords(newSentenceText).forEach((newWordText) =>
            dispatch(addWord(newWordText, id)),
        );
    };

const addWord =
    (newWordText: string, parent: SentenceId): AppThunkAction =>
    (dispatch, getState) => {
        const id = wordId();

        dispatch(
            textActions.addWord({
                id,
                parent,
                text: newWordText,
            }),
        );

        const state = getState();

        splitLetters(newWordText, state.main.text.splitLetterOptions).forEach(
            (rawLetter) => {
                dispatch(addLetter(rawLetter, id));
            },
        );
    };

const addLetter =
    (
        rawLetter: RawLetterElement,
        parent: WordId,
        index?: number,
    ): AppThunkAction =>
    (dispatch, _getState) => {
        match(rawLetter)
            .with(
                {
                    letter: {
                        letterType: LetterType.Vocal,
                    },
                },
                (rawVocal) => dispatch(addVocal(rawVocal, parent, index)),
            )
            .with(
                {
                    letter: {
                        letterType: P.union(
                            LetterType.Consonant,
                            LetterType.Digraph,
                        ),
                    },
                },
                (rawConsonant) =>
                    dispatch(addConsonant(rawConsonant, parent, index)),
            )
            .exhaustive();
    };

const addConsonant =
    (
        rawLetter: RawConsonantElement,
        parent: WordId,
        index?: number,
    ): AppThunkAction =>
    (dispatch, _getState) => {
        const id = consonantId();

        dispatch(
            textActions.addConsonant({
                id,
                parent,
                text: rawLetter.text,
                letter: rawLetter.letter,
                index,
            }),
        );

        range(dotAmount(rawLetter.letter.decoration)).forEach(() =>
            dispatch(textActions.addDot({ id: dotId(), parent: id })),
        );

        range(lineSlotAmount(rawLetter.letter.decoration)).forEach(() =>
            dispatch(textActions.addLineSlot({ id: lineSlotId(), parent: id })),
        );
    };

const addVocal =
    (
        rawLetter: RawVocalElement,
        parent: WordId,
        index?: number,
    ): AppThunkAction =>
    (dispatch, _getState) => {
        const id = vocalId();

        dispatch(
            textActions.addVocal({
                id,
                parent,
                text: rawLetter.text,
                letter: rawLetter.letter,
                index,
            }),
        );

        range(lineSlotAmount(rawLetter.letter.decoration)).forEach(() =>
            dispatch(textActions.addLineSlot({ id: lineSlotId(), parent: id })),
        );
    };

const removeSentence =
    (id: SentenceId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        state.main.text.elements[id].words.forEach((wordId) =>
            dispatch(removeWord(wordId)),
        );

        dispatch(textActions.removeSentence(id));
    };

const removeWord =
    (id: WordId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        state.main.text.elements[id].letters.forEach((letterId) =>
            dispatch(removeLetter(letterId)),
        );

        dispatch(textActions.removeWord(id));
    };

const removeLetter =
    (id: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const letter = state.main.text.elements[id];

        if (letter.elementType === TextElementType.Consonant) {
            letter.dots.forEach((dotId) =>
                dispatch(textActions.removeDot(dotId)),
            );
        }

        letter.lineSlots.forEach((lineSlotId) =>
            dispatch(textActions.removeLineSlot(lineSlotId)),
        );

        dispatch(textActions.removeLetter(id));
    };

const splitDigraph =
    (letterId: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letter = state.main.text.elements[letterId];
        const index = state.main.text.elements[letter.parent].letters.findIndex(
            (id) => id === letterId,
        );

        const [firstChar, secondChar] = letter.text;

        dispatch(
            compareLetter(
                letter.parent,
                {
                    text: firstChar,
                    letter: charToSingleLetter(firstChar)!,
                } as RawLetterElement,
                letterId,
            ),
        );

        dispatch(
            addLetter(
                {
                    text: secondChar,
                    letter: charToSingleLetter(secondChar)!,
                } as RawLetterElement,
                letter.parent,
                index + 1,
            ),
        );

        dispatch(svgActions.reset());
    };

const mergeToDigraph =
    (firstLetterId: LetterId, secondLetterId: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const firstLetter = state.main.text.elements[firstLetterId];
        const secondLetter = state.main.text.elements[secondLetterId];

        const text = firstLetter.text + secondLetter.text;

        dispatch(
            compareLetter(
                firstLetter.parent,
                {
                    text,
                    letter: textToDigraph(text)!,
                },
                firstLetterId,
            ),
        );

        if (state.main.selected === secondLetterId) {
            dispatch(svgActions.setSelection(firstLetterId));
        }

        dispatch(removeLetter(secondLetterId));
        dispatch(svgActions.reset());
    };

const textThunks = {
    updateTree,
    splitDigraph,
    mergeToDigraph,
};

export default textThunks;
