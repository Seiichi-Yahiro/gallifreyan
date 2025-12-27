import { historyActions } from '@/redux/history/history.slice';
import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/ids';
import type { Letter } from '@/redux/text/letter.types';
import {
    type DotElement,
    type LetterElement,
    type LineSlotElement,
    type SentenceElement,
    type TextElementsDict,
    TextElementType,
    type WordElement,
} from '@/redux/text/text.types';
import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';

export type TextSlice = {
    value: string;
    rootElement: SentenceId | null;
    elements: TextElementsDict;
};

export const createInitialTextState = (): TextSlice => ({
    value: '',
    rootElement: null,
    elements: {},
});

const textSlice = createSlice({
    name: 'text',
    initialState: createInitialTextState,
    reducers: {
        setText: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
        addSentence: (
            state,
            action: PayloadAction<{ id: SentenceId; text: string }>,
        ) => {
            state.rootElement = action.payload.id;

            state.elements[action.payload.id] = {
                elementType: TextElementType.Sentence,
                id: action.payload.id,
                text: action.payload.text,
                words: [],
            } satisfies SentenceElement;
        },
        removeSentence: (state, action: PayloadAction<SentenceId>) => {
            state.rootElement = null;
            delete state.elements[action.payload];
        },
        updateSentenceText: (
            state,
            action: PayloadAction<{ id: SentenceId; text: string }>,
        ) => {
            state.elements[action.payload.id].text = action.payload.text;
        },
        addWord: (
            state,
            action: PayloadAction<{
                id: WordId;
                parent: SentenceId;
                text: string;
            }>,
        ) => {
            state.elements[action.payload.parent].words.push(action.payload.id);

            state.elements[action.payload.id] = {
                elementType: TextElementType.Word,
                id: action.payload.id,
                parent: action.payload.parent,
                text: action.payload.text,
                letters: [],
            } satisfies WordElement;
        },
        removeWord: (state, action: PayloadAction<WordId>) => {
            const parentId = state.elements[action.payload].parent;
            const parent = state.elements[parentId];

            parent.words = parent.words.filter(
                (wordId) => wordId !== action.payload,
            );

            delete state.elements[action.payload];
        },
        updateWordText: (
            state,
            action: PayloadAction<{ id: WordId; text: string }>,
        ) => {
            state.elements[action.payload.id].text = action.payload.text;
        },
        addLetter: (
            state,
            action: PayloadAction<{
                id: LetterId;
                parent: WordId;
                text: string;
                letter: Letter;
                index?: number;
            }>,
        ) => {
            if (action.payload.index !== undefined) {
                state.elements[action.payload.parent].letters.splice(
                    action.payload.index,
                    0,
                    action.payload.id,
                );
            } else {
                state.elements[action.payload.parent].letters.push(
                    action.payload.id,
                );
            }

            state.elements[action.payload.id] = {
                elementType: TextElementType.Letter,
                id: action.payload.id,
                parent: action.payload.parent,
                text: action.payload.text,
                letter: action.payload.letter,
                dots: [],
                lineSlots: [],
            } satisfies LetterElement;
        },
        removeLetter: (state, action: PayloadAction<LetterId>) => {
            const parentId = state.elements[action.payload].parent;
            const parent = state.elements[parentId];

            parent.letters = parent.letters.filter(
                (letterId) => letterId !== action.payload,
            );

            delete state.elements[action.payload];
        },
        updateLetterText: (
            state,
            action: PayloadAction<{
                id: LetterId;
                text: string;
                letter: Letter;
            }>,
        ) => {
            const letterElement = state.elements[action.payload.id];
            letterElement.text = action.payload.text;
            letterElement.letter = action.payload.letter;
        },
        addDot: (
            state,
            action: PayloadAction<{ id: DotId; parent: LetterId }>,
        ) => {
            state.elements[action.payload.parent].dots.push(action.payload.id);

            state.elements[action.payload.id] = {
                elementType: TextElementType.Dot,
                id: action.payload.id,
                parent: action.payload.parent,
            } satisfies DotElement;
        },
        removeDot: (state, action: PayloadAction<DotId>) => {
            const parentId = state.elements[action.payload].parent;
            const parent = state.elements[parentId];

            parent.dots = parent.dots.filter(
                (dotId) => dotId !== action.payload,
            );

            delete state.elements[action.payload];
        },
        addLineSlot: (
            state,
            action: PayloadAction<{ id: LineSlotId; parent: LetterId }>,
        ) => {
            state.elements[action.payload.parent].lineSlots.push(
                action.payload.id,
            );

            state.elements[action.payload.id] = {
                elementType: TextElementType.LineSlot,
                id: action.payload.id,
                parent: action.payload.parent,
            } satisfies LineSlotElement;
        },
        removeLineSlot: (state, action: PayloadAction<LineSlotId>) => {
            const parentId = state.elements[action.payload].parent;
            const parent = state.elements[parentId];

            parent.lineSlots = parent.lineSlots.filter(
                (lineSlotId) => lineSlotId !== action.payload,
            );

            delete state.elements[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(historyActions.undo, historyActions.redo),
            (_state, action) => {
                return action.payload.load.text;
            },
        );
    },
});

export const textActions = textSlice.actions;
export default textSlice.reducer;
