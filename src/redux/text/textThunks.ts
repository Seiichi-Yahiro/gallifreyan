import type { AppThunkAction } from '@/redux/store';
import svgActions from '@/redux/svg/svgActions';
import {
    type DotId,
    dotId,
    type LetterId,
    letterId,
    type LineSlotId,
    lineSlotId,
    sentenceId,
    type SentenceId,
    type WordId,
    wordId,
} from '@/redux/text/ids';
import textActions from '@/redux/text/textActions';
import type { RawLetterElement } from '@/redux/text/textTypes';
import {
    charToSingleLetter,
    dotAmount,
    lineSlotAmount,
    splitLetters,
    splitWords,
    textToDigraph,
} from '@/redux/text/textUtils';
import { range, zip } from 'lodash';

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
            dispatch(
                textActions.updateLetterText({
                    id: existingId,
                    text: newRawLetter.text,
                    letter: newRawLetter.letter,
                }),
            );

            zip(
                range(dotAmount(newRawLetter.letter.decoration)),
                letterElement.dots,
            ).forEach(([newIndex, dotId]) =>
                dispatch(compareDot(existingId, newIndex, dotId)),
            );

            zip(
                range(lineSlotAmount(newRawLetter.letter.decoration)),
                letterElement.lineSlots,
            ).forEach(([newIndex, lineSlotId]) =>
                dispatch(compareLineSlot(existingId, newIndex, lineSlotId)),
            );
        }
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
            (pair) => dispatch(addLetter(pair, id)),
        );
    };

const addLetter =
    (
        rawLetter: RawLetterElement,
        parent: WordId,
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

        letter.dots.forEach((dotId) => dispatch(textActions.removeDot(dotId)));

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
                },
                letterId,
            ),
        );

        dispatch(
            addLetter(
                { text: secondChar, letter: charToSingleLetter(secondChar)! },
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
