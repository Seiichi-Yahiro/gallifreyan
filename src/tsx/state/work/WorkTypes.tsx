import { Vector2 } from '../../utils/LinearAlgebra';
import { ImageType, Referencable } from '../image/ImageTypes';

export type Selection = CircleShapeSelection | LineSlotSelection;

export type CircleShapeSelection = SentenceSelection | WordSelection | LetterSelection | DotSelection;

export interface Draggable {
    isDragging: boolean;
}

export interface Context<T = undefined> {
    context: T;
}

export interface SentenceSelection extends Referencable, Draggable, Context {
    type: ImageType.Sentence;
}

export type WordContext = Context<{
    angleConstraints: AngleConstraints;
}>;

export interface WordSelection extends Referencable, Draggable, WordContext {
    type: ImageType.Word;
}

export type LetterSelection = ConsonantSelection | VocalSelection;

export type ConsonantContext = Context<{
    angleConstraints: AngleConstraints;
}>;

export interface ConsonantSelection extends Referencable, Draggable, ConsonantContext {
    type: ImageType.Consonant;
}

export interface VocalSelection extends Referencable, Draggable, Context {
    type: ImageType.Vocal;
}

export interface DotSelection extends Referencable, Draggable, Context {
    type: ImageType.Dot;
}

export interface LineSlotSelection extends Referencable, Draggable, Context {
    type: ImageType.LineSlot;
}

export interface AngleConstraints {
    minAngle: number;
    minAngleVector: Vector2;
    maxAngle: number;
    maxAngleVector: Vector2;
}
