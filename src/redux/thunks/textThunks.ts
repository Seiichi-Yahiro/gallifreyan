import {
    type DotId,
    type LetterId,
    type LineSlotId,
    type SentenceId,
    type WordId,
} from '@/redux/ids';
import { textActions } from '@/redux/slices/textSlice';
import { uiActions } from '@/redux/slices/uiSlice';
import type { AppThunkAction } from '@/redux/store';
import dotThunks from '@/redux/thunks/dotThunks';
import letterThunks from '@/redux/thunks/letterThunks';
import lineSlotThunks from '@/redux/thunks/lineSlotThunks';
import sentenceThunks from '@/redux/thunks/sentenceThunks';
import wordThunks from '@/redux/thunks/wordThunks';
import { dotAmount, lineSlotAmount } from '@/redux/utils/letterUtils';
import {
    type RawLetter,
    sanitizeSentence,
    splitLetters,
    splitWords,
} from '@/redux/utils/textAnalysis';
import { range, zip } from 'es-toolkit';

const setText =
    (text: string): AppThunkAction =>
    (dispatch, getState) => {
        dispatch(uiActions.setHover(null));
        dispatch(uiActions.setSelection(null));

        dispatch(textActions.setText(text));
        const sanitizedText = sanitizeSentence(text);

        let rootElement = getState().text.rootElement;
        dispatch(compareSentence(sanitizedText, rootElement));

        rootElement = getState().text.rootElement;
        if (rootElement) {
            dispatch(sentenceThunks.reset(rootElement));
        }
    };

const compareSentence =
    (newSentenceText: string, existingId: SentenceId | null): AppThunkAction =>
    (dispatch, getState) => {
        if (!existingId && newSentenceText.length > 0) {
            dispatch(sentenceThunks.add(newSentenceText));
            return;
        }

        if (existingId && newSentenceText.length === 0) {
            dispatch(sentenceThunks.remove(existingId));
            return;
        }

        if (!existingId) {
            return;
        }

        const state = getState();
        const sentenceElement = state.text.elements[existingId];

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
            dispatch(wordThunks.add(newWordText, parent));
            return;
        }

        if (existingId && newWordText.length === 0) {
            dispatch(wordThunks.remove(existingId));
            return;
        }

        if (!existingId) {
            return;
        }

        const state = getState();
        const wordElement = state.text.elements[existingId];

        if (wordElement.text !== newWordText) {
            dispatch(
                textActions.updateWordText({
                    id: existingId,
                    text: newWordText,
                }),
            );

            zip(
                splitLetters(newWordText, state.text.splitLetterOptions),
                wordElement.letters,
            ).forEach(([newLetterText, letterId]) =>
                dispatch(compareLetter(existingId, newLetterText, letterId)),
            );
        }
    };

const compareLetter =
    (
        parent: WordId,
        newRawLetter?: RawLetter,
        existingId?: LetterId,
    ): AppThunkAction =>
    (dispatch, getState) => {
        if (!existingId && newRawLetter) {
            dispatch(letterThunks.add(newRawLetter, parent));
            return;
        }

        if (existingId && !newRawLetter) {
            dispatch(letterThunks.remove(existingId));
            return;
        }

        if (!existingId || !newRawLetter) {
            return;
        }

        const state = getState();
        const letterElement = state.text.elements[existingId];

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
            dispatch(dotThunks.add(parent));
            return;
        }

        if (existingId && newIndex === undefined) {
            dispatch(dotThunks.remove(existingId));
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
            dispatch(lineSlotThunks.add(parent));
            return;
        }

        if (existingId && newIndex === undefined) {
            dispatch(lineSlotThunks.remove(existingId));
        }
    };

const textThunks = {
    setText,
    compareSentence,
    compareWord,
    compareLetter,
    compareDot,
    compareLineSlot,
};

export default textThunks;
