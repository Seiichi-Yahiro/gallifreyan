import type { PolarCoordinate } from '@/math/polar';
import ids, {
    type DotId,
    type LetterId,
    type LineSlotId,
    type WordId,
} from '@/redux/ids';
import type { AppThunkAction } from '@/redux/store';
import {
    applyAngleConstraints,
    applyDistanceConstraints,
    betweenNeighborsAngleConstraints,
    deepCutDistanceConstraints,
    insideDistanceConstraints,
    onlineDistanceConstraints,
    outsideDistanceConstraints,
    shallowCutDistanceConstraints,
} from '@/redux/svg/constraints';
import { svgActions } from '@/redux/svg/svg.slice';
import type { CircleId } from '@/redux/svg/svg.types';
import { LetterPlacement } from '@/redux/text/letter.types';
import { match } from 'ts-pattern';

const setCirclePosition =
    (id: CircleId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, _getState) => {
        match(id)
            .when(ids.sentence.is, (_sentenceId) => {
                // do nothing for now
            })
            .when(ids.word.is, (wordId) => {
                dispatch(svgThunks.wordPosition(wordId, position));
            })
            .when(ids.letter.is, (letterId) => {
                dispatch(svgThunks.letterPosition(letterId, position));
            })
            .when(ids.dot.is, (dotId) => {
                dispatch(svgThunks.dotPosition(dotId, position));
            })
            .exhaustive();
    };

const setCircleRadius =
    (id: CircleId, radius: number): AppThunkAction =>
    (dispatch, _getState) => {
        match(id)
            .when(ids.sentence.is, (_sentenceId) => {
                // do nothing for now
            })
            .when(ids.word.is, (wordId) => {
                dispatch(svgThunks.wordRadius(wordId, radius));
            })
            .when(ids.letter.is, (letterId) => {
                dispatch(svgThunks.letterRadius(letterId, radius));
            })
            .when(ids.dot.is, (dotId) => {
                dispatch(svgThunks.dotRadius(dotId, radius));
            })
            .exhaustive();
    };

const wordRadius =
    (id: WordId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letterIds = state.text.elements[id].letters;
        const wordCircle = state.svg.circles[id];
        const deltaRadius = radius - wordCircle.radius;

        dispatch(svgActions.setCircle({ id, radius }));

        for (const letterId of letterIds) {
            const letterDistance =
                state.svg.circles[letterId].position.distance;

            dispatch(
                svgThunks.letterPosition(letterId, {
                    distance: letterDistance + deltaRadius,
                }),
            );
        }
    };

const wordPosition =
    (id: WordId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const word = state.text.elements[id];
        const sentence = state.text.elements[word.parent];

        const wordCircle = state.svg.circles[id];
        const sentenceCircle = state.svg.circles[sentence.id];

        const wordIds = sentence.words;
        const index = wordIds.indexOf(id);

        const distanceConstraints = insideDistanceConstraints(
            wordCircle.radius,
            sentenceCircle.radius,
        );

        const angleConstraints = betweenNeighborsAngleConstraints(
            index,
            wordIds,
            state.svg.circles,
        );

        dispatch(
            svgActions.setCircle({
                id,
                position: {
                    distance: applyDistanceConstraints(
                        position.distance ?? wordCircle.position.distance,
                        distanceConstraints,
                    ),
                    angle: applyAngleConstraints(
                        position.angle ?? wordCircle.position.angle,
                        angleConstraints,
                    ),
                },
            }),
        );
    };

