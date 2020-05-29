import { createActionCreator, createReducer } from 'deox';
import { produce } from 'immer';
import { isValidLetter } from '../utils/LetterGroups';
import { convertTextToSentence, splitWordToChars } from '../utils/TextConverter';
import { resetPositionDatas } from '../utils/TextTransforms';
import { Circle, LineConnection, LineSlot, Sentence } from './ImageTypes';

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

export const addSentenceAction = createActionCreator('ADD_SENTENCE', (resolve) => (sentence: string) =>
    resolve(sentence)
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
]);
