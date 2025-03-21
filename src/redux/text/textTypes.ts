import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    TextElementId,
    WordId,
} from '@/redux/text/ids';
import type { Letter } from '@/redux/text/letterTypes';

export enum TextElementType {
    Sentence = 'Sentence',
    Word = 'Word',
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
    letters: LetterId[];
}

export interface LetterElement {
    elementType: TextElementType.Letter;
    id: LetterId;
    parent: WordId;
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

export interface RawLetterElement {
    text: string;
    letter: Letter;
}

export type TextElement =
    | SentenceElement
    | WordElement
    | DotElement
    | LineSlotElement;

// prettier-ignore
export type TextElementDictValue<K extends string> =
    K extends SentenceId ? SentenceElement :
    K extends WordId ? WordElement :
    K extends LetterId ? LetterElement :
    K extends DotId ? DotElement :
    K extends LineSlotId ? LineSlotElement : never;

export type TextElementsDict = {
    [K in TextElementId]: TextElementDictValue<K>;
};