const letterRadius =
    (id: LetterId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letter = state.text.elements[id];
        const letterCircle = state.svg.circles[id];
        const deltaRadius = radius - letterCircle.radius;

        const newDistance = match(letter.letter.placement)
            .with(
                LetterPlacement.ShallowCut,
                LetterPlacement.DeepCut,
                LetterPlacement.Inside,
                () => letterCircle.position.distance - deltaRadius,
            )
            .with(
                LetterPlacement.Outside,
                () => letterCircle.position.distance + deltaRadius,
            )
            .with(LetterPlacement.OnLine, () => null)
            .exhaustive();

        dispatch(svgActions.setCircle({ id, radius }));

        if (newDistance !== null) {
            dispatch(
                svgThunks.letterPosition(id, {
                    distance: newDistance,
                }),
            );
        }

        const lineSlots = letter.lineSlots;

        for (const lineSlotId of lineSlots) {
            dispatch(
                svgThunks.lineSlotPosition(lineSlotId, { distance: radius }),
            );
        }

        const dotIds = letter.dots;

        for (const dotId of dotIds) {
            const dotDistance = state.svg.circles[dotId].position.distance;

            dispatch(
                svgThunks.dotPosition(dotId, {
                    distance: dotDistance + deltaRadius,
                }),
            );
        }
    };

const letterPosition =
    (id: LetterId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const letter = state.text.elements[id];
        const word = state.text.elements[letter.parent];

        const letterCircle = state.svg.circles[id];
        const wordCircle = state.svg.circles[word.id];

        const letterIds = word.letters;
        const index = letterIds.indexOf(id);

        const angleConstraints = betweenNeighborsAngleConstraints(
            index,
            letterIds,
            state.svg.circles,
        );

        const distanceConstraints = match(letter.letter.placement)
            .with(LetterPlacement.OnLine, () =>
                onlineDistanceConstraints(wordCircle.radius),
            )
            .with(LetterPlacement.DeepCut, () =>
                deepCutDistanceConstraints(
                    letterCircle.radius,
                    wordCircle.radius,
                ),
            )
            .with(LetterPlacement.ShallowCut, () =>
                shallowCutDistanceConstraints(
                    letterCircle.radius,
                    wordCircle.radius,
                ),
            )
            .with(LetterPlacement.Inside, () =>
                insideDistanceConstraints(
                    letterCircle.radius,
                    wordCircle.radius,
                ),
            )
            .with(LetterPlacement.Outside, () =>
                outsideDistanceConstraints(
                    letterCircle.radius,
                    wordCircle.radius,
                ),
            )
            .exhaustive();

        dispatch(
            svgActions.setCircle({
                id,
                position: {
                    distance: applyDistanceConstraints(
                        position.distance ?? letterCircle.position.distance,
                        distanceConstraints,
                    ),
                    angle: applyAngleConstraints(
                        position.angle ?? letterCircle.position.angle,
                        angleConstraints,
                    ),
                },
            }),
        );
    };

const dotRadius =
    (id: DotId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const dotCircle = state.svg.circles[id];
        const deltaRadius = radius - dotCircle.radius;

        dispatch(svgActions.setCircle({ id, radius }));
        dispatch(
            svgThunks.dotPosition(id, {
                distance: dotCircle.position.distance - deltaRadius,
            }),
        );
    };

const dotPosition =
    (id: DotId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const dot = state.text.elements[id];
        const letter = state.text.elements[dot.parent];

        const dotCircle = state.svg.circles[id];
        const letterCircle = state.svg.circles[letter.id];

        const distanceConstraints = insideDistanceConstraints(
            dotCircle.radius,
            letterCircle.radius,
        );

        dispatch(
            svgActions.setCircle({
                id,
                position: {
                    distance: applyDistanceConstraints(
                        position.distance ?? dotCircle.position.distance,
                        distanceConstraints,
                    ),
                    angle: position.angle ?? dotCircle.position.angle, // no angle constraints for now
                },
            }),
        );
    };

const lineSlotPosition =
    (id: LineSlotId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(svgActions.setLineSlotPosition({ id, position }));
    };

const svgThunks = {
    wordRadius,
    wordPosition,
    letterRadius,
    letterPosition,
    dotRadius,
    dotPosition,
    lineSlotPosition,
    setCirclePosition,
    setCircleRadius,
};

export default svgThunks;
