import mAngle from '@/math/angle';
import type { PolarCoordinate } from '@/math/polar';
import type { AppThunkAction } from '@/redux/store';
import svgActions from '@/redux/svg/svgActions';
import type { CircleId } from '@/redux/svg/svgTypes';
import {
    type DotId,
    isLetterId,
    isWordId,
    type LetterId,
    type LineSlotId,
    type SentenceId,
    type WordId,
} from '@/redux/text/ids';
import {
    LetterDecoration,
    LetterPlacement,
    LetterType,
} from '@/redux/text/letters';
import { match } from 'ts-pattern';

const reset = (): AppThunkAction => (dispatch, getState) => {
    const state = getState();

    if (state.main.text.rootElement === null) {
        return;
    }

    dispatch(resetSentence(state.main.text.rootElement));
};

const resetSentence =
    (id: SentenceId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const svgSize = state.main.svg.size;
        const words = state.main.text.elements[id].words;

        const radius = (svgSize * 0.9) / 2;

        const position: PolarCoordinate = {
            distance: 0,
            angle: mAngle.degree(0),
        };

        dispatch(svgActions.setCircle({ id, radius, position }));

        words.map(resetWord).forEach(dispatch);
    };

const resetWord =
    (id: WordId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const word = state.main.text.elements[id];

        const sentence = state.main.text.elements[word.parent];
        const sentenceRadius = state.main.svg.circles[word.parent].radius;

        const wordCount = sentence.words.length;
        const index = sentence.words.indexOf(id);

        const radius = (sentenceRadius * 0.75) / (1 + wordCount / 2.0);

        const position: PolarCoordinate = {
            distance: wordCount > 1 ? sentenceRadius - radius * 1.5 : 0,
            angle: mAngle.degree(index * (360 / wordCount)),
        };

        dispatch(svgActions.setCircle({ id, radius, position }));

        word.letters.map(resetLetter).forEach(dispatch);

        dispatch(svgActions.calculateCircleIntersections(id));
    };

const resetLetter =
    (id: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letter = state.main.text.elements[id];
        const { placement, letterType } = letter.letter;

        const word = state.main.text.elements[letter.parent];
        const wordRadius = state.main.svg.circles[letter.parent].radius;

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

        letter.dots.map(resetDot).forEach(dispatch);
        letter.lineSlots.map(resetLineSlot).forEach(dispatch);
    };

const resetDot =
    (id: DotId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const dot = state.main.text.elements[id];

        const letter = state.main.text.elements[dot.parent];
        const letterRadius = state.main.svg.circles[dot.parent].radius;

        const dotCount = letter.dots.length;
        const index = letter.dots.indexOf(id);

        const radius = letterRadius * 0.1;

        const letterSideAngle = 180;
        const dotDistanceAngle = 45;

        const centerDotsOnLetterSideAngle =
            ((dotCount - 1) * dotDistanceAngle) / 2;

        const distance = letterRadius - radius * 2;

        const angle =
            index * dotDistanceAngle -
            centerDotsOnLetterSideAngle +
            letterSideAngle;

        const position: PolarCoordinate = {
            distance,
            angle: mAngle.degree(angle),
        };

        dispatch(svgActions.setCircle({ id, radius, position }));
    };

const resetLineSlot =
    (id: LineSlotId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const lineSlot = state.main.text.elements[id];

        const letter = state.main.text.elements[lineSlot.parent];
        const letterRadius = state.main.svg.circles[lineSlot.parent].radius;

        const lineCount = letter.lineSlots.length;
        const index = letter.lineSlots.indexOf(id);

        const letterSideAngle =
            letter.letter.decoration === LetterDecoration.LineOutside ? 0 : 180;

        const lineDistanceAngle = 45;

        const centerLinesOnLetterSideAngle =
            ((lineCount - 1) * lineDistanceAngle) / 2;

        const distance = letterRadius;

        const angle =
            index * lineDistanceAngle -
            centerLinesOnLetterSideAngle +
            letterSideAngle;

        const position: PolarCoordinate = {
            distance,
            angle: mAngle.degree(angle),
        };

        dispatch(svgActions.setLineSlotPosition({ id, position }));
    };

const setCircleRadius =
    (id: CircleId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        let state = getState();
        const currentCircle = state.main.svg.circles[id];
        const deltaRadius = radius - currentCircle.radius;

        dispatch(svgActions.setCircle({ id, radius }));

        if (isLetterId(id)) {
            state = getState();
            const letter = state.main.text.elements[id];

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
                        position: {
                            distance: newDistance,
                        },
                    }),
                );
            }

            const wordId = letter.parent;
            dispatch(svgActions.calculateCircleIntersections(wordId));

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
                const dotDistance =
                    state.main.svg.circles[dotId].position.distance;

                dispatch(
                    svgActions.setCircle({
                        id: dotId,
                        position: {
                            distance: dotDistance + deltaRadius,
                        },
                    }),
                );
            }
        } else if (isWordId(id)) {
            state = getState();
            const lettersIds = state.main.text.elements[id].letters;

            for (const letterId of lettersIds) {
                const letterDistance =
                    state.main.svg.circles[letterId].position.distance;

                dispatch(
                    svgActions.setCircle({
                        id: letterId,
                        position: {
                            distance: letterDistance + deltaRadius,
                        },
                    }),
                );
            }

            dispatch(svgActions.calculateCircleIntersections(id));
        }
    };

const setCirclePosition =
    (id: CircleId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, getState) => {
        dispatch(svgActions.setCircle({ id, position }));

        if (isLetterId(id)) {
            const state = getState();
            const wordId = state.main.text.elements[id].parent;

            dispatch(svgActions.calculateCircleIntersections(wordId));
        }
    };

const svgThunks = {
    reset,
    resetSentence,
    resetWord,
    resetLetter,
    resetDot,
    resetLineSlot,
    setCircleRadius,
    setCirclePosition,
};

export default svgThunks;
