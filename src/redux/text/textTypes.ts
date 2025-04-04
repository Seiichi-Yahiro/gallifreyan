import type {
    AttachedLetterId,
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    StackedLetterId,
    TextElementId,
    WordId,
} from '@/redux/text/ids';
import type { Letter } from '@/redux/text/letterTypes';

export enum TextElementType {
    Sentence = 'Sentence',
    Word = 'Word',
    StackedLetter = 'StackedLetter',
    AttachedLetter = 'AttachedLetter',
    Letter = 'Letter',
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
    letters: (LetterId | StackedLetterId | AttachedLetterId)[];
}

export interface StackedLetterElement {
    elementType: TextElementType.StackedLetter;
    id: StackedLetterId;
    parent: WordId | AttachedLetterId;
    // actual size should be at least 2
    letters: LetterId[];
}

export interface AttachedLetterElement {
    elementType: TextElementType.AttachedLetter;
    id: AttachedLetterId;
    parent: WordId;
    // actual size should be 2
    letters: (LetterId | StackedLetterId)[];
}

export interface LetterElement {
    elementType: TextElementType.Letter;
    id: LetterId;
    parent: WordId | StackedLetterId | AttachedLetterId;
    text: string;
    letter: Letter;
    dots: DotId[];
    lineSlots: LineSlotId[];
}

export interface DotElement {
    elementType: TextElementType.Dot;
    id: DotId;
    parent: LetterId;
}

export interface LineSlotElement {
    elementType: TextElementType.LineSlot;
    id: LineSlotId;
    parent: LetterId; // TODO can also be word or sentence
}

export interface RawLetter {
    elementType: TextElementType.Letter;
    text: string;
    letter: Letter;
}

export interface RawStackedLetter {
    elementType: TextElementType.StackedLetter;
    letters: RawLetter[];
}

export interface RawAttachedLetter {
    elementType: TextElementType.AttachedLetter;
    letters: [RawLetter | RawStackedLetter, RawLetter | RawStackedLetter];
}

export type RawLetterElement = RawLetter | RawStackedLetter | RawAttachedLetter;

// prettier-ignore
export type TextElementDictValue<K extends string> =
    K extends SentenceId ? SentenceElement :
    K extends WordId ? WordElement :
    K extends StackedLetterId ? StackedLetterElement :
    K extends AttachedLetterId ? AttachedLetterElement :
    K extends LetterId ? LetterElement :
    K extends DotId ? DotElement :
    K extends LineSlotId ? LineSlotElement : never;

export type TextElementsDict = {
    [K in TextElementId]: TextElementDictValue<K>;
};
