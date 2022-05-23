export type UUID = string;

export interface Referencable {
    readonly id: UUID;
}

export interface Parented {
    parentId: UUID;
}

export interface PositionData {
    angle: number;
    distance: number;
}

export interface Circle extends PositionData {
    r: number;
}

export interface LineConnection extends Referencable {
    type: LineType.LineConnection;
    a: UUID;
    b: UUID;
}

export interface LineSlot extends Referencable, Parented, PositionData {
    type: LineType.LineSlot;
    connection?: LineConnection;
}

export enum LineType {
    LineSlot = 'LineSlot',
    LineConnection = 'LineConnection',
}

export type CircleShape = Sentence | Word | Letter | Dot;

export interface Sentence extends Referencable {
    type: CircleType.Sentence;
    text: string;
    circle: Circle;
    words: UUID[];
    lineSlots: UUID[];
}

export interface Word extends Referencable, Parented {
    type: CircleType.Word;
    text: string;
    circle: Circle;
    letters: UUID[];
    lineSlots: UUID[];
}

export type Letter = Vocal | Consonant;

export interface Vocal extends Referencable, Parented {
    type: CircleType.Vocal;
    text: string;
    circle: Circle;
    lineSlots: UUID[];
    placement: VocalPlacement;
    decoration: VocalDecoration;
}

export interface Consonant extends Referencable, Parented {
    type: CircleType.Consonant;
    text: string;
    circle: Circle;
    lineSlots: UUID[];
    dots: UUID[];
    vocal?: UUID;
    placement: ConsonantPlacement;
    decoration: ConsonantDecoration;
}

export interface Dot extends Referencable, Parented {
    type: CircleType.Dot;
    circle: Circle;
}

export enum CircleType {
    Sentence = 'Sentence',
    Word = 'Word',
    Consonant = 'Consonant',
    Vocal = 'Vocal',
    Dot = 'Dot',
}

export enum ConsonantPlacement {
    DeepCut = 'DeepCut',
    Inside = 'Inside',
    ShallowCut = 'ShallowCut',
    OnLine = 'OnLine',
}

export enum ConsonantDecoration {
    None = 'None',
    SingleDot = 'SingleDot',
    DoubleDot = 'DoubleDot',
    TripleDot = 'TripleDot',
    QuadrupleDot = 'QuadrupleDot',
    SingleLine = 'SingleLine',
    DoubleLine = 'DoubleLine',
    TripleLine = 'TripleLine',
}

export enum VocalPlacement {
    OnLine = 'OnLine',
    Outside = 'Outside',
    Inside = 'Inside',
}

export enum VocalDecoration {
    None = 'None',
    LineInside = 'LineInside',
    LineOutside = 'LineOutside',
}
