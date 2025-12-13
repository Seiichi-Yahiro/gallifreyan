import mAngle from '@/math/angle';
import { type PolarCoordinate } from '@/math/polar';
import { type LetterId, letterId, type WordId } from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import { textActions } from '@/redux/slices/textSlice';
import { uiActions } from '@/redux/slices/uiSlice';
import type { AppThunkAction } from '@/redux/store';
import dotThunks from '@/redux/thunks/dotThunks';
import lineSlotThunks from '@/redux/thunks/lineSlotThunks';
import textThunks from '@/redux/thunks/textThunks';
import wordThunks from '@/redux/thunks/wordThunks';
import { LetterPlacement, LetterType } from '@/redux/types/letterTypes';
import { dotAmount, lineSlotAmount } from '@/redux/utils/letterUtils';
import {
    charToSingleLetter,
    type RawLetter,
    textToDigraph,
} from '@/redux/utils/textAnalysis';
import { range } from 'es-toolkit';
import { match } from 'ts-pattern';

const add =
    (rawLetter: RawLetter, parent: WordId, index?: number): AppThunkAction =>
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

        dispatch(svgActions.addCircle(id));

        range(dotAmount(rawLetter.letter.decoration)).forEach(() =>
            dispatch(dotThunks.add(id)),
        );

        range(lineSlotAmount(rawLetter.letter.decoration)).forEach(() =>
            dispatch(lineSlotThunks.add(id)),
        );
    };

const remove =
    (id: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const letter = state.text.elements[id];

        letter.dots.forEach((dotId) => dispatch(dotThunks.remove(dotId)));

        letter.lineSlots.forEach((lineSlotId) =>
            dispatch(lineSlotThunks.remove(lineSlotId)),
        );

        dispatch(svgActions.removeCircle(id));
        dispatch(textActions.removeLetter(id));
    };

const reset =
    (id: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letter = state.text.elements[id];
        const { placement, letterType } = letter.letter;

        const word = state.text.elements[letter.parent];
        const wordRadius = state.svg.circles[letter.parent].radius;

        const letterCount = word.letters.length;
        const index = word.letters.indexOf(id);

        let radius: number;
        let position: PolarCoordinate;

        if (letterType === LetterType.Vocal) {
            radius = (wordRadius * 0.75 * 0.4) / (1 + letterCount / 2);

            const distance = match(placement)
                .with(LetterPlacement.OnLine, () => wordRadius)
                .with(LetterPlacement.Outside, () => wordRadius + radius * 1.5)
                .with(LetterPlacement.Inside, () =>
                    letterCount > 1 ? wordRadius - radius * 1.5 : 0,
                )
                .exhaustive();

            const angle = index * (360 / letterCount);

            position = {
                distance,
                angle: mAngle.degree(angle),
            };
        } else {
            radius = (wordRadius * 0.75) / (1 + letterCount / 2);

            const distance = match(placement)
                .with(LetterPlacement.DeepCut, () => wordRadius - radius * 0.75)
                .with(LetterPlacement.Inside, () =>
                    letterCount > 1 ? wordRadius - radius * 1.5 : 0,
                )
                .with(
                    LetterPlacement.ShallowCut,
                    LetterPlacement.OnLine,
                    () => wordRadius,
                )
                .exhaustive();

            const angle = index * (360 / letterCount);

            position = {
                distance,
                angle: mAngle.degree(angle),
            };
        }

        dispatch(svgActions.setCircle({ id, radius, position }));

        letter.dots.map(dotThunks.reset).forEach(dispatch);
        letter.lineSlots.map(lineSlotThunks.reset).forEach(dispatch);
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
            add(
                { text: secondChar, letter: charToSingleLetter(secondChar)! },
                letter.parent,
                index + 1,
            ),
        );

        dispatch(wordThunks.reset(letter.parent));
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

        if (state.ui.selected === secondLetterId) {
            dispatch(uiActions.setSelection(firstLetterId));
        }

        dispatch(remove(secondLetterId));
        dispatch(wordThunks.reset(firstLetter.parent));
    };

const letterThunks = {
    add,
    remove,
    reset,
    splitDigraph,
    mergeToDigraph,
};

export default letterThunks;
