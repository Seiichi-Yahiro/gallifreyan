import type {
    AttachedVocalGroupId,
    ConsonantId,
    DotId,
    LetterGroupId,
    LetterId,
    LineSlotId,
    SentenceId,
    StackedConsonantGroupId,
    StackedVocalGroupId,
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
    StackedConsonantGroup = 'StackedConsonantGroup',
    StackedVocalGroup = 'StackedVocalGroup',
    AttachedVocalGroup = 'AttachedVocalGroup',
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
    letters: (LetterId | LetterGroupId)[];
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

export interface StackedConsonantGroupElement {
    elementType: TextElementType.StackedConsonantGroup;
    id: StackedConsonantGroupId;
    parent: WordId | AttachedVocalGroupId;
    letters: ConsonantId[];
}

export interface StackedVocalGroupElement {
    elementType: TextElementType.StackedVocalGroup;
    id: StackedVocalGroupId;
    parent: WordId | AttachedVocalGroupId;
    letters: VocalId[];
}

export interface AttachedVocalGroupElement {
    elementType: TextElementType.AttachedVocalGroup;
    id: AttachedVocalGroupId;
    parent: WordId;
    letters: [
        ConsonantId | StackedConsonantGroupId,
        VocalId | StackedVocalGroupId,
    ];
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
    elementType: TextElementType.Consonant;
    text: string;
    letter: Consonant | Digraph;
}

export interface RawVocalElement {
    elementType: TextElementType.Vocal;
    text: string;
    letter: Vocal;
}

export interface RawStackedVocalElement {
    elementType: TextElementType.StackedVocalGroup;
    letters: RawVocalElement[];
}

export interface RawStackedConsonantElement {
    elementType: TextElementType.StackedConsonantGroup;
    letters: RawConsonantElement[];
}

export interface RawAttachedVocalGroupElement {
    elementType: TextElementType.AttachedVocalGroup;
    letters: [
        RawConsonantElement | RawStackedConsonantElement,
        RawVocalElement | RawStackedVocalElement,
    ];
}

export type RawLetterElement =
    | RawConsonantElement
    | RawVocalElement
    | RawStackedVocalElement
    | RawStackedConsonantElement
    | RawAttachedVocalGroupElement;

// prettier-ignore
export type TextElementDictValue<K extends string> =
    K extends SentenceId ? SentenceElement :
    K extends WordId ? WordElement :
    K extends ConsonantId ? ConsonantElement :
    K extends VocalId ? VocalElement :
    K extends StackedConsonantGroupId ? StackedConsonantGroupElement :
    K extends StackedVocalGroupId ? StackedVocalGroupElement :
    K extends AttachedVocalGroupId ? AttachedVocalGroupElement :
    K extends DotId ? DotElement :
    K extends LineSlotId ? LineSlotElement : never;

export type TextElementsDict = {
    [K in TextElementId]: TextElementDictValue<K>;
};
