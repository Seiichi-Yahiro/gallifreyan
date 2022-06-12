import { calculatePositionData, constrainDistanceOnAngle } from '../../utils/DragAndDrop';
import { clamp, clampAngle, Position } from '../../utils/LinearAlgebra';
import { calculateTranslation } from '../../utils/TextTransforms';
import { AppThunkAction } from '../AppState';
import { setHovering, setSelection } from '../work/WorkActions';
import {
    convertSentenceText,
    nestWordVocals,
    resetAllPositionsAndRadii,
    updateCircleData,
    updateLineSlotData,
} from './ImageActions';
import { ImageType, Consonant, Dot, Sentence, UUID, Vocal, Word, PositionData, ConsonantPlacement } from './ImageTypes';

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
        const svgSize = state.image.svgSize;

        const distance = clamp(positionData.distance ?? sentence.circle.distance, 0, svgSize / 2 - sentence.circle.r);
        const angle = clampAngle(positionData.angle ?? sentence.circle.angle, 0, 360);

        dispatch(updateCircleData({ id, circle: { distance, angle } }));
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
        const sentence = state.image.circles[word.parentId] as Sentence;
        const { minAngle, maxAngle } = state.work.selection!.angleConstraints!;

        const distance = positionData.distance ?? word.circle.distance;
        const angle = positionData.angle ?? word.circle.angle;

        const constrainedAngle = clampAngle(angle, minAngle, maxAngle);
        let constrainedDistance = distance;

        if (angle < minAngle || angle > maxAngle) {
            const position = calculateTranslation(angle, distance);
            constrainedDistance = constrainDistanceOnAngle(position, constrainedAngle);
        }

        constrainedDistance = clamp(constrainedDistance, 0, sentence.circle.r - word.circle.r);

        dispatch(updateCircleData({ id, circle: { distance: constrainedDistance, angle: constrainedAngle } }));
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
        const word = state.image.circles[consonant.parentId] as Word;
        const { minAngle, maxAngle } = state.work.selection!.angleConstraints!;

        const angle = clampAngle(positionData.angle ?? consonant.circle.angle, minAngle, maxAngle);

        let distance = positionData.distance ?? consonant.circle.distance;

        switch (consonant.placement) {
            case ConsonantPlacement.DeepCut:
                {
                    distance = clamp(
                        distance,
                        word.circle.r - consonant.circle.r * 0.95,
                        word.circle.r - consonant.circle.r * 0.5
                    );
                }
                break;
            case ConsonantPlacement.ShallowCut:
                {
                    distance = clamp(distance, word.circle.r, word.circle.r + consonant.circle.r * 0.95);
                }
                break;
            case ConsonantPlacement.Inside:
                {
                    distance = clamp(distance, 0, word.circle.r - consonant.circle.r);
                }
                break;
            case ConsonantPlacement.OnLine:
                distance = consonant.circle.distance;
                break;
        }

        dispatch(updateCircleData({ id, circle: { distance, angle } }));

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
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: positionData }));
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
        const consonant = state.image.circles[dot.parentId] as Consonant;

        const distance = clamp(positionData.distance ?? dot.circle.distance, 0, consonant.circle.r);
        const angle = clampAngle(positionData.angle ?? dot.circle.angle, 0, 360);

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
        dispatch(updateLineSlotData({ id, positionData }));
    };
