import { calculateRelativePositionData } from '../../utils/DragAndDrop';
import {
    add,
    angleBetween,
    clamp,
    clampAngle,
    Degree,
    length,
    mul,
    normalize,
    sub,
    toDegree,
    Vector2,
} from '../../utils/LinearAlgebra';
import { calculateTranslation } from '../../utils/TextTransforms';
import { AppThunkAction } from '../AppState';
import { setHovering, setSelection } from '../work/WorkActions';
import { setLineSlotConstraints, setVocalConstraints } from '../work/WorkThunks';
import { AngleConstraints, DistanceConstraints } from '../work/WorkTypes';
import {
    convertSentenceText,
    nestWordVocals,
    resetAllPositionsAndRadii,
    updateCircleData,
    updateLineSlotData,
} from './ImageActions';
import {
    Consonant,
    ConsonantPlacement,
    Dot,
    ImageType,
    PositionData,
    Sentence,
    UUID,
    Vocal,
    VocalPlacement,
    Word,
} from './ImageTypes';

export const setSentence =
    (sentenceText: string): AppThunkAction =>
    (dispatch, getState) => {
        let state = getState();

        if (state.work.selection) {
            dispatch(setSelection());
        }

        if (state.work.hovering) {
            dispatch(setHovering());
        }

        dispatch(convertSentenceText(sentenceText));

        if (sentenceText === '') {
            return;
        }

        state = getState();
        const sentence = state.image.circles[state.image.rootCircleId] as Sentence;

        sentence.words.forEach((wordId) => {
            dispatch(nestWordVocals(wordId));
        });

        dispatch(resetAllPositionsAndRadii());
    };

const constrainDistance = (distance: number, { minDistance, maxDistance }: DistanceConstraints) =>
    clamp(distance, minDistance, maxDistance);

const constrainAngle = (angle: Degree, { minAngle, maxAngle }: AngleConstraints) =>
    clampAngle(angle, minAngle, maxAngle);

const updateCircleDistance =
    (id: UUID, distance: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const constraints = state.work.constraints[id]!;

        const constrainedDistance = constrainDistance(distance, constraints.distance);

        dispatch(updateCircleData({ id, circle: { distance: constrainedDistance } }));
        dispatch(updateCircleLineSlots(id));
    };

const updateCircleAngle =
    (id: UUID, angle: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const constraints = state.work.constraints[id]!;

        const constrainedAngle = constrainAngle(angle, constraints.angle);

        dispatch(updateCircleData({ id, circle: { angle: constrainedAngle } }));
        dispatch(updateCircleLineSlots(id));
    };

const updateCirclePositionData =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const circle = state.image.circles[id]!.circle;
        const constraints = state.work.constraints[id]!;

        const constrainedDistance = constrainDistance(positionData.distance ?? circle.distance, constraints.distance);
        const constrainedAngle = constrainAngle(positionData.angle ?? circle.angle, constraints.angle);

        dispatch(updateCircleData({ id, circle: { distance: constrainedDistance, angle: constrainedAngle } }));
        dispatch(updateCircleLineSlots(id));
    };

const updateCircleLineSlots =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const circleShape = state.image.circles[id]!;

        if (circleShape.type !== ImageType.Dot) {
            circleShape.lineSlots.forEach((lineSlotId) => {
                dispatch(setLineSlotConstraints(lineSlotId));
                dispatch(updateLineSlotPositionData(lineSlotId, {}));
            });
        }
    };

export const updateSentenceRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const updateSentenceDistance = updateCircleDistance;
export const updateSentenceAngle = updateCircleAngle;

export const dragSentence =
    (id: UUID, domRect: DOMRect, mouseMovement: Vector2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const sentence = state.image.circles[id] as Sentence;
        const positionData = calculateRelativePositionData(mouseMovement, viewPortScale, domRect, sentence.circle);

        dispatch(updateCirclePositionData(id, positionData));
    };

export const updateWordRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const updateWordDistance = updateCircleDistance;
export const updateWordAngle = updateCircleAngle;

export const dragWord =
    (id: UUID, domRect: DOMRect, mouseMovement: Vector2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const word = state.image.circles[id] as Word;
        const positionData = calculateRelativePositionData(mouseMovement, viewPortScale, domRect, word.circle);

        dispatch(updateCirclePositionData(id, positionData));
    };

export const updateConsonantRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const updateConsonantDistance =
    (id: UUID, distance: number): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(updateCircleDistance(id, distance));
        dispatch(updateConsonantNestedVocal(id));
    };

export const updateConsonantAngle =
    (id: UUID, angle: Degree): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(updateCircleAngle(id, angle));
        dispatch(updateConsonantNestedVocal(id));
    };

export const dragConsonant =
    (id: UUID, domRect: DOMRect, mouseMovement: Vector2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const consonant = state.image.circles[id] as Consonant;
        const positionData = calculateRelativePositionData(mouseMovement, viewPortScale, domRect, consonant.circle);
        dispatch(updateCirclePositionData(id, positionData));
        dispatch(updateConsonantNestedVocal(id));
    };

const updateConsonantNestedVocal =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const consonant = state.image.circles[id] as Consonant;

        if (consonant.vocal) {
            dispatch(updateNestedVocalConstraints(consonant.vocal));
            dispatch(updateCirclePositionData(consonant.vocal, {}));
        }
    };

export const updateVocalRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const updateVocalDistance =
    (id: UUID, distance: number): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(updateCircleDistance(id, distance));
        dispatch(updateNestedVocalConstraints(id));
    };

