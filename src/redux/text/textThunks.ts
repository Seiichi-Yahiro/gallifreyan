import {
    type DotId,
    type LetterId,
    type LineSlotId,
    type SentenceId,
    type WordId,
} from '@/redux/ids';
import { interactionActions } from '@/redux/interactions/interactionSlice';
import addThunks from '@/redux/mixed/addThunks';
import removeThunks from '@/redux/mixed/removeThunks';
import type { AppThunkAction } from '@/redux/store';
import resetThunks from '@/redux/svg/resetThunks';
import { dotAmount, lineSlotAmount } from '@/redux/text/letterUtils';
import {
    charToSingleLetter,
    type RawLetter,
    sanitizeSentence,
    splitLetters,
    splitWords,
    textToDigraph,
} from '@/redux/text/textAnalysis';
import { textActions } from '@/redux/text/textSlice';
import { range, zip } from 'es-toolkit';

const setText =
    (text: string): AppThunkAction =>
    (dispatch, getState) => {
        dispatch(interactionActions.setHover(null));
        dispatch(interactionActions.setSelection(null));

        dispatch(textActions.setText(text));
        const sanitizedText = sanitizeSentence(text);

        let rootElement = getState().text.rootElement;
        dispatch(textThunks.compareSentence(sanitizedText, rootElement));

        rootElement = getState().text.rootElement;
        if (rootElement) {
            dispatch(resetThunks.sentence(rootElement));
        }
    };

const compareSentence =
    (newSentenceText: string, existingId: SentenceId | null): AppThunkAction =>
    (dispatch, getState) => {
        if (!existingId && newSentenceText.length > 0) {
            dispatch(addThunks.sentence(newSentenceText));
            return;
        }

        if (existingId && newSentenceText.length === 0) {
            dispatch(removeThunks.sentence(existingId));
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
                        textThunks.compareWord(
                            existingId,
                            newWordText ?? '',
                            wordId,
                        ),
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
            dispatch(addThunks.word(newWordText, parent));
            return;
        }

        if (existingId && newWordText.length === 0) {
            dispatch(removeThunks.word(existingId));
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
                splitLetters(newWordText, state.settings.splitLetterOptions),
                wordElement.letters,
            ).forEach(([newLetterText, letterId]) =>
                dispatch(
                    textThunks.compareLetter(
                        existingId,
                        newLetterText,
                        letterId,
                    ),
                ),
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
            dispatch(addThunks.letter(newRawLetter, parent));
            return;
        }

        if (existingId && !newRawLetter) {
            dispatch(removeThunks.letter(existingId));
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
                dispatch(textThunks.compareDot(existingId, newIndex, dotId)),
            );

            zip(
                range(lineSlotAmount(newRawLetter.letter.decoration)),
                letterElement.lineSlots,
            ).forEach(([newIndex, lineSlotId]) =>
                dispatch(
                    textThunks.compareLineSlot(
                        existingId,
                        newIndex,
                        lineSlotId,
                    ),
                ),
            );
        }
    };

const compareDot =
    (parent: LetterId, newIndex?: number, existingId?: DotId): AppThunkAction =>
    (dispatch, _getState) => {
        if (!existingId && newIndex !== undefined) {
            dispatch(addThunks.dot(parent));
            return;
        }

        if (existingId && newIndex === undefined) {
            dispatch(removeThunks.dot(existingId));
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
            dispatch(addThunks.lineSlot(parent));
            return;
        }

        if (existingId && newIndex === undefined) {
            dispatch(removeThunks.lineSlot(existingId));
        }
    };

const splitDigraph =
    (letterId: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letter = state.text.elements[letterId];
        const index = state.text.elements[letter.parent].letters.findIndex(
            (id) => id === letterId,
        );

        const [firstChar, secondChar] = letter.text;

        dispatch(
            textThunks.compareLetter(
                letter.parent,
                {
                    text: firstChar,
                    letter: charToSingleLetter(firstChar)!,
                },
                letterId,
            ),
        );

        dispatch(
            addThunks.letter(
                { text: secondChar, letter: charToSingleLetter(secondChar)! },
                letter.parent,
                index + 1,
            ),
        );

        dispatch(resetThunks.word(letter.parent));
    };

const mergeToDigraph =
    (firstLetterId: LetterId, secondLetterId: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const firstLetter = state.text.elements[firstLetterId];
        const secondLetter = state.text.elements[secondLetterId];

        const text = firstLetter.text + secondLetter.text;

        dispatch(
            textThunks.compareLetter(
                firstLetter.parent,
                {
                    text,
                    letter: textToDigraph(text)!,
                },
                firstLetterId,
            ),
        );

        if (state.interaction.selected === secondLetterId) {
            dispatch(interactionActions.setSelection(firstLetterId));
        }

        dispatch(removeThunks.letter(secondLetterId));
        dispatch(resetThunks.word(firstLetter.parent));
    };

const textThunks = {
    setText,
    compareSentence,
    compareWord,
    compareLetter,
    compareDot,
    compareLineSlot,
    splitDigraph,
    mergeToDigraph,
};

export default textThunks;
