import type {
    ConsonantId,
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    TextElementId,
    VocalId,
    WordId,
} from '@/redux/text/ids';
import type { Consonant, Digraph, Vocal } from '@/redux/text/letterTypes';

export enum TextElementType {
    Sentence = 'Sentence',
    Word = 'Word',
    Consonant = 'Consonant',
    Vocal = 'Vocal',
    Dot = 'Dot',
    LineSlot = 'LineSlot',
}

export interface SentenceElement {
    elementType: TextElementType.Sentence;
    id: SentenceId;
    text: string;
    words: WordId[];
}

export interface WordElement {
    elementType: TextElementType.Word;
    id: WordId;
    parent: SentenceId;
    text: string;
    letters: LetterId[];
}

export interface ConsonantElement {
    elementType: TextElementType.Consonant;
    id: ConsonantId;
    parent: WordId;
    text: string;
    letter: Consonant | Digraph;
    dots: DotId[];
    lineSlots: LineSlotId[];
}

export interface VocalElement {
    elementType: TextElementType.Vocal;
    id: VocalId;
    parent: WordId;
    text: string;
    letter: Vocal;
    lineSlots: LineSlotId[];
}

export interface DotElement {
    elementType: TextElementType.Dot;
    id: DotId;
    parent: ConsonantId;
}

export interface LineSlotElement {
    elementType: TextElementType.LineSlot;
    id: LineSlotId;
    parent: LetterId; // TODO can also be word or sentence
}

export interface RawConsonantElement {
    text: string;
    letter: Consonant | Digraph;
}

export interface RawVocalElement {
    text: string;
    letter: Vocal;
}

export type RawLetterElement = RawConsonantElement | RawVocalElement;

// prettier-ignore
export type TextElementDictValue<K extends string> =
    K extends SentenceId ? SentenceElement :
    K extends WordId ? WordElement :
    K extends ConsonantId ? ConsonantElement :
    K extends VocalId ? VocalElement :
    K extends DotId ? DotElement :
    K extends LineSlotId ? LineSlotElement : never;

export type TextElementsDict = {
    [K in TextElementId]: TextElementDictValue<K>;
};