export const updateVocalAngle =
    (id: UUID, angle: Degree): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(updateCircleAngle(id, angle));
        dispatch(updateNestedVocalConstraints(id));
    };

const updateNestedVocalConstraints =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const vocal = state.image.circles[id] as Vocal;

        if (state.image.circles[vocal.parentId]!.type === ImageType.Consonant) {
            dispatch(setVocalConstraints(id));
        }
    };

const dragNestedVocal =
    (id: UUID, domRect: DOMRect, mouseMovement: Vector2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const vocal = state.image.circles[id] as Vocal;
        const consonant = state.image.circles[vocal.parentId] as Consonant;

        const positionData = calculateRelativePositionData(
            mouseMovement,
            viewPortScale,
            domRect,
            vocal.circle,
            consonant.circle.angle
        );

        // special drag handling for online vocals
        // needed for smooth dragging along edges
        if (vocal.placement === VocalPlacement.OnLine && consonant.placement !== ConsonantPlacement.Inside) {
            const word = state.image.circles[consonant.parentId] as Word;

            const consonantPos = calculateTranslation(consonant.circle.angle, consonant.circle.distance);
            const vocalPos = add(
                calculateTranslation(positionData.angle + consonant.circle.angle, positionData.distance),
                consonantPos
            );

            const distanceVocalToWordCircle =
                consonant.placement === ConsonantPlacement.DeepCut
                    ? length(vocalPos) - word.circle.r + vocal.circle.r
                    : length(vocalPos) - word.circle.r;

            // is vocal outside word
            if (distanceVocalToWordCircle > 0) {
                const wordToVocalVec = normalize(vocalPos);
                const wordCircleIntersection = mul(wordToVocalVec, word.circle.r);
                let adjustedVocalToWordIntersection = wordCircleIntersection;

                // is consonant inside word
                if (consonant.placement === ConsonantPlacement.DeepCut) {
                    adjustedVocalToWordIntersection = sub(wordCircleIntersection, mul(wordToVocalVec, vocal.circle.r));
                }

                const consonantToVocalVec = sub(adjustedVocalToWordIntersection, consonantPos);

                const distance = clamp(length(consonantToVocalVec), 0, consonant.circle.r - vocal.circle.r);
                const angle = -toDegree(angleBetween({ x: 0, y: 1 }, consonantToVocalVec)) - consonant.circle.angle;

                dispatch(updateCircleData({ id, circle: { distance, angle } }));
                dispatch(updateCircleLineSlots(id));
            } else {
                dispatch(updateCirclePositionData(id, positionData));
            }

            dispatch(updateNestedVocalConstraints(id));
        } else {
            dispatch(updateCirclePositionData(id, positionData));
        }
    };

export const dragVocal =
    (id: UUID, domRect: DOMRect, mouseMovement: Vector2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const vocal = state.image.circles[id] as Vocal;
        const parent = state.image.circles[vocal.parentId]!;

        // nested vocal
        if (parent.type === ImageType.Consonant) {
            dispatch(dragNestedVocal(id, domRect, mouseMovement));
        } else {
            const positionData = calculateRelativePositionData(mouseMovement, viewPortScale, domRect, vocal.circle);

            dispatch(updateCirclePositionData(id, positionData));
        }
    };

export const updateDotRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const updateDotDistance = updateCircleDistance;
export const updateDotAngle = updateCircleAngle;

export const dragDot =
    (id: UUID, domRect: DOMRect, mouseMovement: Vector2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const dot = state.image.circles[id] as Dot;
        const consonantAngle = state.image.circles[dot.parentId]!.circle.angle;
        const positionData = calculateRelativePositionData(
            mouseMovement,
            viewPortScale,
            domRect,
            dot.circle,
            consonantAngle
        );
        dispatch(updateCirclePositionData(id, positionData));
    };

export const updateLineSlotAngle =
    (id: UUID, angle: Degree): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const constraints = state.work.constraints[id]!;

        const constrainedAngle = clampAngle(angle, constraints.angle.minAngle, constraints.angle.maxAngle);

        dispatch(updateLineSlotData({ id, positionData: { angle: constrainedAngle } }));
    };

const updateLineSlotPositionData =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const lineSlot = state.image.lineSlots[id]!;
        const constraints = state.work.constraints[id]!;

        const constrainedDistance = constrainDistance(positionData.distance ?? lineSlot.distance, constraints.distance);
        const constrainedAngle = constrainAngle(positionData.angle ?? lineSlot.angle, constraints.angle);

        dispatch(updateLineSlotData({ id, positionData: { distance: constrainedDistance, angle: constrainedAngle } }));
    };

export const dragLineSlot =
    (id: UUID, domRect: DOMRect, mouseMovement: Vector2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const lineSlot = state.image.lineSlots[id]!;
        const parent = state.image.circles[lineSlot.parentId]!;

        let relativeAngle;

        if (parent.type === ImageType.Consonant) {
            relativeAngle = parent.circle.angle;
        } else if (parent.type === ImageType.Vocal) {
            const parentParent = state.image.circles[parent.parentId]!;

            // if nested vocal
            if (parentParent.type === ImageType.Consonant) {
                relativeAngle = parentParent.circle.angle;
            } else {
                relativeAngle = parent.circle.angle;
            }
        }

        const positionData = calculateRelativePositionData(
            mouseMovement,
            viewPortScale,
            domRect,
            lineSlot,
            relativeAngle
        );
        dispatch(updateLineSlotPositionData(id, positionData));
    };
