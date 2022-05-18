import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isValidLetter } from '../utils/LetterGroups';
import { convertTextToSentence, splitWordToChars } from '../utils/TextConverter';
import { resetCircleDatas } from '../utils/TextTransforms';
import { Circle, CircleData, LineConnection, LineSlot, LineSlotData, Referencable, Sentence } from './ImageTypes';

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
        updateCircleData: (state, { payload }: PayloadAction<Referencable & Partial<CircleData>>) => {
            state.circles[payload.id] = {
                ...state.circles[payload.id],
                ...payload,
            };
        },
        updateLineSlotData: (state, { payload }: PayloadAction<Referencable & Partial<LineSlotData>>) => {
            state.lineSlots[payload.id] = {
                ...state.lineSlots[payload.id],
                ...payload,
            };
        },
    },
});

export const { updateSentence, updateCircleData, updateLineSlotData } = imageSlice.actions;

export default imageSlice.reducer;
