import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { calculatePositionData } from '../utils/DragAndDrop';
import { isValidLetter } from '../utils/LetterGroups';
import { Position } from '../utils/LinearAlgebra';
import { convertTextToSentence, splitWordToChars } from '../utils/TextConverter';
import { resetCircleAndLineSlotData } from '../utils/TextTransforms';
import { AppThunkAction } from './AppState';
import {
    Circle,
    CircleShape,
    CircleType,
    Consonant,
    Dot,
    LineConnection,
    LineSlot,
    PositionData,
    Referencable,
    Sentence,
    UUID,
    Vocal,
    Word,
} from './ImageTypes';

export interface ImageState {
    rootCircleId: UUID;
    circles: Partial<Record<UUID, CircleShape>>;
    lineSlots: Partial<Record<UUID, LineSlot>>;
    lineConnections: Partial<Record<UUID, LineConnection>>;
    svgSize: number;
}

const createInitialState = (): ImageState => ({
    rootCircleId: '',
    circles: {},
    lineSlots: {},
    lineConnections: {},
    svgSize: 1000,
});

export const updateCircleData = createAction<Referencable & { circle: Partial<Circle> }>('image/updateCircleData');
export const updateLineSlotData = createAction<Referencable & { positionData: Partial<PositionData> }>(
    'image/updateLineSlotData'
);

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

export const imageSlice = createSlice({
    name: 'image',
    initialState: createInitialState,
    reducers: {
        setSentence: (state, action: PayloadAction<string>) => {
            const sentenceText = action.payload;

            const text = sentenceText
                .split(' ')
                .map((word) => splitWordToChars(word).filter(isValidLetter).join(''))
                .filter((word) => word.length > 0)
                .join(' ');

            const textData = convertTextToSentence(text);

            state.rootCircleId = textData.id;
            state.circles = textData.circles;
            state.lineSlots = textData.lineSlots;

            //TODO space then invalid letter deletes space
            if (sentenceText.endsWith(' ')) {
                const sentence = state.circles[textData.id] as Sentence;
                sentence.text += ' ';
            }

            resetCircleAndLineSlotData(state);
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(updateCircleData, (state, { payload }) => {
                state.circles[payload.id]!.circle = {
                    ...state.circles[payload.id]!.circle,
                    ...payload.circle,
                };
            })
            .addCase(updateLineSlotData, (state, { payload }) => {
                state.lineSlots[payload.id] = {
                    ...state.lineSlots[payload.id]!,
                    ...payload.positionData,
                };
            }),
});

export const { setSentence } = imageSlice.actions;

export default imageSlice.reducer;
