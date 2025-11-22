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

export const vocalDecoration = (vocal: VocalValue): VocalDecoration =>
    match(vocal)
        .with(VocalValue.I, () => VocalDecoration.LineInside)
        .with(VocalValue.U, () => VocalDecoration.LineOutside)
        .with(
            VocalValue.A,
            VocalValue.E,
            VocalValue.O,
            () => VocalDecoration.None,
        )
        .exhaustive();

export const consonantDecoration = (
    consonant: ConsonantValue | DigraphValue,
): ConsonantDecoration =>
    match(consonant)
        .with(
            ConsonantValue.B,
            ConsonantValue.J,
            ConsonantValue.T,
            DigraphValue.TH,
            () => ConsonantDecoration.None,
        )
        .with(
            DigraphValue.PH,
            DigraphValue.WH,
            DigraphValue.GH,
            () => ConsonantDecoration.SingleDot,
        )
        .with(
            ConsonantValue.K,
            ConsonantValue.Y,
            DigraphValue.CH,
            DigraphValue.SH,
            () => ConsonantDecoration.DoubleDot,
        )
        .with(
            ConsonantValue.D,
            ConsonantValue.L,
            ConsonantValue.R,
            ConsonantValue.Z,
            () => ConsonantDecoration.TripleDot,
        )
        .with(
            DigraphValue.ND,
            ConsonantValue.C,
            DigraphValue.NT,
            ConsonantValue.Q,
            () => ConsonantDecoration.QuadrupleDot,
        )
        .with(
            ConsonantValue.G,
            ConsonantValue.N,
            ConsonantValue.V,
            DigraphValue.QU,
            () => ConsonantDecoration.SingleLine,
        )
        .with(
            ConsonantValue.H,
            ConsonantValue.P,
            ConsonantValue.W,
            ConsonantValue.X,
            () => ConsonantDecoration.DoubleLine,
        )
        .with(
            ConsonantValue.F,
            ConsonantValue.M,
            ConsonantValue.S,
            DigraphValue.NG,
            () => ConsonantDecoration.TripleLine,
        )
        .exhaustive();

export const vocalPlacement = (vocal: VocalValue): VocalPlacement =>
    match(vocal)
        .with(VocalValue.A, () => VocalPlacement.Outside)
        .with(VocalValue.O, () => VocalPlacement.Inside)
        .with(
            VocalValue.E,
            VocalValue.I,
            VocalValue.U,
            () => VocalPlacement.OnLine,
        )
        .exhaustive();

export const consonantPlacement = (
    consonant: ConsonantValue | DigraphValue,
): ConsonantPlacement =>
    match(consonant)
        .with(
            ConsonantValue.B,
            DigraphValue.CH,
            ConsonantValue.D,
            DigraphValue.ND,
            ConsonantValue.G,
            ConsonantValue.H,
            ConsonantValue.F,
            () => ConsonantPlacement.DeepCut,
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
            () => ConsonantPlacement.Inside,
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
            () => ConsonantPlacement.ShallowCut,
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
            () => ConsonantPlacement.OnLine,
        )
        .exhaustive();

export const dotAmount = (
    decoration: VocalDecoration | ConsonantDecoration,
): number =>
    match(decoration)
        .with(ConsonantDecoration.SingleDot, () => 1)
        .with(ConsonantDecoration.DoubleDot, () => 2)
        .with(ConsonantDecoration.TripleDot, () => 3)
        .with(ConsonantDecoration.QuadrupleDot, () => 4)
        .otherwise(() => 0);

export const lineSlotAmount = (
    decoration: VocalDecoration | ConsonantDecoration,
): number =>
    match(decoration)
        .with(
            VocalDecoration.LineOutside,
            VocalDecoration.LineInside,
            ConsonantDecoration.SingleLine,
            () => 1,
        )
        .with(ConsonantDecoration.DoubleLine, () => 2)
        .with(ConsonantDecoration.TripleLine, () => 3)
        .otherwise(() => 0);
