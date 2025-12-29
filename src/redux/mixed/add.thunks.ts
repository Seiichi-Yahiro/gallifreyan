import mAngle from '@/math/angle';
import ids, { type LetterId, type SentenceId, type WordId } from '@/redux/ids';
import type { AppThunkAction } from '@/redux/store';
import { svgActions } from '@/redux/svg/svg.slice';
import { dotAmount, lineSlotAmount } from '@/redux/text/letter.utils';
import {
    type RawLetter,
    splitLetters,
    splitWords,
} from '@/redux/text/text.analysis';
import { textActions } from '@/redux/text/text.slice';
import { range } from 'es-toolkit';

const sentence =
    (newSentenceText: string): AppThunkAction =>
    (dispatch, _getState) => {
        const id = ids.sentence.create();

        dispatch(
            textActions.addSentence({
                id,
                text: newSentenceText,
            }),
        );

        dispatch(svgActions.addCircle(id));

        splitWords(newSentenceText).forEach((newWordText) =>
            dispatch(addThunks.word(newWordText, id)),
        );
    };

const word =
    (newWordText: string, parent: SentenceId): AppThunkAction =>
    (dispatch, getState) => {
        const id = ids.word.create();

        dispatch(
            textActions.addWord({
                id,
                parent,
                text: newWordText,
            }),
        );

        dispatch(svgActions.addCircle(id));

        const state = getState();

        splitLetters(
            newWordText,
            state.text.settings.splitLetterOptions,
        ).forEach((pair) => dispatch(addThunks.letter(pair, id)));
    };

const letter =
    (rawLetter: RawLetter, parent: WordId, index?: number): AppThunkAction =>
    (dispatch, _getState) => {
        const id = ids.letter.create();

        dispatch(
            textActions.addLetter({
                id,
                parent,
                text: rawLetter.text,
                letter: rawLetter.letter,
                index,
            }),
        );

        dispatch(svgActions.addCircle(id));

        range(dotAmount(rawLetter.letter.decoration)).forEach(() =>
            dispatch(addThunks.dot(id)),
        );

        range(lineSlotAmount(rawLetter.letter.decoration)).forEach(() =>
            dispatch(addThunks.lineSlot(id)),
        );
    };

const dot =
    (parent: LetterId): AppThunkAction =>
    (dispatch, _getState) => {
        const id = ids.dot.create();

        dispatch(textActions.addDot({ id, parent }));
        dispatch(svgActions.addCircle(id));
    };

const lineSlot =
    (parent: LetterId): AppThunkAction =>
    (dispatch, _getState) => {
        const id = ids.lineSlot.create();

        dispatch(textActions.addLineSlot({ id, parent }));

        dispatch(
            svgActions.addLineSlot({
                id,
                lineSlot: {
                    position: {
                        distance: 0,
                        angle: mAngle.radian(0),
                    },
                },
            }),
        );
    };

const addThunks = { sentence, word, letter, dot, lineSlot };

export default addThunks;
