import Maybe from '../utils/Maybe';

export type UUID = string;

export interface Referencable {
    readonly id: UUID;
}

export interface PositionData {
    angle: number;
    parentDistance: number;
}

export interface Circle extends Referencable, PositionData {
    r: number;
    filled: boolean;
}

export interface LineConnection extends Referencable {
    a: UUID;
    b: UUID;
}

export interface LineSlot extends Referencable, PositionData {
    connection: Maybe<LineConnection>;
}

export interface Sentence {
    text: string;
    circleId: UUID;
    words: Word[];
    lineSlots: UUID[];
}

export interface Word {
    text: string;
    circleId: UUID;
    letters: Letter[];
    lineSlots: UUID[];
}

export interface Letter {
    text: string;
    circleId: UUID;
    lineSlots: UUID[];
}

export interface Vocal extends Letter {}

export interface Consonant extends Letter {
    dots: UUID[];
    vocal: Maybe<Vocal>;
}

export interface CircleData extends Referencable {
    r?: number;
    angle?: number;
    parentDistance?: number;
}

export interface LineSlotData extends Referencable {
    angle?: number;
    parentDistance?: number;
}