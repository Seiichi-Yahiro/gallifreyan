import { type PolarCoordinate } from '@/math/polar';
import ids, {
    type DotId,
    type LetterId,
    type LineSlotId,
    type WordId,
} from '@/redux/ids';
import type { AppThunkAction } from '@/redux/store';
import {
    antiArcDistanceConstraints,
    applyAngleConstraints,
    applyDistanceConstraints,
    applyRadiusConstraints,
    arcAngleConstraints,
    betweenNeighborsAngleConstraints,
    deepCutDistanceConstraints,
    insideDistanceConstraints,
    noAngleConstraints,
    onlineDistanceConstraints,
    outsideDistanceConstraints,
    shallowCutDistanceConstraints,
    strokeWidthRadiusConstraints,
} from '@/redux/svg/constraints.utils';
import { calculateIntersectionsBetweenLetterAndWord } from '@/redux/svg/intersections';
import { svgActions } from '@/redux/svg/svg.slice';
import type { CircleId } from '@/redux/svg/svg.types';
import { LetterDecoration, LetterPlacement } from '@/redux/text/letter.types';
import { isCuttingLetterPlacement } from '@/redux/text/letter.utils';
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
        const strokeWidth = state.svg.settings.strokeWidth;
        const letterIds = state.text.elements[id].letters;
        const wordCircle = state.svg.circles[id];
        const deltaRadius = radius - wordCircle.radius;

        const radiusConstraints = strokeWidthRadiusConstraints(strokeWidth);

        dispatch(
            svgActions.setCircle({
                id,
                radius: applyRadiusConstraints(radius, radiusConstraints),
            }),
        );

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
        const strokeWidth = state.svg.settings.strokeWidth;

        const word = state.text.elements[id];
        const sentence = state.text.elements[word.parent];

        const wordCircle = state.svg.circles[id];
        const sentenceCircle = state.svg.circles[sentence.id];

        const wordIds = sentence.words;
        const index = wordIds.indexOf(id);

        const angleConstraints = betweenNeighborsAngleConstraints(
            index,
            wordIds,
            state.svg.circles,
        );

        const angle = applyAngleConstraints(
            position.angle ?? wordCircle.position.angle,
            angleConstraints,
        );

        const wordAntiArcs = word.letters
            .filter((letterId) =>
                isCuttingLetterPlacement(
                    state.text.elements[letterId].letter.placement,
                ),
            )
            .map((letterId) => state.svg.circles[letterId])
            .map((letterCircle) =>
                calculateIntersectionsBetweenLetterAndWord(
                    wordCircle.radius,
                    letterCircle,
                ),
            )
            .filter((intersections) => intersections !== undefined)
            .map((intersections) => intersections.wordAntiArc);

        const antiArcInAngle = wordAntiArcs.find((antiArc) => {
            if (antiArc.start.value <= antiArc.end.value) {
                return (
                    angle.value > antiArc.start.value &&
                    angle.value < antiArc.end.value
                );
            } else {
                return (
                    angle.value > antiArc.start.value ||
                    angle.value < antiArc.end.value
                );
            }
        });

        const distanceConstraints = antiArcInAngle
            ? antiArcDistanceConstraints(
                  wordCircle.radius,
                  sentenceCircle.radius,
                  wordCircle.position.angle,
                  antiArcInAngle,
                  strokeWidth,
              )
            : insideDistanceConstraints(
                  wordCircle.radius,
                  sentenceCircle.radius,
                  strokeWidth,
              );

        const distance = applyDistanceConstraints(
            position.distance ?? wordCircle.position.distance,
            distanceConstraints,
        );

        dispatch(
            svgActions.setCircle({
                id,
                position: {
                    distance,
                    angle,
                },
            }),
        );
    };

const letterRadius =
    (id: LetterId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const strokeWidth = state.svg.settings.strokeWidth;
        const letter = state.text.elements[id];
        const letterCircle = state.svg.circles[id];
        const deltaRadius = radius - letterCircle.radius;

        const radiusConstraints = strokeWidthRadiusConstraints(strokeWidth);

        dispatch(
            svgActions.setCircle({
                id,
                radius: applyRadiusConstraints(radius, radiusConstraints),
            }),
        );

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
        const strokeWidth = state.svg.settings.strokeWidth;

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
                    strokeWidth,
                ),
            )
            .with(LetterPlacement.ShallowCut, () =>
                shallowCutDistanceConstraints(
                    letterCircle.radius,
                    wordCircle.radius,
                    strokeWidth,
                ),
            )
            .with(LetterPlacement.Inside, () =>
                insideDistanceConstraints(
                    letterCircle.radius,
                    wordCircle.radius,
                    strokeWidth,
                ),
            )
            .with(LetterPlacement.Outside, () =>
                outsideDistanceConstraints(
                    letterCircle.radius,
                    wordCircle.radius,
                    strokeWidth,
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

        for (const lineSlotId of letter.lineSlots) {
            const lineSlotPosition = state.svg.lineSlots[lineSlotId].position;
            dispatch(svgThunks.lineSlotPosition(lineSlotId, lineSlotPosition));
        }
    };

const dotRadius =
    (id: DotId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const strokeWidth = state.svg.settings.strokeWidth;
        const dotCircle = state.svg.circles[id];
        const deltaRadius = radius - dotCircle.radius;

        const radiusConstraints = strokeWidthRadiusConstraints(strokeWidth);

        dispatch(
            svgActions.setCircle({
                id,
                radius: applyRadiusConstraints(radius, radiusConstraints),
            }),
        );

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
        const strokeWidth = state.svg.settings.strokeWidth;

        const dot = state.text.elements[id];
        const letter = state.text.elements[dot.parent];

        const dotCircle = state.svg.circles[id];
        const letterCircle = state.svg.circles[letter.id];

        const distanceConstraints = insideDistanceConstraints(
            dotCircle.radius,
            letterCircle.radius,
            strokeWidth,
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
    (dispatch, getState) => {
        const state = getState();
        const lineSlot = state.svg.lineSlots[id];

        const letterId = state.text.elements[id].parent;
        const letter = state.text.elements[letterId];
        const letterCircle = state.svg.circles[letterId];

        const distanceConstraints = onlineDistanceConstraints(
            letterCircle.radius,
        );

        let angleConstraints = noAngleConstraints();

        if (
            isCuttingLetterPlacement(letter.letter.placement) ||
            letter.letter.decoration === LetterDecoration.LineInside ||
            letter.letter.decoration === LetterDecoration.LineOutside
        ) {
            const wordId = state.text.elements[letterId].parent;
            const wordCircle = state.svg.circles[wordId];

            const intersections = calculateIntersectionsBetweenLetterAndWord(
                wordCircle.radius,
                letterCircle,
            );

            if (intersections) {
                angleConstraints =
                    letter.letter.decoration === LetterDecoration.LineOutside
                        ? arcAngleConstraints({
                              start: intersections.letterArc.end,
                              end: intersections.letterArc.start,
                          })
                        : arcAngleConstraints(intersections.letterArc);
            }
        }

        dispatch(
            svgActions.setLineSlotPosition({
                id,
                position: {
                    distance: applyDistanceConstraints(
                        position.distance ?? lineSlot.position.distance,
                        distanceConstraints,
                    ),
                    angle: applyAngleConstraints(
                        position.angle ?? lineSlot.position.angle,
                        angleConstraints,
                    ),
                },
            }),
        );
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
