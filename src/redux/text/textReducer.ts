import type { MainState } from '@/redux/reducer';
import { type SentenceId } from '@/redux/text/ids';
import textActions from '@/redux/text/textActions';
import {
    type DotElement,
    type LetterElement,
    type LineSlotElement,
    type SentenceElement,
    type TextElementsDict,
    TextElementType,
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
    },
});

export const createTextReducer = (
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
        .addCase(textActions.addLetter, (state, action) => {
            state.text.elements[action.payload.parent].letters.push(
                action.payload.id,
            );

            state.text.elements[action.payload.id] = {
                elementType: TextElementType.Letter,
                id: action.payload.id,
                parent: action.payload.parent,
                text: action.payload.text,
                letter: action.payload.letter,
                dots: [],
                lineSlots: [],
            } satisfies LetterElement;
        })
        .addCase(textActions.removeLetter, (state, action) => {
            const parentId = state.text.elements[action.payload].parent;
            const parent = state.text.elements[parentId];
            parent.letters = parent.letters.filter(
                (letterId) => letterId !== action.payload,
            );

            delete state.text.elements[action.payload];
        })
        .addCase(textActions.updateLetterText, (state, action) => {
            const letterElement = state.text.elements[action.payload.id];
            letterElement.text = action.payload.text;
            letterElement.letter = action.payload.letter;
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
