import mAngle from '@/math/angle';
import { type PolarCoordinate } from '@/math/polar';
import { type Vec2 } from '@/math/vec';
import ids, { type LetterId, type WordId } from '@/redux/ids';
import { interactionActions } from '@/redux/slices/interactionSlice';
import { svgActions } from '@/redux/slices/svgSlice';
import { textActions } from '@/redux/slices/textSlice';
import type { AppThunkAction } from '@/redux/store';
import dotThunks from '@/redux/thunks/dotThunks';
import lineSlotThunks from '@/redux/thunks/lineSlotThunks';
import textThunks from '@/redux/thunks/textThunks';
import wordThunks from '@/redux/thunks/wordThunks';
import { LetterPlacement, LetterType } from '@/redux/types/letterTypes';
import { calculatePositionAfterDrag } from '@/redux/utils/dragUtils';
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
                angle: mAngle.toRadian(mAngle.degree(angle)),
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
                angle: mAngle.toRadian(mAngle.degree(angle)),
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

        if (state.interaction.selected === secondLetterId) {
            dispatch(interactionActions.setSelection(firstLetterId));
        }

        dispatch(remove(secondLetterId));
        dispatch(wordThunks.reset(firstLetter.parent));
    };

const drag =
    (id: LetterId, delta: Vec2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const letterCircle = state.svg.circles[id];
        const newPos = calculatePositionAfterDrag(letterCircle.position, delta);

        dispatch(setCirclePosition(id, newPos));
    };

const setCircleRadius =
    (id: LetterId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letter = state.text.elements[id];
        const currentCircle = state.svg.circles[id];
        const deltaRadius = radius - currentCircle.radius;

        const newDistance = match(letter.letter.placement)
            .with(
                LetterPlacement.ShallowCut,
                LetterPlacement.DeepCut,
                LetterPlacement.Inside,
                () => currentCircle.position.distance - deltaRadius,
            )
            .with(
                LetterPlacement.Outside,
                () => currentCircle.position.distance + deltaRadius,
            )
            .with(LetterPlacement.OnLine, () => null)
            .exhaustive();

        if (newDistance !== null) {
            dispatch(
                svgActions.setCircle({
                    id,
                    radius,
                    position: {
                        distance: newDistance,
                    },
                }),
            );
        } else {
            dispatch(svgActions.setCircle({ id, radius }));
        }

        const lineSlots = letter.lineSlots;

        for (const lineSlotId of lineSlots) {
            dispatch(
                svgActions.setLineSlotPosition({
                    id: lineSlotId,
                    position: { distance: radius },
                }),
            );
        }

        const dotIds = letter.dots;

        for (const dotId of dotIds) {
            const dotDistance = state.svg.circles[dotId].position.distance;

            dispatch(
                svgActions.setCircle({
                    id: dotId,
                    position: {
                        distance: dotDistance + deltaRadius,
                    },
                }),
            );
        }
    };

const setCirclePosition =
    (id: LetterId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const placement = state.text.elements[id].letter.placement;

        if (placement === LetterPlacement.OnLine) {
            dispatch(
                svgActions.setCircle({
                    id,
                    position: { angle: position.angle },
                }),
            );
        } else {
            dispatch(svgActions.setCircle({ id, position }));
        }
    };

const letterThunks = {
    add,
    remove,
    reset,
    splitDigraph,
    mergeToDigraph,
    drag,
    setCircleRadius,
    setCirclePosition,
};

export default letterThunks;
