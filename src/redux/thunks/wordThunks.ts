import mAngle from '@/math/angle';
import { type PolarCoordinate } from '@/math/polar';
import type { Vec2 } from '@/math/vec';
import ids, { type SentenceId, type WordId } from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import { textActions } from '@/redux/slices/textSlice';
import type { AppThunkAction } from '@/redux/store';
import letterThunks from '@/redux/thunks/letterThunks';
import { calculateWordPositionConstraints } from '@/redux/utils/constraints';
import { calculatePositionAfterDrag } from '@/redux/utils/dragUtils';
import { splitLetters } from '@/redux/utils/textAnalysis';
import { clamp } from 'es-toolkit';

const add =
    (newWordText: string, parent: SentenceId): AppThunkAction =>
    (dispatch, getState) => {
        const id = ids.word.create();

        dispatch(
            textActions.addWord({
                id,
                parent,
                text: newWordText,
            }),
        );

        dispatch(svgActions.addCircle(id));

        const state = getState();

        splitLetters(newWordText, state.settings.splitLetterOptions).forEach(
            (pair) => dispatch(letterThunks.add(pair, id)),
        );
    };

const remove =
    (id: WordId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        state.text.elements[id].letters.forEach((letterId) =>
            dispatch(letterThunks.remove(letterId)),
        );

        dispatch(svgActions.removeCircle(id));
        dispatch(textActions.removeWord(id));
    };

const reset =
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

        word.letters.map(letterThunks.reset).forEach(dispatch);

        dispatch(calculateIntersectionsWithLetters(id));
    };

const calculateIntersectionsWithLetters =
    (wordId: WordId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letterIds = state.text.elements[wordId].letters;

        letterIds
            .map(letterThunks.calculateIntersectionsWithWord)
            .forEach(dispatch);
    };

const drag =
    (id: WordId, delta: Vec2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const wordCircle = state.svg.circles[id];
        const newPos = calculatePositionAfterDrag(wordCircle.position, delta);

        dispatch(setCirclePosition(id, newPos));
    };

const setCircleRadius =
    (id: WordId, radius: number): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const letterIds = state.text.elements[id].letters;
        const currentCircle = state.svg.circles[id];
        const deltaRadius = radius - currentCircle.radius;

        dispatch(svgActions.setCircle({ id, radius }));

        for (const letterId of letterIds) {
            const letterDistance =
                state.svg.circles[letterId].position.distance;

            dispatch(
                letterThunks.setCirclePosition(letterId, {
                    distance: letterDistance + deltaRadius,
                }),
            );
        }

        dispatch(wordThunks.calculateIntersectionsWithLetters(id));
    };

const setCirclePosition =
    (id: WordId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const wordCircle = state.svg.circles[id];
        const positionConstraints = calculateWordPositionConstraints(state, id);

        const newDistance = clamp(
            position.distance ?? wordCircle.position.distance,
            positionConstraints.distance.min,
            positionConstraints.distance.max,
        );

        const newAngle = mAngle.clamp(
            mAngle.toRadian(position.angle ?? wordCircle.position.angle),
            mAngle.toRadian(positionConstraints.angle.min).value,
            mAngle.toRadian(positionConstraints.angle.max).value,
        );

        dispatch(
            svgActions.setCircle({
                id,
                position: {
                    distance: newDistance,
                    angle: newAngle,
                },
            }),
        );
    };

const wordThunks = {
    add,
    remove,
    reset,
    calculateIntersectionsWithLetters,
    drag,
    setCircleRadius,
    setCirclePosition,
};

export default wordThunks;
