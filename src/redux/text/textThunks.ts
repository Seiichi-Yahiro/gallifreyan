import actions from '@/redux/actions';
import type { AppThunkAction } from '@/redux/store';
import svgActions from '@/redux/svg/svgActions';
import {
    attachedLetterId,
    AttachedLetterId,
    type DotId,
    dotId,
    isAttachedLetterId,
    isLetterId,
    isStackedLetterId,
    isWordId,
    type LetterId,
    letterId,
    type LineSlotId,
    lineSlotId,
    sentenceId,
    type SentenceId,
    stackedLetterId,
    StackedLetterId,
    type WordId,
    wordId,
} from '@/redux/text/ids';
import textActions from '@/redux/text/textActions';
import {
    charToSingleLetter,
    dotAmount,
    lineSlotAmount,
    textToDigraph,
} from '@/redux/text/textLetterUtils';
import { splitLetters, splitWords } from '@/redux/text/textSplitter';
import {
    type AttachedLetterElement,
    type RawAttachedLetter,
    type RawLetter,
    RawLetterElement,
    type RawStackedLetter,
    type StackedLetterElement,
    TextElementType,
} from '@/redux/text/textTypes';
import { range, zip } from 'lodash';
import { match } from 'ts-pattern';

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
            ).forEach(([newLetterText, letterId]) =>
                dispatch(compareLetter(existingId, newLetterText, letterId)),
            );
        }
    };

const compareLetter =
    (
        parent: WordId | StackedLetterId | AttachedLetterId,
        newRawLetter?: RawLetterElement,
        existingId?: LetterId | StackedLetterId | AttachedLetterId,
    ): AppThunkAction =>
    (dispatch, _getState) => {
        match(existingId)
            .with(undefined, () =>
                match(newRawLetter)
                    .with(undefined, () => {})
                    .with(
                        { elementType: TextElementType.Letter },
                        (newRawLetter) => {
                            dispatch(addLetter(newRawLetter, parent));
                        },
                    )
                    .with(
                        { elementType: TextElementType.StackedLetter },
                        (newStackedLetter) => {
                            if (!isStackedLetterId(parent)) {
                                dispatch(
                                    addStackedLetter(newStackedLetter, parent),
                                );
                            }
                        },
                    )
                    .with(
                        { elementType: TextElementType.AttachedLetter },
                        (newAttachedLetter) => {
                            if (isWordId(parent)) {
                                dispatch(
                                    addAttachedLetter(
                                        newAttachedLetter,
                                        parent,
                                    ),
                                );
                            }
                        },
                    )
                    .exhaustive(),
            )
            .when(isLetterId, (existingLetterId) =>
                match(newRawLetter)
                    .with(undefined, () => {
                        dispatch(removeLetter(existingLetterId));
                    })
                    .with(
                        { elementType: TextElementType.Letter },
                        (newRawLetter) => {
                            dispatch(
                                updateLetter(existingLetterId, newRawLetter),
                            );
                        },
                    )
                    .with(
                        { elementType: TextElementType.StackedLetter },
                        (newStackedLetter) => {
                            dispatch(removeLetter(existingLetterId));

                            if (!isStackedLetterId(parent)) {
                                dispatch(
                                    addStackedLetter(newStackedLetter, parent),
                                );
                            }
                        },
                    )
                    .with(
                        { elementType: TextElementType.AttachedLetter },
                        (newAttachedLetter) => {
                            dispatch(removeLetter(existingLetterId));

                            if (isWordId(parent)) {
                                dispatch(
                                    addAttachedLetter(
                                        newAttachedLetter,
                                        parent,
                                    ),
                                );
                            }
                        },
                    )
                    .exhaustive(),
            )
            .when(isStackedLetterId, (existingStackedLetterId) =>
                match(newRawLetter)
                    .with(undefined, () => {
                        dispatch(removeStackedLetter(existingStackedLetterId));
                    })
                    .with(
                        { elementType: TextElementType.StackedLetter },
                        (newStackedLetter) => {
                            dispatch(
                                updateStackedLetter(
                                    existingStackedLetterId,
                                    newStackedLetter,
                                ),
                            );
                        },
                    )
                    .with(
                        { elementType: TextElementType.Letter },
                        (newRawLetter) => {
                            dispatch(
                                removeStackedLetter(existingStackedLetterId),
                            );
                            dispatch(addLetter(newRawLetter, parent));
                        },
                    )
                    .with(
                        { elementType: TextElementType.AttachedLetter },
                        (newAttachedLetter) => {
                            dispatch(
                                removeStackedLetter(existingStackedLetterId),
                            );

                            if (isWordId(parent)) {
                                dispatch(
                                    addAttachedLetter(
                                        newAttachedLetter,
                                        parent,
                                    ),
                                );
                            }
                        },
                    )
                    .exhaustive(),
            )
            .when(isAttachedLetterId, (existingAttachedLetterId) =>
                match(newRawLetter)
                    .with(undefined, () => {
                        dispatch(
                            removeAttachedLetter(existingAttachedLetterId),
                        );
                    })
                    .with(
                        { elementType: TextElementType.AttachedLetter },
                        (newAttachedLetter) => {
                            dispatch(
                                updateAttachedLetter(
                                    existingAttachedLetterId,
                                    newAttachedLetter,
                                ),
                            );
                        },
                    )
                    .with(
                        { elementType: TextElementType.Letter },
                        (newRawLetter) => {
                            dispatch(
                                removeAttachedLetter(existingAttachedLetterId),
                            );
                            dispatch(addLetter(newRawLetter, parent));
                        },
                    )
                    .with(
                        { elementType: TextElementType.StackedLetter },
                        (newStackedLetter) => {
                            dispatch(
                                removeAttachedLetter(existingAttachedLetterId),
                            );

                            if (!isStackedLetterId(parent)) {
                                dispatch(
                                    addStackedLetter(newStackedLetter, parent),
                                );
                            }
                        },
                    )
                    .exhaustive(),
            )
            .exhaustive();
    };

