import type { PolarCoordinate } from '@/math/polar';
import ids from '@/redux/ids';
import type { AppThunkAction } from '@/redux/store';
import dotThunks from '@/redux/thunks/dotThunks';
import letterThunks from '@/redux/thunks/letterThunks';
import wordThunks from '@/redux/thunks/wordThunks';
import type { CircleId } from '@/redux/types/svgTypes';
import { match } from 'ts-pattern';

const setCirclePosition =
    (id: CircleId, position: Partial<PolarCoordinate>): AppThunkAction =>
    (dispatch, _getState) => {
        match(id)
            .when(ids.sentence.is, (_sentenceId) => {
                // do nothing for now
            })
            .when(ids.word.is, (wordId) => {
                dispatch(wordThunks.setCirclePosition(wordId, position));
            })
            .when(ids.letter.is, (letterId) => {
                dispatch(letterThunks.setCirclePosition(letterId, position));
            })
            .when(ids.dot.is, (dotId) => {
                dispatch(dotThunks.setCirclePosition(dotId, position));
            })
            .exhaustive();
    };

const setCircleRadius =
    (id: CircleId, radius: number): AppThunkAction =>
    (dispatch, _getState) => {
        match(id)
            .when(ids.sentence.is, (_sentenceId) => {
                // do nothing for now
            })
            .when(ids.word.is, (wordId) => {
                dispatch(wordThunks.setCircleRadius(wordId, radius));
            })
            .when(ids.letter.is, (letterId) => {
                dispatch(letterThunks.setCircleRadius(letterId, radius));
            })
            .when(ids.dot.is, (dotId) => {
                dispatch(dotThunks.setCircleRadius(dotId, radius));
            })
            .exhaustive();
    };

const svgThunks = {
    setCirclePosition,
    setCircleRadius,
};

export default svgThunks;
