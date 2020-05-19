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
    lineSlots: UUID[];
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
}

export interface Word {
    text: string;
    circleId: UUID;
    letters: Letter[];
}

export interface Letter {
    text: string;
    circleId: UUID;
    dots: UUID[];
}

export interface AppStoreState {
    circles: { [key: string]: Circle };
    lineConnections: { [key: string]: LineConnection };
    lineSlots: { [key: string]: LineSlot };
    sentences: Sentence[];
    svgSize: number;
}

/*export interface DenormCircle extends Referencable {
    x: number;
    y: number;
    r: number;
    filled: boolean;
    lineSlots: LineSlot[];
}

export interface DenormSentence extends DenormCircle {
    text: string;
    words: DenormWord[];
}

export interface DenormWord extends DenormCircle {
    text: string;
    letters: DenormLetter[];
}

export interface DenormLetter extends DenormCircle {
    text: string;
    dots: DenormCircle[];
}*/
