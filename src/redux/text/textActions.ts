import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/text/ids';
import type { Letter } from '@/redux/text/letterTypes';
import type { SplitLettersOptions } from '@/redux/text/textUtils';
import { createAction } from '@reduxjs/toolkit';

const setText = createAction<string>('TEXT/SET_TEXT');

const addSentence = createAction<{ id: SentenceId; text: string }>(
    'TEXT/ADD_SENTENCE',
);
const removeSentence = createAction<SentenceId>('TEXT/REMOVE_SENTENCE');
const updateSentenceText = createAction<{ id: SentenceId; text: string }>(
    'TEXT/UPDATE_SENTENCE',
);

const addWord = createAction<{ id: WordId; parent: SentenceId; text: string }>(
    'TEXT/ADD_WORD',
);
const removeWord = createAction<WordId>('TEXT/REMOVE_WORD');
const updateWordText = createAction<{ id: WordId; text: string }>(
    'TEXT/UPDATE_WORD',
);

const addLetter = createAction<{
    id: LetterId;
    parent: WordId;
    text: string;
    letter: Letter;
    index?: number;
}>('TEXT/ADD_LETTER');
const removeLetter = createAction<LetterId>('TEXT/REMOVE_LETTER');
const updateLetterText = createAction<{
    id: LetterId;
    text: string;
    letter: Letter;
}>('TEXT/UPDATE_LETTER');

const addDot = createAction<{ id: DotId; parent: LetterId }>('TEXT/ADD_DOT');
const removeDot = createAction<DotId>('TEXT/REMOVE_DOT');

const addLineSlot = createAction<{ id: LineSlotId; parent: LetterId }>(
    'TEXT/ADD_LINE_SLOT',
);
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
    addDot,
    removeDot,
    addLineSlot,
    removeLineSlot,
    setSplitLetterOptions,
};

export default textActions;
