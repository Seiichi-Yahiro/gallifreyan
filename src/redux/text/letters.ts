import { match } from 'ts-pattern';

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

export const vocalDecoration = (vocal: VocalValue): VocalDecoration =>
    match(vocal)
        .returnType<VocalDecoration>()
        .with(VocalValue.I, () => LetterDecoration.LineInside)
        .with(VocalValue.U, () => LetterDecoration.LineOutside)
        .with(
            VocalValue.A,
            VocalValue.E,
            VocalValue.O,
            () => LetterDecoration.None,
        )
        .exhaustive();

export const consonantDecoration = (
    consonant: ConsonantValue | DigraphValue,
): ConsonantDecoration =>
    match(consonant)
        .returnType<ConsonantDecoration>()
        .with(
            ConsonantValue.B,
            ConsonantValue.J,
            ConsonantValue.T,
            DigraphValue.TH,
            () => LetterDecoration.None,
        )
        .with(
            DigraphValue.PH,
            DigraphValue.WH,
            DigraphValue.GH,
            () => LetterDecoration.SingleDot,
        )
        .with(
            ConsonantValue.K,
            ConsonantValue.Y,
            DigraphValue.CH,
            DigraphValue.SH,
            () => LetterDecoration.DoubleDot,
        )
        .with(
            ConsonantValue.D,
            ConsonantValue.L,
            ConsonantValue.R,
            ConsonantValue.Z,
            () => LetterDecoration.TripleDot,
        )
        .with(
            DigraphValue.ND,
            ConsonantValue.C,
            DigraphValue.NT,
            ConsonantValue.Q,
            () => LetterDecoration.QuadrupleDot,
        )
        .with(
            ConsonantValue.G,
            ConsonantValue.N,
            ConsonantValue.V,
            DigraphValue.QU,
            () => LetterDecoration.SingleLine,
        )
        .with(
            ConsonantValue.H,
            ConsonantValue.P,
            ConsonantValue.W,
            ConsonantValue.X,
            () => LetterDecoration.DoubleLine,
        )
        .with(
            ConsonantValue.F,
            ConsonantValue.M,
            ConsonantValue.S,
            DigraphValue.NG,
            () => LetterDecoration.TripleLine,
        )
        .exhaustive();

export const vocalPlacement = (vocal: VocalValue): VocalPlacement =>
    match(vocal)
        .returnType<VocalPlacement>()
        .with(VocalValue.A, () => LetterPlacement.Outside)
        .with(VocalValue.O, () => LetterPlacement.Inside)
        .with(
            VocalValue.E,
            VocalValue.I,
            VocalValue.U,
            () => LetterPlacement.OnLine,
        )
        .exhaustive();

export const consonantPlacement = (
    consonant: ConsonantValue | DigraphValue,
): ConsonantPlacement =>
    match(consonant)
        .returnType<ConsonantPlacement>()
        .with(
            ConsonantValue.B,
            DigraphValue.CH,
            ConsonantValue.D,
            DigraphValue.ND,
            ConsonantValue.G,
            ConsonantValue.H,
            ConsonantValue.F,
            () => LetterPlacement.DeepCut,
        )
        .with(
            ConsonantValue.J,
            DigraphValue.PH,
            ConsonantValue.K,
            ConsonantValue.L,
            ConsonantValue.C,
            ConsonantValue.N,
            ConsonantValue.P,
            ConsonantValue.M,
            () => LetterPlacement.Inside,
        )
        .with(
            ConsonantValue.T,
            DigraphValue.WH,
            DigraphValue.SH,
            ConsonantValue.R,
            DigraphValue.NT,
            ConsonantValue.V,
            ConsonantValue.W,
            ConsonantValue.S,
            () => LetterPlacement.ShallowCut,
        )
        .with(
            DigraphValue.TH,
            DigraphValue.GH,
            ConsonantValue.Y,
            ConsonantValue.Z,
            ConsonantValue.Q,
            DigraphValue.QU,
            ConsonantValue.X,
            DigraphValue.NG,
            () => LetterPlacement.OnLine,
        )
        .exhaustive();

export const dotAmount = (decoration: LetterDecoration): number =>
    match(decoration)
        .with(LetterDecoration.SingleDot, () => 1)
        .with(LetterDecoration.DoubleDot, () => 2)
        .with(LetterDecoration.TripleDot, () => 3)
        .with(LetterDecoration.QuadrupleDot, () => 4)
        .otherwise(() => 0);

export const lineSlotAmount = (decoration: LetterDecoration): number =>
    match(decoration)
        .with(
            LetterDecoration.LineOutside,
            LetterDecoration.LineInside,
            LetterDecoration.SingleLine,
            () => 1,
        )
        .with(LetterDecoration.DoubleLine, () => 2)
        .with(LetterDecoration.TripleLine, () => 3)
        .otherwise(() => 0);
