import { createReducer } from '@reduxjs/toolkit';
import { isValidLetter } from '../../utils/LetterGroups';
import { convertTextToSentence, nestWordVocals as nestVocals, splitWordToChars } from '../../utils/TextConverter';
import { resetCircleAndLineSlotData } from '../../utils/TextTransforms';
import {
    convertSentenceText,
    nestWordVocals,
    resetAllPositionsAndRadii,
    updateCircleData,
    updateLineSlotData,
} from './ImageActions';
import { CircleShape, Letter, LineConnection, LineSlot, Sentence, UUID, Word } from './ImageTypes';

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

const reducer = createReducer(createInitialState, (builder) =>
    builder
        .addCase(convertSentenceText, (state, { payload: sentenceText }) => {
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
        })
        .addCase(nestWordVocals, (state, { payload: wordId }) => {
            const word = state.circles[wordId] as Word;
            const letters = word.letters.map((letterId) => state.circles[letterId] as Letter);

            const { word: newWord, letters: newLetters } = nestVocals(word, letters);

            state.circles[wordId] = newWord;
            newLetters.forEach((letter) => (state.circles[letter.id] = letter));
        })
        .addCase(resetAllPositionsAndRadii, (state) => {
            resetCircleAndLineSlotData(state);
        })
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
        })
);

export default reducer;
