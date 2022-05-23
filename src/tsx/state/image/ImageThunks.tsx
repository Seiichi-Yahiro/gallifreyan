import { calculatePositionData } from '../../utils/DragAndDrop';
import { Position } from '../../utils/LinearAlgebra';
import { AppThunkAction } from '../AppState';
import {
    convertSentenceText,
    nestWordVocals,
    resetAllPositionsAndRadii,
    updateCircleData,
    updateLineSlotData,
} from './ImageActions';
import { CircleType, Consonant, Dot, Sentence, UUID, Vocal, Word } from './ImageTypes';

export const setSentence =
    (sentenceText: string): AppThunkAction =>
    (dispatch, getState) => {
        dispatch(convertSentenceText(sentenceText));

        const state = getState();
        const sentence = state.image.circles[state.image.rootCircleId] as Sentence;

        sentence.words.forEach((wordId) => {
            dispatch(nestWordVocals(wordId));
        });

        dispatch(resetAllPositionsAndRadii());
    };

interface MovableData {
    id: UUID;
    domRect: DOMRect;
}

export const moveWord =
    (mousePos: Position, wordData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const word = state.image.circles[wordData.id] as Word;
        const positionData = calculatePositionData(mousePos, viewPortScale, wordData.domRect, word.circle);
        dispatch(updateCircleData({ id: wordData.id, circle: positionData }));
    };

export const moveConsonant =
    (mousePos: Position, consonantData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const consonant = state.image.circles[consonantData.id] as Consonant;
        const positionData = calculatePositionData(mousePos, viewPortScale, consonantData.domRect, consonant.circle);
        dispatch(updateCircleData({ id: consonantData.id, circle: positionData }));
    };

export const moveVocal =
    (mousePos: Position, vocalData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const vocal = state.image.circles[vocalData.id] as Vocal;
        const parent = state.image.circles[vocal.parentId]!;

        let relativeAngle;

        if (parent.type === CircleType.Consonant) {
            relativeAngle = parent.circle.angle;
        }

        const positionData = calculatePositionData(
            mousePos,
            viewPortScale,
            vocalData.domRect,
            vocal.circle,
            relativeAngle
        );
        dispatch(updateCircleData({ id: vocalData.id, circle: positionData }));
    };

export const moveDot =
    (mousePos: Position, dotData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const dot = state.image.circles[dotData.id] as Dot;
        const consonantAngle = state.image.circles[dot.parentId]!.circle.angle;
        const positionData = calculatePositionData(
            mousePos,
            viewPortScale,
            dotData.domRect,
            dot.circle,
            consonantAngle
        );
        dispatch(updateCircleData({ id: dotData.id, circle: positionData }));
    };

export const moveLineSlot =
    (mousePos: Position, lineSlotData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const lineSlot = state.image.lineSlots[lineSlotData.id]!;
        const parent = state.image.circles[lineSlot.parentId]!;

        let relativeAngle;

        if (parent.type === CircleType.Consonant) {
            relativeAngle = parent.circle.angle;
        } else if (parent.type === CircleType.Vocal) {
            const parentParent = state.image.circles[parent.parentId]!;

            // if nested vocal
            if (parentParent.type === CircleType.Consonant) {
                relativeAngle = parentParent.circle.angle;
            } else {
                relativeAngle = parent.circle.angle;
            }
        }

        const positionData = calculatePositionData(
            mousePos,
            viewPortScale,
            lineSlotData.domRect,
            lineSlot,
            relativeAngle
        );
        dispatch(updateLineSlotData({ id: lineSlotData.id, positionData }));
    };
