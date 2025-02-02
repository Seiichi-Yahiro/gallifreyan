export enum LetterType {
    Vocal = 'Vocal',
    Consonant = 'Consonant',
    Digraph = 'Digraph',
}

export enum VocalValue {
    A = 'A',
    E = 'E',
    I = 'I',
    O = 'O',
    U = 'U',
}

export enum ConsonantValue {
    B = 'B',
    J = 'J',
    T = 'T',
    K = 'K',
    Y = 'Y',
    D = 'D',
    L = 'L',
    R = 'R',
    Z = 'Z',
    C = 'C',
    Q = 'Q',
    G = 'G',
    N = 'N',
    V = 'V',
    H = 'H',
    P = 'P',
    W = 'W',
    X = 'X',
    F = 'F',
    M = 'M',
    S = 'S',
}

export enum DigraphValue {
    TH = 'TH',
    PH = 'PH',
    WH = 'WH',
    GH = 'GH',
    CH = 'CH',
    SH = 'SH',
    QU = 'QU',
    NG = 'NG',
}

export enum VocalDecoration {
    None = 'None',
    LineInside = 'LineInside',
    LineOutside = 'LineOutside',
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
    Inside = 'Inside',
    OnLine = 'OnLine',
    Outside = 'Outside',
}

export enum ConsonantPlacement {
    DeepCut = 'DeepCut',
    Inside = 'Inside',
    ShallowCut = 'ShallowCut',
    OnLine = 'OnLine',
}

export interface Vocal {
    letterType: LetterType.Vocal;
    value: VocalValue;
    decoration: VocalDecoration;
    placement: VocalPlacement;
}

export interface Consonant {
    letterType: LetterType.Consonant;
    value: ConsonantValue;
    decoration: ConsonantDecoration;
    placement: ConsonantPlacement;
}

export interface Digraph {
    letterType: LetterType.Digraph;
    value: DigraphValue;
    decoration: ConsonantDecoration;
    placement: ConsonantPlacement;
}

export type Letter = Vocal | Consonant | Digraph;
