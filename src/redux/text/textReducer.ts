import type { MainState } from '@/redux/reducer';
import {
    convertConsonantIdToVocalId,
    convertVocalIdToConsonantId,
    type SentenceId,
} from '@/redux/text/ids';
import textActions from '@/redux/text/textActions';
import {
    type ConsonantElement,
    type DotElement,
    type LineSlotElement,
    type SentenceElement,
    type TextElementsDict,
    TextElementType,
    type VocalElement,
    type WordElement,
} from '@/redux/text/textTypes';
import type { SplitLettersOptions } from '@/redux/text/textUtils';
import { type ActionReducerMapBuilder } from '@reduxjs/toolkit';

export interface TextState {
    value: string;
    rootElement: SentenceId | null;
    elements: TextElementsDict;
    splitLetterOptions: Required<SplitLettersOptions>;
}

export const createInitialTextState = (): TextState => ({
    value: '',
    rootElement: null,
    elements: {},
    splitLetterOptions: {
        digraphs: true,
        doubleLetters: true,
    },
});

export const createTextReducerCases = (
    builder: ActionReducerMapBuilder<MainState>,
) => {
    builder
        .addCase(textActions.setText, (state, action) => {
            state.text.value = action.payload;
            state.hovered = null;
            state.selected = null;
        })
        .addCase(textActions.addSentence, (state, action) => {
            state.text.rootElement = action.payload.id;

            state.text.elements[action.payload.id] = {
                elementType: TextElementType.Sentence,
                id: action.payload.id,
                text: action.payload.text,
                words: [],
            } satisfies SentenceElement;
        })
        .addCase(textActions.removeSentence, (state, action) => {
            state.text.rootElement = null;
            delete state.text.elements[action.payload];
        })
        .addCase(textActions.updateSentenceText, (state, action) => {
            state.text.elements[action.payload.id].text = action.payload.text;
        })
        .addCase(textActions.addWord, (state, action) => {
            state.text.elements[action.payload.parent].words.push(
                action.payload.id,
            );

            state.text.elements[action.payload.id] = {
                elementType: TextElementType.Word,
                id: action.payload.id,
                parent: action.payload.parent,
                text: action.payload.text,
                letters: [],
            } satisfies WordElement;
        })
        .addCase(textActions.removeWord, (state, action) => {
            const parentId = state.text.elements[action.payload].parent;
            const parent = state.text.elements[parentId];
            parent.words = parent.words.filter(
                (wordId) => wordId !== action.payload,
            );

            delete state.text.elements[action.payload];
        })
        .addCase(textActions.updateWordText, (state, action) => {
            state.text.elements[action.payload.id].text = action.payload.text;
        })
        .addCase(textActions.addConsonant, (state, action) => {
            if (action.payload.index) {
                state.text.elements[action.payload.parent].letters.splice(
                    action.payload.index,
                    0,
                    action.payload.id,
                );
            } else {
                state.text.elements[action.payload.parent].letters.push(
                    action.payload.id,
                );
            }

            state.text.elements[action.payload.id] = {
                elementType: TextElementType.Consonant,
                id: action.payload.id,
                parent: action.payload.parent,
                text: action.payload.text,
                letter: action.payload.letter,
                dots: [],
                lineSlots: [],
            } satisfies ConsonantElement;
        })
        .addCase(textActions.addVocal, (state, action) => {
            if (action.payload.index) {
                state.text.elements[action.payload.parent].letters.splice(
                    action.payload.index,
                    0,
                    action.payload.id,
                );
            } else {
                state.text.elements[action.payload.parent].letters.push(
                    action.payload.id,
                );
            }

            state.text.elements[action.payload.id] = {
                elementType: TextElementType.Vocal,
                id: action.payload.id,
                parent: action.payload.parent,
                text: action.payload.text,
                letter: action.payload.letter,
                lineSlots: [],
            } satisfies VocalElement;
        })
        .addCase(textActions.removeLetter, (state, action) => {
            const parentId = state.text.elements[action.payload].parent;
            const parent = state.text.elements[parentId];
            parent.letters = parent.letters.filter(
                (letterId) => letterId !== action.payload,
            );

            delete state.text.elements[action.payload];
        })
        .addCase(textActions.updateConsonantText, (state, action) => {
            const letterElement = state.text.elements[action.payload.id];
            letterElement.text = action.payload.text;
            letterElement.letter = action.payload.letter;
        })
        .addCase(textActions.updateVocalText, (state, action) => {
            const letterElement = state.text.elements[action.payload.id];
            letterElement.text = action.payload.text;
            letterElement.letter = action.payload.letter;
        })
        .addCase(textActions.convertConsonantToVocal, (state, action) => {
            const letterElement = state.text.elements[action.payload.oldId];
            const parentElement = state.text.elements[letterElement.parent];

            const index = parentElement.letters.findIndex(
                (letterId) => letterId === action.payload.oldId,
            );

            const newId = convertConsonantIdToVocalId(action.payload.oldId);
            parentElement.letters.splice(index, 1, newId);

            state.text.elements[newId] = {
                elementType: TextElementType.Vocal,
                id: newId,
                parent: letterElement.parent,
                text: action.payload.text,
                letter: action.payload.letter,
                lineSlots: letterElement.lineSlots,
            } satisfies VocalElement;

            delete state.text.elements[action.payload.oldId];

            for (const lineSlotId of letterElement.lineSlots) {
                state.text.elements[lineSlotId].parent = newId;
            }
        })
        .addCase(textActions.convertVocalToConsonant, (state, action) => {
            const letterElement = state.text.elements[action.payload.oldId];
            const parentElement = state.text.elements[letterElement.parent];

            const index = parentElement.letters.findIndex(
                (letterId) => letterId === action.payload.oldId,
            );

            const newId = convertVocalIdToConsonantId(action.payload.oldId);
            parentElement.letters.splice(index, 1, newId);

            state.text.elements[newId] = {
                elementType: TextElementType.Consonant,
                id: newId,
                parent: letterElement.parent,
                text: action.payload.text,
                letter: action.payload.letter,
                dots: [],
                lineSlots: letterElement.lineSlots,
            } satisfies ConsonantElement;

            delete state.text.elements[action.payload.oldId];

            for (const lineSlotId of letterElement.lineSlots) {
                state.text.elements[lineSlotId].parent = newId;
            }
        })
        .addCase(textActions.addDot, (state, action) => {
            state.text.elements[action.payload.parent].dots.push(
                action.payload.id,
            );

            state.text.elements[action.payload.id] = {
                elementType: TextElementType.Dot,
                id: action.payload.id,
                parent: action.payload.parent,
            } satisfies DotElement;
        })
        .addCase(textActions.removeDot, (state, action) => {
            const parentId = state.text.elements[action.payload].parent;
            const parent = state.text.elements[parentId];
            parent.dots = parent.dots.filter(
                (dotId) => dotId !== action.payload,
            );

            delete state.text.elements[action.payload];
        })
        .addCase(textActions.addLineSlot, (state, action) => {
            state.text.elements[action.payload.parent].lineSlots.push(
                action.payload.id,
            );

            state.text.elements[action.payload.id] = {
                elementType: TextElementType.LineSlot,
                id: action.payload.id,
                parent: action.payload.parent,
            } satisfies LineSlotElement;
        })
        .addCase(textActions.removeLineSlot, (state, action) => {
            const parentId = state.text.elements[action.payload].parent;
            const parent = state.text.elements[parentId];
            parent.lineSlots = parent.lineSlots.filter(
                (lineSlotId) => lineSlotId !== action.payload,
            );

            delete state.text.elements[action.payload];
        })
        .addCase(textActions.setSplitLetterOptions, (state, action) => {
            state.text.splitLetterOptions = {
                ...state.text.splitLetterOptions,
                ...action.payload,
            };
        });
};
