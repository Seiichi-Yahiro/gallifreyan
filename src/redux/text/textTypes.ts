import type {
    AttachedVocalGroupId,
    ConsonantId,
    DotId,
    DoubleConsonantGroupId,
    DoubleVocalGroupId,
    LetterGroupId,
    LetterId,
    LineSlotId,
    SentenceId,
    StackedConsonantGroupId,
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
    DoubleConsonantGroup = 'DoubleConsonantGroup',
    DoubleVocalGroup = 'DoubleVocalGroup',
    StackedConsonantGroup = 'StackedConsonantGroup',
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

export interface DoubleConsonantGroupElement {
    elementType: TextElementType.DoubleConsonantGroup;
    id: DoubleConsonantGroupId;
    parent: WordId | StackedConsonantGroupId | AttachedVocalGroupId;
    letters: [ConsonantId, ConsonantId];
}

export interface DoubleVocalGroupElement {
    elementType: TextElementType.DoubleVocalGroup;
    id: DoubleVocalGroupId;
    parent: WordId | AttachedVocalGroupId;
    letters: [VocalId, VocalId];
}

export interface StackedConsonantGroupElement {
    elementType: TextElementType.StackedConsonantGroup;
    id: StackedConsonantGroupId;
    parent: WordId | AttachedVocalGroupId;
    letters: (ConsonantId | DoubleConsonantGroupId)[];
}

export interface AttachedVocalGroupElement {
    elementType: TextElementType.AttachedVocalGroup;
    id: AttachedVocalGroupId;
    parent: WordId;
    letters: [
        ConsonantId | DoubleConsonantGroupId | StackedConsonantGroupId,
        VocalId | DoubleVocalGroupId,
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

export interface RawDoubleConsonantElement {
    elementType: TextElementType.DoubleConsonantGroup;
    letters: [RawConsonantElement, RawConsonantElement];
}

export interface RawDoubleVocalElement {
    elementType: TextElementType.DoubleVocalGroup;
    letters: [RawVocalElement, RawVocalElement];
}

export interface RawStackedConsonantElement {
    elementType: TextElementType.StackedConsonantGroup;
    letters: (RawConsonantElement | RawDoubleConsonantElement)[];
}

export interface RawAttachedVocalGroupElement {
    elementType: TextElementType.AttachedVocalGroup;
    letters: [
        (
            | RawLetterElement
            | RawDoubleConsonantElement
            | RawStackedConsonantElement
        ),
        RawVocalElement | RawDoubleVocalElement,
    ];
}

export type RawLetterElement =
    | RawConsonantElement
    | RawVocalElement
    | RawDoubleConsonantElement
    | RawDoubleVocalElement
    | RawStackedConsonantElement
    | RawAttachedVocalGroupElement;

// prettier-ignore
export type TextElementDictValue<K extends string> =
    K extends SentenceId ? SentenceElement :
    K extends WordId ? WordElement :
    K extends ConsonantId ? ConsonantElement :
    K extends VocalId ? VocalElement :
    K extends DoubleConsonantGroupId ? DoubleConsonantGroupElement :
    K extends DoubleVocalGroupId ? DoubleVocalGroupElement :
    K extends StackedConsonantGroupId ? StackedConsonantGroupElement :
    K extends AttachedVocalGroupId ? AttachedVocalGroupElement :
    K extends DotId ? DotElement :
    K extends LineSlotId ? LineSlotElement : never;

export type TextElementsDict = {
    [K in TextElementId]: TextElementDictValue<K>;
};