const compareDot =
    (parent: LetterId, newIndex?: number, existingId?: DotId): AppThunkAction =>
    (dispatch, _getState) => {
        if (!existingId && newIndex !== undefined) {
            dispatch(textActions.addDot({ id: dotId(), parent }));
            return;
        }

        if (existingId && newIndex === undefined) {
            dispatch(textActions.removeDot(existingId));
        }
    };

const compareLineSlot =
    (
        parent: LetterId,
        newIndex?: number,
        existingId?: LineSlotId,
    ): AppThunkAction =>
    (dispatch, _getState) => {
        if (!existingId && newIndex !== undefined) {
            dispatch(textActions.addLineSlot({ id: lineSlotId(), parent }));
            return;
        }

        if (existingId && newIndex === undefined) {
            dispatch(textActions.removeLineSlot(existingId));
        }
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
            (rawLetterElement) =>
                match(rawLetterElement)
                    .with(
                        { elementType: TextElementType.Letter },
                        (rawLetter) => {
                            dispatch(addLetter(rawLetter, id));
                        },
                    )
                    .with(
                        { elementType: TextElementType.StackedLetter },
                        (newStackedLetter) => {
                            dispatch(addStackedLetter(newStackedLetter, id));
                        },
                    )
                    .with(
                        { elementType: TextElementType.AttachedLetter },
                        (newAttackedLetter) => {
                            dispatch(addAttachedLetter(newAttackedLetter, id));
                        },
                    )
                    .exhaustive(),
        );
    };

