import type {
    AttachedLetterId,
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    StackedLetterId,
    WordId,
} from '@/redux/text/ids';
import type { SplitLettersOptions } from '@/redux/text/textSplitter';
import {
    type AttachedLetterElement,
    DotElement,
    LetterElement,
    LineSlotElement,
    SentenceElement,
    type StackedLetterElement,
    WordElement,
} from '@/redux/text/textTypes';
import { createAction } from '@reduxjs/toolkit';

const setText = createAction<string>('TEXT/SET_TEXT');

const addSentence =
    createAction<Pick<SentenceElement, 'id' | 'text'>>('TEXT/ADD_SENTENCE');
const removeSentence = createAction<SentenceId>('TEXT/REMOVE_SENTENCE');
const updateSentenceText = createAction<Pick<SentenceElement, 'id' | 'text'>>(
    'TEXT/UPDATE_SENTENCE',
);

const addWord =
    createAction<Pick<WordElement, 'id' | 'parent' | 'text'>>('TEXT/ADD_WORD');
const removeWord = createAction<WordId>('TEXT/REMOVE_WORD');
const updateWordText =
    createAction<Pick<WordElement, 'id' | 'text'>>('TEXT/UPDATE_WORD');

const addLetter = createAction<
    Pick<LetterElement, 'id' | 'parent' | 'text' | 'letter'> & {
        index?: number;
    }
>('TEXT/ADD_LETTER');
const removeLetter = createAction<LetterId>('TEXT/REMOVE_LETTER');
const updateLetterText =
    createAction<Pick<LetterElement, 'id' | 'text' | 'letter'>>(
        'TEXT/UPDATE_LETTER',
    );

const addStackedLetter = createAction<
    Pick<StackedLetterElement, 'id' | 'parent'>
>('TEXT/ADD_STACKED_LETTER');
const removeStackedLetter = createAction<StackedLetterId>(
    'TEXT/REMOVE_STACKED_LETTER',
);

const addAttachedLetter = createAction<
    Pick<AttachedLetterElement, 'id' | 'parent'>
>('TEXT/ADD_ATTACHED_LETTER');
const removeAttachedLetter = createAction<AttachedLetterId>(
    'TEXT/REMOVE_ATTACHED_LETTER',
);

const addDot = createAction<Pick<DotElement, 'id' | 'parent'>>('TEXT/ADD_DOT');
const removeDot = createAction<DotId>('TEXT/REMOVE_DOT');

const addLineSlot =
    createAction<Pick<LineSlotElement, 'id' | 'parent'>>('TEXT/ADD_LINE_SLOT');
const removeLineSlot = createAction<LineSlotId>('TEXT/REMOVE_LINE_SLOT');

const setSplitLetterOptions = createAction<SplitLettersOptions>(
    'TEXT/SET_SPLIT_LETTER_OPTIONS',
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
    addStackedLetter,
    removeStackedLetter,
    addAttachedLetter,
    removeAttachedLetter,
    addDot,
    removeDot,
    addLineSlot,
    removeLineSlot,
    setSplitLetterOptions,
};

export default textActions;
