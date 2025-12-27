import mAngle from '@/math/angle';
import type { PolarCoordinate } from '@/math/polar';
import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/ids';
import type { AppThunkAction } from '@/redux/store';
import { svgActions } from '@/redux/svg/svg.slice';
import {
    LetterDecoration,
    LetterPlacement,
    LetterType,
} from '@/redux/text/letter.types';
import { match } from 'ts-pattern';

const sentence =
    (id: SentenceId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const svgSize = state.svg.size;
        const words = state.text.elements[id].words;

        const radius = (svgSize * 0.9) / 2;

        const position: PolarCoordinate = {
            distance: 0,
            angle: mAngle.radian(0),
        };

        dispatch(svgActions.setCircle({ id, radius, position }));

        words.map(resetThunks.word).forEach(dispatch);
    };

const word =
    (id: WordId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const word = state.text.elements[id];

        const sentence = state.text.elements[word.parent];
        const sentenceRadius = state.svg.circles[word.parent].radius;

        const wordCount = sentence.words.length;
        const index = sentence.words.indexOf(id);

        const radius = (sentenceRadius * 0.75) / (1 + wordCount / 2.0);

        const position: PolarCoordinate = {
            distance: wordCount > 1 ? sentenceRadius - radius * 1.5 : 0,
            angle: mAngle.toRadian(mAngle.degree(index * (360 / wordCount))),
        };

        dispatch(svgActions.setCircle({ id, radius, position }));

        word.letters.map(resetThunks.letter).forEach(dispatch);
    };

const letter =
    (id: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letter = state.text.elements[id];
        const { placement, letterType } = letter.letter;

        const word = state.text.elements[letter.parent];
        const wordRadius = state.svg.circles[letter.parent].radius;

        const letterCount = word.letters.length;
        const index = word.letters.indexOf(id);

        let radius: number;
        let position: PolarCoordinate;

        if (letterType === LetterType.Vocal) {
            radius = (wordRadius * 0.75 * 0.4) / (1 + letterCount / 2);

            const distance = match(placement)
                .with(LetterPlacement.OnLine, () => wordRadius)
                .with(LetterPlacement.Outside, () => wordRadius + radius * 1.5)
                .with(LetterPlacement.Inside, () =>
                    letterCount > 1 ? wordRadius - radius * 1.5 : 0,
                )
                .exhaustive();

            const angle = index * (360 / letterCount);

            position = {
                distance,
                angle: mAngle.toRadian(mAngle.degree(angle)),
            };
        } else {
            radius = (wordRadius * 0.75) / (1 + letterCount / 2);

            const distance = match(placement)
                .with(LetterPlacement.DeepCut, () => wordRadius - radius * 0.75)
                .with(LetterPlacement.Inside, () =>
                    letterCount > 1 ? wordRadius - radius * 1.5 : 0,
                )
                .with(
                    LetterPlacement.ShallowCut,
                    LetterPlacement.OnLine,
                    () => wordRadius,
                )
                .exhaustive();

            const angle = index * (360 / letterCount);

            position = {
                distance,
                angle: mAngle.toRadian(mAngle.degree(angle)),
            };
        }

        dispatch(svgActions.setCircle({ id, radius, position }));

        letter.dots.map(resetThunks.dot).forEach(dispatch);
        letter.lineSlots.map(resetThunks.lineSlot).forEach(dispatch);
    };

const dot =
    (id: DotId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const dot = state.text.elements[id];

        const letter = state.text.elements[dot.parent];
        const letterRadius = state.svg.circles[dot.parent].radius;

        const dotCount = letter.dots.length;
        const index = letter.dots.indexOf(id);

        const radius = letterRadius * 0.1;

        const letterSideAngle = 180;
        const dotDistanceAngle = 45;

        const centerDotsOnLetterSideAngle =
            ((dotCount - 1) * dotDistanceAngle) / 2;

        const distance = letterRadius - radius * 2;

        const angle =
            index * dotDistanceAngle -
            centerDotsOnLetterSideAngle +
            letterSideAngle;

        const position: PolarCoordinate = {
            distance,
            angle: mAngle.toRadian(mAngle.degree(angle)),
        };

        dispatch(svgActions.setCircle({ id, radius, position }));
    };

const lineSlot =
    (id: LineSlotId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const lineSlot = state.text.elements[id];

        const letter = state.text.elements[lineSlot.parent];
        const letterRadius = state.svg.circles[lineSlot.parent].radius;

        const lineCount = letter.lineSlots.length;
        const index = letter.lineSlots.indexOf(id);

        const letterSideAngle =
            letter.letter.decoration === LetterDecoration.LineOutside ? 0 : 180;

        const lineDistanceAngle = 45;

        const centerLinesOnLetterSideAngle =
            ((lineCount - 1) * lineDistanceAngle) / 2;

        const distance = letterRadius;

        const angle =
            index * lineDistanceAngle -
            centerLinesOnLetterSideAngle +
            letterSideAngle;

        const position: PolarCoordinate = {
            distance,
            angle: mAngle.toRadian(mAngle.degree(angle)),
        };

        dispatch(svgActions.setLineSlotPosition({ id, position }));
    };

const resetThunks = { sentence, word, letter, dot, lineSlot };

export default resetThunks;
