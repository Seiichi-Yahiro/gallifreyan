import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { calculatePositionData } from '../utils/DragAndDrop';
import { isValidLetter } from '../utils/LetterGroups';
import { Position } from '../utils/LinearAlgebra';
import { convertTextToSentence, splitWordToChars } from '../utils/TextConverter';
import { resetCircleDatas } from '../utils/TextTransforms';
import { AppThunkAction } from './AppState';
import {
    Circle,
    CircleData,
    LineConnection,
    LineSlot,
    LineSlotData,
    PositionData,
    Referencable,
    Sentence,
    UUID,
} from './ImageTypes';

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

export const moveWord =
    (id: UUID, mousePos: Position, childDomRect: DOMRect, childPositionData: PositionData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const positionData = calculatePositionData(state, mousePos, childDomRect, childPositionData);
        dispatch(updateCircleData({ id, ...positionData }));
    };

export const moveConsonant =
    (id: UUID, mousePos: Position, childDomRect: DOMRect, childPositionData: PositionData): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const positionData = calculatePositionData(state, mousePos, childDomRect, childPositionData);
        dispatch(updateCircleData({ id, ...positionData }));
    };

export const moveVocal =
    (
        id: UUID,
        mousePos: Position,
        childDomRect: DOMRect,
        childPositionData: PositionData,
        parentAngle?: number
    ): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const positionData = calculatePositionData(state, mousePos, childDomRect, childPositionData, parentAngle);
        dispatch(updateCircleData({ id, ...positionData }));
    };

export const moveDot =
    (
        id: UUID,
        mousePos: Position,
        childDomRect: DOMRect,
        childPositionData: PositionData,
        parentAngle: number
    ): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const positionData = calculatePositionData(state, mousePos, childDomRect, childPositionData, parentAngle);
        dispatch(updateCircleData({ id, ...positionData }));
    };

export const moveLineSlot =
    (
        id: UUID,
        mousePos: Position,
        childDomRect: DOMRect,
        childPositionData: PositionData,
        parentAngle: number
    ): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const positionData = calculatePositionData(state, mousePos, childDomRect, childPositionData, parentAngle);
        dispatch(updateLineSlotData({ id, ...positionData }));
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
