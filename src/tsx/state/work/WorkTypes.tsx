import { ImageType, Referencable } from '../image/ImageTypes';

export type Selection = CircleShapeSelection | LineSlotSelection;

export type CircleShapeSelection = SentenceSelection | WordSelection | LetterSelection | DotSelection;

export interface SentenceSelection extends Referencable {
    type: ImageType.Sentence;
}

export interface WordSelection extends Referencable {
    type: ImageType.Word;
    minAngle: number;
    maxAngle: number;
}

export type LetterSelection = ConsonantSelection | VocalSelection;

export interface ConsonantSelection extends Referencable {
    type: ImageType.Consonant;
}

export interface VocalSelection extends Referencable {
    type: ImageType.Vocal;
}

export interface DotSelection extends Referencable {
    type: ImageType.Dot;
}

export interface LineSlotSelection extends Referencable {
    type: ImageType.LineSlot;
}
