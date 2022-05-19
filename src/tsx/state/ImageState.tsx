import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { calculatePositionData } from '../utils/DragAndDrop';
import { isValidLetter } from '../utils/LetterGroups';
import { Position } from '../utils/LinearAlgebra';
import { convertTextToSentence, splitWordToChars } from '../utils/TextConverter';
import { resetCircleDatas } from '../utils/TextTransforms';
import { AppThunkAction } from './AppState';
import { Circle, CircleData, LineConnection, LineSlot, LineSlotData, Referencable, Sentence, UUID } from './ImageTypes';

export interface ImageState {
    circles: { [key: string]: Circle };
    lineConnections: { [key: string]: LineConnection };
    lineSlots: { [key: string]: LineSlot };
    sentence: Sentence;
    svgSize: number;
}

const createInitialState = (): ImageState => ({
    circles: { uuid: { id: 'uuid', angle: 0, distance: 0, r: 0, filled: false } },
    lineConnections: {},
    lineSlots: {},
    sentence: {
        text: '',
        circleId: 'uuid',
        words: [],
        lineSlots: [],
    },
    svgSize: 1000,
});

export const updateCircleData = createAction<Referencable & Partial<CircleData>>('image/updateCircleData');
export const updateLineSlotData = createAction<Referencable & Partial<LineSlotData>>('image/updateLineSlotData');

interface MovableData {
    id: UUID;
    domRect: DOMRect;
}

export const moveWord =
    (mousePos: Position, wordData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const wordCircle = state.image.circles[wordData.id];
        const positionData = calculatePositionData(mousePos, viewPortScale, wordData.domRect, wordCircle);
        dispatch(updateCircleData({ id: wordData.id, ...positionData }));
    };

export const moveConsonant =
    (mousePos: Position, consonantData: MovableData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const consonantCircle = state.image.circles[consonantData.id];
        const positionData = calculatePositionData(mousePos, viewPortScale, consonantData.domRect, consonantCircle);
        dispatch(updateCircleData({ id: consonantData.id, ...positionData }));
    };

export const moveVocal =
    (mousePos: Position, vocalData: MovableData, parentData: { angle?: number }): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const vocalCircle = state.image.circles[vocalData.id];
        const positionData = calculatePositionData(
            mousePos,
            viewPortScale,
            vocalData.domRect,
            vocalCircle,
            parentData.angle
        );
        dispatch(updateCircleData({ id: vocalData.id, ...positionData }));
    };

export const moveDot =
    (mousePos: Position, dotData: MovableData, parentData: { angle: number }): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const dotCircle = state.image.circles[dotData.id];
        const positionData = calculatePositionData(
            mousePos,
            viewPortScale,
            dotData.domRect,
            dotCircle,
            parentData.angle
        );
        dispatch(updateCircleData({ id: dotData.id, ...positionData }));
    };

export const moveLineSlot =
    (mousePos: Position, lineSlotData: MovableData, parentData: { angle: number }): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const viewPortScale = state.svgPanZoom.value.a;
        const lineSlot = state.image.lineSlots[lineSlotData.id];
        const positionData = calculatePositionData(
            mousePos,
            viewPortScale,
            lineSlotData.domRect,
            lineSlot,
            parentData.angle
        );
        dispatch(updateLineSlotData({ id: lineSlotData.id, ...positionData }));
    };

export const imageSlice = createSlice({
    name: 'image',
    initialState: createInitialState,
    reducers: {
        updateSentence: (state, action: PayloadAction<string>) => {
            const sentenceText = action.payload;

            const text = sentenceText
                .split(' ')
                .map((word) => splitWordToChars(word).filter(isValidLetter).join(''))
                .filter((word) => word.length > 0)
                .join(' ');
            const { textPart: sentence, circles, lineSlots } = convertTextToSentence(text);

            state.sentence = sentence;

            //TODO space then invalid letter deletes space
            if (sentenceText.endsWith(' ')) {
                state.sentence.text += ' ';
            }

            state.circles = {};
            state.lineSlots = {};
            state.lineConnections = {};

            circles.forEach((circle) => (state.circles[circle.id] = circle));
            lineSlots.forEach((slot) => (state.lineSlots[slot.id] = slot));

            resetCircleDatas(state as ImageState);
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(updateCircleData, (state, { payload }) => {
                state.circles[payload.id] = {
                    ...state.circles[payload.id],
                    ...payload,
                };
            })
            .addCase(updateLineSlotData, (state, { payload }) => {
                state.lineSlots[payload.id] = {
                    ...state.lineSlots[payload.id],
                    ...payload,
                };
            }),
});

export const { updateSentence } = imageSlice.actions;

export default imageSlice.reducer;
