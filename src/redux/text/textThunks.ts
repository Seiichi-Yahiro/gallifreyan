import type { AppThunkAction } from '@/redux/store';
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
import type { TextLetterPair } from '@/redux/text/textTypes';
import {
    dotAmount,
    lineSlotAmount,
    splitLetters,
    splitWords,
} from '@/redux/text/textUtils';
import { range, zip } from 'lodash';

const updateTree =
    (text: string): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        dispatch(compareSentence(text, state.main.text.rootElement));
    };

const compareSentence =
    (newSentenceText: string, id: SentenceId | null): AppThunkAction =>
    (dispatch, getState) => {
        if (!id && newSentenceText.length > 0) {
            dispatch(addSentence(newSentenceText));
            return;
        }

        if (id && newSentenceText.length === 0) {
            dispatch(removeSentence(id));
            return;
        }

        if (!id) {
            return;
        }

        const state = getState();
        const sentenceElement = state.main.text.elements[id];

        if (sentenceElement.text !== newSentenceText) {
            dispatch(
                textActions.updateSentenceText({ id, text: newSentenceText }),
            );

            zip(splitWords(newSentenceText), sentenceElement.words).forEach(
                ([newWordText, wordId]) =>
                    dispatch(compareWord(id, newWordText ?? '', wordId)),
            );
        }
    };

const compareWord =
    (parent: SentenceId, newWordText: string, id?: WordId): AppThunkAction =>
    (dispatch, getState) => {
        if (!id && newWordText.length > 0) {
            dispatch(addWord(newWordText, parent));
            return;
        }

        if (id && newWordText.length === 0) {
            dispatch(removeWord(id));
            return;
        }

        if (!id) {
            return;
        }

        const state = getState();
        const wordElement = state.main.text.elements[id];

        if (wordElement.text !== newWordText) {
            dispatch(textActions.updateWordText({ id, text: newWordText }));

            zip(
                splitLetters(newWordText, state.main.text.splitLetterOptions),
                wordElement.letters,
            ).forEach(([newLetterText, letterId]) =>
                dispatch(compareLetter(id, newLetterText, letterId)),
            );
        }
    };

const compareLetter =
    (parent: WordId, pair?: TextLetterPair, id?: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        if (!id && pair) {
            dispatch(addLetter(pair, parent));
            return;
        }

        if (id && !pair) {
            dispatch(removeLetter(id));
            return;
        }

        if (!id || !pair) {
            return;
        }

        const state = getState();
        const letterElement = state.main.text.elements[id];

        if (letterElement.text !== pair.text) {
            dispatch(
                textActions.updateLetterText({
                    id,
                    text: pair.text,
                    letter: pair.letter,
                }),
            );

            zip(
                range(dotAmount(pair.letter.decoration)),
                letterElement.dots,
            ).forEach(([newIndex, dotId]) =>
                dispatch(compareDot(id, newIndex, dotId)),
            );

            zip(
                range(lineSlotAmount(pair.letter.decoration)),
                letterElement.lineSlots,
            ).forEach(([newIndex, lineSlotId]) =>
                dispatch(compareLineSlot(id, newIndex, lineSlotId)),
            );
        }
    };

const compareDot =
    (parent: LetterId, newIndex?: number, id?: DotId): AppThunkAction =>
    (dispatch, _getState) => {
        if (!id && newIndex !== undefined) {
            dispatch(textActions.addDot({ id: dotId(), parent }));
            return;
        }

        if (id && newIndex === undefined) {
            dispatch(textActions.removeDot(id));
        }
    };

const compareLineSlot =
    (parent: LetterId, newIndex?: number, id?: LineSlotId): AppThunkAction =>
    (dispatch, _getState) => {
        if (!id && newIndex !== undefined) {
            dispatch(textActions.addLineSlot({ id: lineSlotId(), parent }));
            return;
        }

        if (id && newIndex === undefined) {
            dispatch(textActions.removeLineSlot(id));
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
    (pair: TextLetterPair, parent: WordId): AppThunkAction =>
    (dispatch, _getState) => {
        const id = letterId();

        dispatch(
            textActions.addLetter({
                id,
                parent,
                text: pair.text,
                letter: pair.letter,
            }),
        );

        range(dotAmount(pair.letter.decoration)).forEach(() =>
            dispatch(textActions.addDot({ id: dotId(), parent: id })),
        );

        range(lineSlotAmount(pair.letter.decoration)).forEach(() =>
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

const textThunks = {
    updateTree,
};

export default textThunks;
