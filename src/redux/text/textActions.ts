import type {
    DotElement,
    LetterElement,
    LineSlotElement,
    SentenceElement,
    WordElement,
} from '@/redux/text/textTypes';
import { createAction } from '@reduxjs/toolkit';

const setText = createAction<string>('TEXT/SET_TEXT');

const addSentence = createAction<SentenceElement>('TEXT/ADD_SENTENCE');
const removeSentence = createAction('TEXT/REMOVE_SENTENCE');
const updateSentenceText = createAction<Pick<SentenceElement, 'id' | 'text'>>(
    'TEXT/UPDATE_SENTENCE',
);

const addWord = createAction<WordElement>('TEXT/ADD_WORD');
const removeWord = createAction<WordElement['id']>('TEXT/REMOVE_WORD');
const updateWordText =
    createAction<Pick<WordElement, 'id' | 'text'>>('TEXT/UPDATE_WORD');

const addLetter = createAction<LetterElement>('TEXT/ADD_LETTER');
const removeLetter = createAction<LetterElement['id']>('TEXT/REMOVE_LETTER');
const updateLetterText =
    createAction<Pick<LetterElement, 'id' | 'text' | 'letter'>>(
        'TEXT/UPDATE_LETTER',
    );

const addDot = createAction<DotElement>('TEXT/ADD_DOT');
const removeDot = createAction<DotElement['id']>('TEXT/REMOVE_DOT');

const addLineSlot = createAction<LineSlotElement>('TEXT/ADD_LINE_SLOT');
const removeLineSlot = createAction<LineSlotElement['id']>(
    'TEXT/REMOVE_LINE_SLOT',
);

const textActions = {
    setText,
    addSentence,
    removeSentence,
    updateSentenceText,
    addWord,
    removeWord,
    updateWordText,
    addLetter,
    removeLetter,
    updateLetterText,
    addDot,
    removeDot,
    addLineSlot,
    removeLineSlot,
};

export default textActions;
