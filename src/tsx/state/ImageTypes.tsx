export type UUID = string;

export interface Referencable {
    readonly id: UUID;
}

export interface PositionData {
    angle: number;
    distance: number;
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
    connection?: LineConnection;
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

export type Letter = Vocal | Consonant;

export interface Vocal {
    text: string;
    circleId: UUID;
    lineSlots: UUID[];
    placement: VocalPlacement;
    decoration: VocalDecoration;
}

export interface Consonant {
    text: string;
    circleId: UUID;
    lineSlots: UUID[];
    dots: UUID[];
    vocal?: Vocal;
    placement: ConsonantPlacement;
    decoration: ConsonantDecoration;
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

export interface CircleData extends PositionData {
    r: number;
}

export interface LineSlotData extends PositionData {}
