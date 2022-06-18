import { calculatePositionData } from '../../utils/DragAndDrop';
import { clamp, clampAngle, Position } from '../../utils/LinearAlgebra';
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
import { ImageType, Consonant, Dot, Sentence, UUID, Vocal, Word, PositionData } from './ImageTypes';

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

export const updateSentenceRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const moveSentence =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const sentence = state.image.circles[id] as Sentence;
        const constraints = state.work.constraints[id]!;

        const distance = clamp(
            positionData.distance ?? sentence.circle.distance,
            constraints.distance.minDistance,
            constraints.distance.maxDistance
        );

        const angle = clampAngle(
            positionData.angle ?? sentence.circle.angle,
            constraints.angle.minAngle,
            constraints.angle.maxAngle
        );

        dispatch(updateCircleData({ id, circle: { distance, angle } }));

        sentence.lineSlots.forEach((lineSlotId) => {
            dispatch(setLineSlotConstraints(lineSlotId));
            dispatch(moveLineSlot(lineSlotId, {}));
        });
    };

export const dragSentence =
    (id: UUID, domRect: DOMRect, mouseOffset: Position): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const word = state.image.circles[id] as Sentence;
        const positionData = calculatePositionData(mouseOffset, viewPortScale, domRect, word.circle);
        dispatch(moveSentence(id, positionData));
    };

export const updateWordRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const moveWord =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const word = state.image.circles[id] as Word;
        const constraints = state.work.constraints[id]!;

        const angle = clampAngle(
            positionData.angle ?? word.circle.angle,
            constraints.angle.minAngle,
            constraints.angle.maxAngle
        );

        const distance = clamp(
            positionData.distance ?? word.circle.distance,
            constraints.distance.minDistance,
            constraints.distance.maxDistance
        );

        dispatch(updateCircleData({ id, circle: { distance, angle } }));

        word.lineSlots.forEach((lineSlotId) => {
            dispatch(setLineSlotConstraints(lineSlotId));
            dispatch(moveLineSlot(lineSlotId, {}));
        });
    };

export const dragWord =
    (id: UUID, domRect: DOMRect, mouseOffset: Position): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const word = state.image.circles[id] as Word;
        const positionData = calculatePositionData(mouseOffset, viewPortScale, domRect, word.circle);
        dispatch(moveWord(id, positionData));
    };

export const updateConsonantRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const moveConsonant =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const consonant = state.image.circles[id] as Consonant;
        const constraints = state.work.constraints[id]!;

        const angle = clampAngle(
            positionData.angle ?? consonant.circle.angle,
            constraints.angle.minAngle,
            constraints.angle.maxAngle
        );

        const distance = clamp(
            positionData.distance ?? consonant.circle.distance,
            constraints.distance.minDistance,
            constraints.distance.maxDistance
        );

        dispatch(updateCircleData({ id, circle: { distance, angle } }));

        consonant.lineSlots.forEach((lineSlotId) => {
            dispatch(setLineSlotConstraints(lineSlotId));
            dispatch(moveLineSlot(lineSlotId, {}));
        });

        if (consonant.vocal) {
            // TODO update nested vocal
            //dispatch(moveVocal(consonant.vocal, {}));
        }
    };

export const dragConsonant =
    (id: UUID, domRect: DOMRect, mouseOffset: Position): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const consonant = state.image.circles[id] as Consonant;
        const positionData = calculatePositionData(mouseOffset, viewPortScale, domRect, consonant.circle);
        dispatch(moveConsonant(id, positionData));
    };

export const updateVocalRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const moveVocal =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const vocal = state.image.circles[id] as Vocal;
        const constraints = state.work.constraints[id]!;

        const angle = clampAngle(
            positionData.angle ?? vocal.circle.angle,
            constraints.angle.minAngle,
            constraints.angle.maxAngle
        );

        const distance = clamp(
            positionData.distance ?? vocal.circle.distance,
            constraints.distance.minDistance,
            constraints.distance.maxDistance
        );

        dispatch(updateCircleData({ id, circle: { angle, distance } }));

        vocal.lineSlots.forEach((lineSlotId) => {
            dispatch(setLineSlotConstraints(lineSlotId));
            dispatch(moveLineSlot(lineSlotId, {}));
        });
    };

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
        dispatch(moveVocal(id, positionData));
    };

export const updateDotRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const moveDot =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const dot = state.image.circles[id] as Dot;
        const constraints = state.work.constraints[id]!;

        const distance = clamp(
            positionData.distance ?? dot.circle.distance,
            constraints.distance.minDistance,
            constraints.distance.maxDistance
        );

        const angle = clampAngle(
            positionData.angle ?? dot.circle.angle,
            constraints.angle.minAngle,
            constraints.angle.maxAngle
        );

        dispatch(updateCircleData({ id, circle: { distance, angle } }));
    };

export const dragDot =
    (id: UUID, domRect: DOMRect, mouseOffset: Position): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const dot = state.image.circles[id] as Dot;
        const consonantAngle = state.image.circles[dot.parentId]!.circle.angle;
        const positionData = calculatePositionData(mouseOffset, viewPortScale, domRect, dot.circle, consonantAngle);
        dispatch(moveDot(id, positionData));
    };

export const moveLineSlot =
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
        dispatch(moveLineSlot(id, positionData));
    };
