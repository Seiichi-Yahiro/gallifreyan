import mAngle from '@/math/angle';
import mCircle, {
    CircleIntersectionType,
    type Circle as MCircle,
    type TwoCircleIntersections,
} from '@/math/circle';
import mPolar, { type PolarCoordinate } from '@/math/polar';
import mVec2 from '@/math/vec';
import ids, { type SentenceId, type WordId } from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import { textActions } from '@/redux/slices/textSlice';
import type { AppThunkAction } from '@/redux/store';
import letterThunks from '@/redux/thunks/letterThunks';
import { LetterPlacement } from '@/redux/types/letterTypes';
import {
    sortIntersectionsByAngle,
    wordArcsFromIntersections,
} from '@/redux/utils/svgUtils';
import { splitLetters } from '@/redux/utils/textAnalysis';

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

        splitLetters(newWordText, state.text.splitLetterOptions).forEach(
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
            angle: mAngle.degree(index * (360 / wordCount)),
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

        const wordIntersections: TwoCircleIntersections['values'][] = [];

        for (const letterId of letterIds) {
            const letter = state.text.elements[letterId];

            if (
                letter.letter.placement !== LetterPlacement.DeepCut &&
                letter.letter.placement !== LetterPlacement.ShallowCut
            ) {
                dispatch(
                    svgActions.setLetterIntersections({
                        id: letterId,
                        intersections: {
                            type: CircleIntersectionType.None,
                        },
                    }),
                );

                continue;
            }

            const wordCircle = state.svg.circles[wordId];
            const letterCircle = state.svg.circles[letterId];

            const wordMCircle: MCircle = {
                radius: wordCircle.radius,
                position: mVec2.create(0, 0),
            };

            const letterMCircle: MCircle = {
                radius: letterCircle.radius,
                position: mPolar.toCartesian(letterCircle.position),
            };

            const intersectionsInWord = mCircle.intersections(
                wordMCircle,
                letterMCircle,
            );

            if (intersectionsInWord.type === CircleIntersectionType.Two) {
                const sortedIntersectionsInWord = sortIntersectionsByAngle(
                    wordMCircle,
                    letterMCircle,
                    intersectionsInWord.values,
                );

                const intersectionsInLetter = sortedIntersectionsInWord
                    .map((pos) => mVec2.sub(pos, letterMCircle.position))
                    .map((pos) =>
                        mVec2.rotate(pos, letterCircle.position.angle, true),
                    ) as TwoCircleIntersections['values'];

                dispatch(
                    svgActions.setLetterIntersections({
                        id: letterId,
                        intersections: {
                            type: CircleIntersectionType.Two,
                            values: intersectionsInLetter,
                        },
                    }),
                );

                wordIntersections.push(sortedIntersectionsInWord);
            } else if (
                intersectionsInWord.type === CircleIntersectionType.One
            ) {
                let intersectionInLetter = mVec2.sub(
                    intersectionsInWord.value,
                    letterMCircle.position,
                );

                intersectionInLetter = mVec2.rotate(
                    intersectionInLetter,
                    letterCircle.position.angle,
                    true,
                );

                dispatch(
                    svgActions.setLetterIntersections({
                        id: letterId,
                        intersections: {
                            type: CircleIntersectionType.One,
                            value: intersectionInLetter,
                        },
                    }),
                );
            } else {
                dispatch(
                    svgActions.setLetterIntersections({
                        id: letterId,
                        intersections: intersectionsInWord,
                    }),
                );
            }
        }

        dispatch(
            svgActions.setWordIntersections({
                id: wordId,
                intersections: wordIntersections,
                arcs: wordArcsFromIntersections(wordIntersections),
            }),
        );
    };

const wordThunks = {
    add,
    remove,
    reset,
    calculateIntersectionsWithLetters,
};

export default wordThunks;
