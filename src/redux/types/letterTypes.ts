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
    ND = 'ND',
    NT = 'NT',
    QU = 'QU',
    NG = 'NG',
}

export enum LetterDecoration {
    None = 'None',
    SingleDot = 'SingleDot',
    DoubleDot = 'DoubleDot',
    TripleDot = 'TripleDot',
    QuadrupleDot = 'QuadrupleDot',
    SingleLine = 'SingleLine',
    DoubleLine = 'DoubleLine',
    TripleLine = 'TripleLine',
    LineInside = 'LineInside',
    LineOutside = 'LineOutside',
}

export type VocalDecoration =
    | LetterDecoration.None
    | LetterDecoration.LineInside
    | LetterDecoration.LineOutside;

export type ConsonantDecoration =
    | LetterDecoration.None
    | LetterDecoration.SingleDot
    | LetterDecoration.DoubleDot
    | LetterDecoration.TripleDot
    | LetterDecoration.QuadrupleDot
    | LetterDecoration.SingleLine
    | LetterDecoration.DoubleLine
    | LetterDecoration.TripleLine;

export enum LetterPlacement {
    DeepCut = 'DeepCut',
    Inside = 'Inside',
    ShallowCut = 'ShallowCut',
    OnLine = 'OnLine',
    Outside = 'Outside',
}

export type VocalPlacement =
    | LetterPlacement.Inside
    | LetterPlacement.OnLine
    | LetterPlacement.Outside;

export type ConsonantPlacement =
    | LetterPlacement.DeepCut
    | LetterPlacement.Inside
    | LetterPlacement.ShallowCut
    | LetterPlacement.OnLine;

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
