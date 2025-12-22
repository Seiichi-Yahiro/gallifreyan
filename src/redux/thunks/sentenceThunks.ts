import mAngle from '@/math/angle';
import type { PolarCoordinate } from '@/math/polar';
import ids, { type SentenceId } from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import { textActions } from '@/redux/slices/textSlice';
import type { AppThunkAction } from '@/redux/store';
import wordThunks from '@/redux/thunks/wordThunks';
import { splitWords } from '@/redux/utils/textAnalysis';

const add =
    (newSentenceText: string): AppThunkAction =>
    (dispatch, _getState) => {
        const id = ids.sentence.create();

        dispatch(
            textActions.addSentence({
                id,
                text: newSentenceText,
            }),
        );

        dispatch(svgActions.addCircle(id));

        splitWords(newSentenceText).forEach((newWordText) =>
            dispatch(wordThunks.add(newWordText, id)),
        );
    };

const remove =
    (id: SentenceId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        state.text.elements[id].words.forEach((wordId) =>
            dispatch(wordThunks.remove(wordId)),
        );

        dispatch(svgActions.removeCircle(id));
        dispatch(textActions.removeSentence(id));
    };

const reset =
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

        words.map(wordThunks.reset).forEach(dispatch);
    };

const sentenceThunks = {
    add,
    remove,
    reset,
};

export default sentenceThunks;
