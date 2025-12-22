import mAngle from '@/math/angle';
import mCircle, {
    CircleIntersectionType,
    type Circle as MCircle,
} from '@/math/circle';
import mPolar, { type PolarCoordinate } from '@/math/polar';
import mVec2, { type Vec2 } from '@/math/vec';
import ids, { type LetterId, type WordId } from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import { textActions } from '@/redux/slices/textSlice';
import { uiActions } from '@/redux/slices/uiSlice';
import type { AppThunkAction } from '@/redux/store';
import dotThunks from '@/redux/thunks/dotThunks';
import lineSlotThunks from '@/redux/thunks/lineSlotThunks';
import textThunks from '@/redux/thunks/textThunks';
import wordThunks from '@/redux/thunks/wordThunks';
import { LetterPlacement, LetterType } from '@/redux/types/letterTypes';
import type { Arc } from '@/redux/types/svgTypes';
import { calculatePositionAfterDrag } from '@/redux/utils/dragUtils';
import { dotAmount, lineSlotAmount } from '@/redux/utils/letterUtils';
import { intersectionsToArc } from '@/redux/utils/svgUtils';
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

        dispatch(
            svgActions.setWordAntiArc({
                id: letter.parent,
                letterId: id,
                antiArc: undefined,
            }),
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

const calculateIntersectionsWithWord =
    (letterId: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letter = state.text.elements[letterId];
        const wordId = letter.parent;

        if (
            letter.letter.placement !== LetterPlacement.DeepCut &&
            letter.letter.placement !== LetterPlacement.ShallowCut
        ) {
            dispatch(
                svgActions.setLetterArc({
                    id: letterId,
                    arc: null,
                }),
            );

            dispatch(
                svgActions.setWordAntiArc({
                    id: wordId,
                    letterId,
                    antiArc: undefined,
                }),
            );

            return;
        }

        const wordCircle = state.svg.circles[wordId];
        const letterCircle = state.svg.circles[letterId];

        const wordMCircle: MCircle = {
            radius: wordCircle.radius,
            position: mVec2.create(0, 0),
        };

        const letterMCircle: MCircle = {
            radius: letterCircle.radius,
            position: mPolar.toCartesian(letterCircle.position),
        };

        const intersectionsInWord = mCircle.intersections(
            wordMCircle,
            letterMCircle,
        );

        if (intersectionsInWord.type === CircleIntersectionType.Two) {
            // these are the arcs of the word that should not be drawn because they are blocked by the letters
            const antiArcsInWord = intersectionsToArc(
                wordMCircle,
                letterMCircle,
                intersectionsInWord.values,
            );

            const intersectionsAnglesInLetter = intersectionsInWord.values
                .map((pos) => mVec2.sub(pos, letterMCircle.position))
                .map((pos) =>
                    mVec2.rotate(pos, letterCircle.position.angle, true),
                )
                .map(mPolar.angleFromCartesian)
                .sort((a, b) => a.value - b.value); // sorting is fine because intersections will never include the 0 degrees point

            const letterArc: Arc = {
                start: intersectionsAnglesInLetter[0],
                end: intersectionsAnglesInLetter[1],
            };

            dispatch(
                svgActions.setLetterArc({
                    id: letterId,
                    arc: letterArc,
                }),
            );

            dispatch(
                svgActions.setWordAntiArc({
                    id: wordId,
                    letterId,
                    antiArc: antiArcsInWord,
                }),
            );
        } else {
            dispatch(
                svgActions.setLetterArc({
                    id: letterId,
                    arc: null,
                }),
            );

            dispatch(
                svgActions.setWordAntiArc({
                    id: wordId,
                    letterId,
                    antiArc: null,
                }),
            );
        }
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

        dispatch(letterThunks.calculateIntersectionsWithWord(id));

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

        dispatch(letterThunks.calculateIntersectionsWithWord(id));
    };

const letterThunks = {
    add,
    remove,
    reset,
    splitDigraph,
    mergeToDigraph,
    calculateIntersectionsWithWord,
    drag,
    setCircleRadius,
    setCirclePosition,
};

export default letterThunks;
