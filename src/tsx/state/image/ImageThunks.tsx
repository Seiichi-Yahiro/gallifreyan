import { calculatePositionData } from '../../utils/DragAndDrop';
import { clamp, clampAngle, Degree, Position } from '../../utils/LinearAlgebra';
import { AppThunkAction } from '../AppState';
import { setHovering, setSelection } from '../work/WorkActions';
import { setLineSlotConstraints } from '../work/WorkThunks';
import {
    convertSentenceText,
    nestWordVocals,
    resetAllPositionsAndRadii,
    updateCircleData,
    updateLineSlotData,
} from './ImageActions';
import { Consonant, Dot, ImageType, PositionData, Sentence, UUID, Vocal, Word } from './ImageTypes';

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

export const updateCircleDistance =
    (id: UUID, distance: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const constraints = state.work.constraints[id]!;

        const constrainedDistance = clamp(distance, constraints.distance.minDistance, constraints.distance.maxDistance);

        dispatch(updateCircleData({ id, circle: { distance: constrainedDistance } }));
        dispatch(updateCircleLineSlots(id));
    };

export const updateCircleAngle =
    (id: UUID, angle: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const constraints = state.work.constraints[id]!;

        const constrainedAngle = clampAngle(angle, constraints.angle.minAngle, constraints.angle.maxAngle);

        dispatch(updateCircleData({ id, circle: { angle: constrainedAngle } }));
        dispatch(updateCircleLineSlots(id));
    };

export const updateCirclePositionData =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const circleShape = state.image.circles[id]!;
        const constraints = state.work.constraints[id]!;

        const constrainedDistance = clamp(
            positionData.distance ?? circleShape.circle.distance,
            constraints.distance.minDistance,
            constraints.distance.maxDistance
        );

        const constrainedAngle = clampAngle(
            positionData.angle ?? circleShape.circle.angle,
            constraints.angle.minAngle,
            constraints.angle.maxAngle
        );

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
export const updateSentencePositionData = updateCirclePositionData;

export const dragSentence =
    (id: UUID, domRect: DOMRect, mouseOffset: Position): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const sentence = state.image.circles[id] as Sentence;
        const positionData = calculatePositionData(mouseOffset, viewPortScale, domRect, sentence.circle);

        dispatch(updateSentencePositionData(id, positionData));
    };

export const updateWordRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const updateWordDistance = updateCircleDistance;
export const updateWordAngle = updateCircleAngle;
export const updateWordPositionData = updateCirclePositionData;

export const dragWord =
    (id: UUID, domRect: DOMRect, mouseOffset: Position): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const word = state.image.circles[id] as Word;
        const positionData = calculatePositionData(mouseOffset, viewPortScale, domRect, word.circle);

        dispatch(updateWordPositionData(id, positionData));
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

export const updateConsonantPositionData =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(updateCirclePositionData(id, positionData));
        dispatch(updateConsonantNestedVocal(id));
    };

export const dragConsonant =
    (id: UUID, domRect: DOMRect, mouseOffset: Position): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const consonant = state.image.circles[id] as Consonant;
        const positionData = calculatePositionData(mouseOffset, viewPortScale, domRect, consonant.circle);
        dispatch(updateConsonantPositionData(id, positionData));
    };

const updateConsonantNestedVocal =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const consonant = state.image.circles[id] as Consonant;

        if (consonant.vocal) {
            // TODO update nested vocal
            //dispatch(updateVocalPositionData(consonant.vocal, {}));
        }
    };

export const updateVocalRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const updateVocalDistance = updateCircleDistance;
export const updateVocalAngle = updateCircleAngle;
export const updateVocalPositionData = updateCirclePositionData;

export const dragVocal =
    (id: UUID, domRect: DOMRect, mouseOffset: Position): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const vocal = state.image.circles[id] as Vocal;
        const parent = state.image.circles[vocal.parentId]!;

        let relativeAngle;

        if (parent.type === ImageType.Consonant) {
            relativeAngle = parent.circle.angle;
        }

        const positionData = calculatePositionData(mouseOffset, viewPortScale, domRect, vocal.circle, relativeAngle);
        dispatch(updateVocalPositionData(id, positionData));
    };

export const updateDotRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const updateDotDistance = updateCircleDistance;
export const updateDotAngle = updateCircleAngle;
export const updateDotPositionData = updateCirclePositionData;

export const dragDot =
    (id: UUID, domRect: DOMRect, mouseOffset: Position): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const dot = state.image.circles[id] as Dot;
        const consonantAngle = state.image.circles[dot.parentId]!.circle.angle;
        const positionData = calculatePositionData(mouseOffset, viewPortScale, domRect, dot.circle, consonantAngle);
        dispatch(updateDotPositionData(id, positionData));
    };

export const updateLineSlotDistance =
    (id: UUID, distance: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const constraints = state.work.constraints[id]!;

        const constrainedDistance = clamp(distance, constraints.distance.minDistance, constraints.distance.maxDistance);

        dispatch(updateLineSlotData({ id, positionData: { distance: constrainedDistance } }));
    };

export const updateLineSlotAngle =
    (id: UUID, angle: Degree): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const constraints = state.work.constraints[id]!;

        const constrainedAngle = clampAngle(angle, constraints.angle.minAngle, constraints.angle.maxAngle);

        dispatch(updateLineSlotData({ id, positionData: { angle: constrainedAngle } }));
    };

export const updateLineSlotPositionData =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const lineSlot = state.image.lineSlots[id]!;
        const constraints = state.work.constraints[id]!;

        const distance = clamp(
            positionData.distance ?? lineSlot.distance,
            constraints.distance.minDistance,
            constraints.distance.maxDistance
        );

        const angle = clampAngle(
            positionData.angle ?? lineSlot.angle,
            constraints.angle.minAngle,
            constraints.angle.maxAngle
        );

        dispatch(updateLineSlotData({ id, positionData: { distance, angle } }));
    };

export const dragLineSlot =
    (id: UUID, domRect: DOMRect, mouseOffset: Position): AppThunkAction =>
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

        const positionData = calculatePositionData(mouseOffset, viewPortScale, domRect, lineSlot, relativeAngle);
        dispatch(updateLineSlotPositionData(id, positionData));
    };
