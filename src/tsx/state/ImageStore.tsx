import { createActionCreator, createReducer } from 'deox';
import { produce } from 'immer';
import { isValidLetter } from '../utils/LetterGroups';
import { convertTextToSentence, splitWordToChars } from '../utils/TextConverter';
import { resetPositionDatas } from '../utils/TextTransforms';
import { Circle, CircleData, LineConnection, LineSlot, LineSlotData, Sentence } from './ImageTypes';

export interface ImageStore {
    circles: { [key: string]: Circle };
    lineConnections: { [key: string]: LineConnection };
    lineSlots: { [key: string]: LineSlot };
    sentences: Sentence[];
    svgSize: number;
}

const defaultState: ImageStore = {
    circles: {},
    lineConnections: {},
    lineSlots: {},
    sentences: [],
    svgSize: 1000,
};

export const addSentenceAction = createActionCreator(
    'ADD_SENTENCE',
    (resolve) => (sentence: string) => resolve(sentence)
);

export const updateCircleDataAction = createActionCreator(
    'UPDATE_CIRCLE_DATA',
    (resolve) => (data: CircleData) => resolve(data)
);
export const updateLineSlotDataAction = createActionCreator(
    'UPDATE_LINE_SLOT_DATA',
    (resolve) => (data: LineSlotData) => resolve(data)
);

export const imageStoreReducer = createReducer(defaultState, (handle) => [
    handle(addSentenceAction, (state, { payload: sentenceText }) =>
        produce(state, (draft) => {
            const text = sentenceText
                .split(' ')
                .map((word) => splitWordToChars(word).filter(isValidLetter).join(''))
                .filter((word) => word.length > 0)
                .join(' ');
            const { textPart: sentence, circles, lineSlots } = convertTextToSentence(text);

            draft.sentences.push(sentence);
            circles.forEach((circle) => (draft.circles[circle.id] = circle));
            lineSlots.forEach((slot) => (draft.lineSlots[slot.id] = slot));

            resetPositionDatas(draft as ImageStore);
        })
    ),
    handle(updateCircleDataAction, (state, { payload }) =>
        produce(state, (draft) => {
            draft.circles[payload.id] = {
                ...draft.circles[payload.id],
                ...payload,
            };
        })
    ),
    handle(updateLineSlotDataAction, (state, { payload }) =>
        produce(state, (draft) => {
            draft.lineSlots[payload.id] = {
                ...draft.lineSlots[payload.id],
                ...payload,
            };
        })
    ),
]);
