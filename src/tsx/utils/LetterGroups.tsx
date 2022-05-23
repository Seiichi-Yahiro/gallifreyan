import { ConsonantDecoration, ConsonantPlacement, VocalPlacement, VocalDecoration } from '../state/image/ImageTypes';
import Maybe from './Maybe';

type RegexTest = (text: string) => boolean;

const assignT = <T,>(tests: [RegexTest, T][], letter: string): Maybe<T> =>
    Maybe.of(tests.find(([test, _]) => test(letter))).map(([_, value]) => value);

export const assignConsonantPlacement = (letter: string): Maybe<ConsonantPlacement> =>
    assignT(
        [
            [isDeepCut, ConsonantPlacement.DeepCut],
            [isInside, ConsonantPlacement.Inside],
            [isShallowCut, ConsonantPlacement.ShallowCut],
            [isOnLine, ConsonantPlacement.OnLine],
        ],
        letter
    );

export const assignConsonantDecoration = (letter: string): Maybe<ConsonantDecoration> =>
    assignT(
        [
            [isNoDecoration, ConsonantDecoration.None],
            [isSingleDot, ConsonantDecoration.SingleDot],
            [isDoubleDot, ConsonantDecoration.DoubleDot],
            [isTripleDot, ConsonantDecoration.TripleDot],
            [isQuadrupleDot, ConsonantDecoration.QuadrupleDot],
            [isSingleLine, ConsonantDecoration.SingleLine],
            [isDoubleLine, ConsonantDecoration.DoubleLine],
            [isTripleLine, ConsonantDecoration.TripleLine],
        ],
        letter
    );

export const assignVocalPlacement = (letter: string): Maybe<VocalPlacement> =>
    assignT(
        [
            [isVocalOnLine, VocalPlacement.OnLine],
            [isVocalOutside, VocalPlacement.Outside],
            [isVocalInside, VocalPlacement.Inside],
        ],
        letter
    );

export const assignVocalDecoration = (letter: string): Maybe<VocalDecoration> =>
    assignT(
        [
            [isVocalNoDecoration, VocalDecoration.None],
            [isVocalLineInside, VocalDecoration.LineInside],
            [isVocalLineOutside, VocalDecoration.LineOutside],
        ],
        letter
    );

const CONSONANT_DEEP_CUT = new RegExp('^(?:b|ch|d|g|h|f)$', 'i');
const CONSONANT_INSIDE = new RegExp('^(?:j|ph|k|l|c|n|p|m)$', 'i');
const CONSONANT_SHALLOW_CUT = new RegExp('^(?:t|wh|sh|r|v|w|s)$', 'i');
const CONSONANT_ON_LINE = new RegExp('^(?:th|gh|y|z|qu?|x|ng)$', 'i');

const CONSONANT_NO_DECORATION = new RegExp('^(?:b|j|th?)$', 'i');
const SINGLE_DOT = new RegExp('^(?:ph|wh|gh)$', 'i');
const CONSONANT_DOUBLE_DOT = new RegExp('^(?:ch|k|sh|y)$', 'i');
const CONSONANT_TRIPLE_DOT = new RegExp('^[dlrz]$', 'i');
const QUADRUPLE_DOT = new RegExp('^[cq]$', 'i');

const CONSONANT_SINGLE_LINE = new RegExp('^(?:g|n|v|qu)$', 'i');
const CONSONANT_DOUBLE_LINE = new RegExp('^[hpwx]$', 'i');
const CONSONANT_TRIPLE_LINE = new RegExp('^(?:f|m|s|ng)$', 'i');

const VOCAL = new RegExp('^[aeiou]$', 'i');
const VOCAL_ON_LINE = new RegExp('^[eiu]$', 'i');
const VOCAL_OUTSIDE = new RegExp('^a$', 'i');
const VOCAL_INSIDE = new RegExp('^o$', 'i');
const VOCAL_NO_DECORATION = new RegExp('^[aeo]$', 'i');
const VOCAL_LINE_INSIDE = new RegExp('^i$', 'i');
const VOCAL_LINE_OUTSIDE = new RegExp('^u$', 'i');

export const DOUBLE_LETTER = new RegExp('th|ph|wh|gh|ch|sh|qu|ng', 'i');

const isDeepCut = (text: string) => CONSONANT_DEEP_CUT.test(text);
const isInside = (text: string) => CONSONANT_INSIDE.test(text);
const isShallowCut = (text: string) => CONSONANT_SHALLOW_CUT.test(text);
const isOnLine = (text: string) => CONSONANT_ON_LINE.test(text);

const isNoDecoration = (text: string) => CONSONANT_NO_DECORATION.test(text);
const isSingleDot = (text: string) => SINGLE_DOT.test(text);
const isDoubleDot = (text: string) => CONSONANT_DOUBLE_DOT.test(text);
const isTripleDot = (text: string) => CONSONANT_TRIPLE_DOT.test(text);
const isQuadrupleDot = (text: string) => QUADRUPLE_DOT.test(text);

const isSingleLine = (text: string) => CONSONANT_SINGLE_LINE.test(text);
const isDoubleLine = (text: string) => CONSONANT_DOUBLE_LINE.test(text);
const isTripleLine = (text: string) => CONSONANT_TRIPLE_LINE.test(text);

export const isVocal = (text: string) => VOCAL.test(text);
const isVocalOnLine = (text: string) => VOCAL_ON_LINE.test(text);
const isVocalOutside = (text: string) => VOCAL_OUTSIDE.test(text);
const isVocalInside = (text: string) => VOCAL_INSIDE.test(text);
const isVocalNoDecoration = (text: string) => VOCAL_NO_DECORATION.test(text);
const isVocalLineInside = (text: string) => VOCAL_LINE_INSIDE.test(text);
const isVocalLineOutside = (text: string) => VOCAL_LINE_OUTSIDE.test(text);

const isDoubleLetter = (text: string) => DOUBLE_LETTER.test(text);

const letterGroupsCombination =
    (...fns: Array<RegexTest>) =>
    (text: string) =>
        fns.some((fn) => fn(text));

export const isValidLetter = letterGroupsCombination(
    isDeepCut,
    isShallowCut,
    isInside,
    isOnLine,
    isVocal,
    isDoubleLetter
);
