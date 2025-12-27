import {
    type ConsonantDecoration,
    type ConsonantPlacement,
    ConsonantValue,
    DigraphValue,
    LetterDecoration,
    LetterPlacement,
    VocalDecoration,
    type VocalPlacement,
    VocalValue,
} from '@/redux/text/letter.types';
import { match } from 'ts-pattern';

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
