import type {
    ConsonantId,
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    VocalId,
    WordId,
} from '@/redux/text/ids';
import type { Consonant, Digraph, Vocal } from '@/redux/text/letterTypes';
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

const addConsonant = createAction<{
    id: ConsonantId;
    parent: WordId;
    text: string;
    letter: Consonant | Digraph;
    index?: number;
}>('TEXT/ADD_CONSONANT');

const addVocal = createAction<{
    id: VocalId;
    parent: WordId;
    text: string;
    letter: Vocal;
    index?: number;
}>('TEXT/ADD_VOCAL');

const removeLetter = createAction<LetterId>('TEXT/REMOVE_LETTER');

const convertConsonantToVocal = createAction<{
    oldId: ConsonantId;
    text: string;
    letter: Vocal;
}>('TEXT/CONVERT_CONSONANT_TO_VOCAL');

const convertVocalToConsonant = createAction<{
    oldId: VocalId;
    text: string;
    letter: Consonant | Digraph;
}>('TEXT/CONVERT_VOCAL_TO_CONSONANT');

const updateConsonantText = createAction<{
    id: ConsonantId;
    text: string;
    letter: Consonant | Digraph;
}>('TEXT/UPDATE_CONSONANT');

const updateVocalText = createAction<{
    id: VocalId;
    text: string;
    letter: Vocal;
}>('TEXT/UPDATE_VOCAL');

const addDot = createAction<{ id: DotId; parent: ConsonantId }>('TEXT/ADD_DOT');
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
    addConsonant,
    addVocal,
    removeLetter,
    updateConsonantText,
    updateVocalText,
    convertConsonantToVocal,
    convertVocalToConsonant,
    addDot,
    removeDot,
    addLineSlot,
    removeLineSlot,
    setSplitLetterOptions,
};

export default textActions;
