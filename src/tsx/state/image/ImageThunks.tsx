import { calculatePositionData } from '../../utils/DragAndDrop';
import { clamp, clampAngle, Position } from '../../utils/LinearAlgebra';
import Maybe from '../../utils/Maybe';
import { AppThunkAction } from '../AppState';
import { setHovering, setSelection } from '../work/WorkActions';
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

interface MovableData {
    id: UUID;
    domRect: DOMRect;
}

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
    (mousePos: Position, wordData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const word = state.image.circles[wordData.id] as Sentence;
        const positionData = calculatePositionData(mousePos, viewPortScale, wordData.domRect, word.circle);
        dispatch(moveSentence(wordData.id, positionData));
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

        const wordIndex = sentence.words.findIndex((wordId) => wordId === word.id);

        const minAngle = Maybe.of(sentence.words[wordIndex - 1])
            .map((wordId) => state.image.circles[wordId])
            .map((word) => word.circle.angle)
            .unwrapOr(0);

        const maxAngle = Maybe.of(sentence.words[wordIndex + 1])
            .map((wordId) => state.image.circles[wordId])
            .map((word) => word.circle.angle)
            .unwrapOr(360);

        const distance = clamp(positionData.distance ?? word.circle.distance, 0, sentence.circle.r - word.circle.r);
        const angle = clampAngle(positionData.angle ?? word.circle.angle, minAngle, maxAngle);

        dispatch(updateCircleData({ id, circle: { distance, angle } }));
    };

export const dragWord =
    (mousePos: Position, wordData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const word = state.image.circles[wordData.id] as Word;
        const positionData = calculatePositionData(mousePos, viewPortScale, wordData.domRect, word.circle);
        dispatch(moveWord(wordData.id, positionData));
    };

export const updateConsonantRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const moveConsonant =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: positionData }));
    };

export const dragConsonant =
    (mousePos: Position, consonantData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const consonant = state.image.circles[consonantData.id] as Consonant;
        const positionData = calculatePositionData(mousePos, viewPortScale, consonantData.domRect, consonant.circle);
        dispatch(moveConsonant(consonantData.id, positionData));
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
    (mousePos: Position, vocalData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const vocal = state.image.circles[vocalData.id] as Vocal;
        const parent = state.image.circles[vocal.parentId]!;

        let relativeAngle;

        if (parent.type === ImageType.Consonant) {
            relativeAngle = parent.circle.angle;
        }

        const positionData = calculatePositionData(
            mousePos,
            viewPortScale,
            vocalData.domRect,
            vocal.circle,
            relativeAngle
        );
        dispatch(moveVocal(vocalData.id, positionData));
    };

export const updateDotRadius =
    (id: UUID, r: number): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: { r } }));
    };

export const moveDot =
    (id: UUID, positionData: Partial<PositionData>): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO validation
        dispatch(updateCircleData({ id, circle: positionData }));
    };

export const dragDot =
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
        dispatch(moveDot(dotData.id, positionData));
    };

export const dragLineSlot =
    (mousePos: Position, lineSlotData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const lineSlot = state.image.lineSlots[lineSlotData.id]!;
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

        const positionData = calculatePositionData(
            mousePos,
            viewPortScale,
            lineSlotData.domRect,
            lineSlot,
            relativeAngle
        );
        dispatch(updateLineSlotData({ id: lineSlotData.id, positionData }));
    };