const addLetter =
    (
        rawLetter: RawLetter,
        parent: WordId | StackedLetterId | AttachedLetterId,
        index?: number,
    ): AppThunkAction =>
    (dispatch, _getState) => {
        const id = letterId();

        dispatch(
            textActions.addLetter({
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

const addStackedLetter =
    (
        rawStackedLetter: RawStackedLetter,
        parent: StackedLetterElement['parent'],
    ): AppThunkAction =>
    (dispatch, _getState) => {
        const id = stackedLetterId();

        dispatch(textActions.addStackedLetter({ id, parent }));

        rawStackedLetter.letters.forEach((rawLetter) => {
            dispatch(addLetter(rawLetter, id));
        });
    };

const addAttachedLetter =
    (
        rawAttachedLetter: RawAttachedLetter,
        parent: AttachedLetterElement['parent'],
    ): AppThunkAction =>
    (dispatch, _getState) => {
        const id = attachedLetterId();

        dispatch(textActions.addAttachedLetter({ id, parent }));

        rawAttachedLetter.letters.forEach((raw) =>
            match(raw)
                .with({ elementType: TextElementType.Letter }, (rawLetter) => {
                    dispatch(addLetter(rawLetter, id));
                })
                .with(
                    { elementType: TextElementType.StackedLetter },
                    (rawStackedLetter) => {
                        dispatch(addStackedLetter(rawStackedLetter, id));
                    },
                )
                .exhaustive(),
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
        state.main.text.elements[id].letters.forEach((childId) =>
            match(childId)
                .when(isLetterId, (letterId) => {
                    dispatch(removeLetter(letterId));
                })
                .when(isStackedLetterId, (stackedLetterId) => {
                    dispatch(removeStackedLetter(stackedLetterId));
                })
                .when(isAttachedLetterId, (attachedLetterId) => {
                    dispatch(removeAttachedLetter(attachedLetterId));
                })
                .exhaustive(),
        );

        dispatch(textActions.removeWord(id));
    };

const removeLetter =
    (id: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const letter = state.main.text.elements[id];

        letter.dots.forEach((dotId) => dispatch(textActions.removeDot(dotId)));

        letter.lineSlots.forEach((lineSlotId) =>
            dispatch(textActions.removeLineSlot(lineSlotId)),
        );

        dispatch(textActions.removeLetter(id));
    };

const removeStackedLetter =
    (id: StackedLetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const stackedLetter = state.main.text.elements[id];

        stackedLetter.letters.forEach((letterId) => {
            dispatch(removeLetter(letterId));
        });

        dispatch(textActions.removeStackedLetter(id));
    };

const removeAttachedLetter =
    (id: AttachedLetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const attachedLetter = state.main.text.elements[id];

        attachedLetter.letters.forEach((childId) =>
            match(childId)
                .when(isLetterId, (letterId) => {
                    dispatch(removeLetter(letterId));
                })
                .when(isStackedLetterId, (stackedLetterId) => {
                    dispatch(removeStackedLetter(stackedLetterId));
                })
                .exhaustive(),
        );

        dispatch(textActions.removeAttachedLetter(id));
    };

const updateLetter =
    (existingLetterId: LetterId, newRawLetter: RawLetter): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letterElement = state.main.text.elements[existingLetterId];

        if (letterElement.text !== newRawLetter.text) {
            dispatch(
                textActions.updateLetterText({
                    id: existingLetterId,
                    text: newRawLetter.text,
                    letter: newRawLetter.letter,
                }),
            );

            zip(
                range(dotAmount(newRawLetter.letter.decoration)),
                letterElement.dots,
            ).forEach(([newIndex, dotId]) =>
                dispatch(compareDot(existingLetterId, newIndex, dotId)),
            );

            zip(
                range(lineSlotAmount(newRawLetter.letter.decoration)),
                letterElement.lineSlots,
            ).forEach(([newIndex, lineSlotId]) =>
                dispatch(
                    compareLineSlot(existingLetterId, newIndex, lineSlotId),
                ),
            );
        }
    };

const updateStackedLetter =
    (
        existingStackedLetterId: StackedLetterId,
        newStackedLetter: RawStackedLetter,
    ): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const stackedLetterElement =
            state.main.text.elements[existingStackedLetterId];

        zip(stackedLetterElement.letters, newStackedLetter.letters).forEach(
            ([existingId, newRawLetter]) => {
                dispatch(
                    compareLetter(
                        existingStackedLetterId,
                        newRawLetter,
                        existingId,
                    ),
                );
            },
        );
    };

const updateAttachedLetter =
    (
        existingAttachedLetterId: AttachedLetterId,
        newAttachedLetter: RawAttachedLetter,
    ): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const attachedLetterElement =
            state.main.text.elements[existingAttachedLetterId];

        zip(attachedLetterElement.letters, newAttachedLetter.letters).forEach(
            ([existingId, newRawLetter]) => {
                dispatch(
                    compareLetter(
                        existingAttachedLetterId,
                        newRawLetter,
                        existingId,
                    ),
                );
            },
        );
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
                    elementType: TextElementType.Letter,
                    text: firstChar,
                    letter: charToSingleLetter(firstChar)!,
                },
                letterId,
            ),
        );

        dispatch(
            addLetter(
                {
                    elementType: TextElementType.Letter,
                    text: secondChar,
                    letter: charToSingleLetter(secondChar)!,
                },
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
                    elementType: TextElementType.Letter,
                    text,
                    letter: textToDigraph(text)!,
                },
                firstLetterId,
            ),
        );

        if (state.main.selected === secondLetterId) {
            dispatch(actions.setSelection(firstLetterId));
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
