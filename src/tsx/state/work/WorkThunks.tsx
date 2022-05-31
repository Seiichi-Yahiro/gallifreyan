import Maybe from '../../utils/Maybe';
import { AppThunkAction } from '../AppState';
import { ImageType, Sentence, UUID, Word } from '../image/ImageTypes';
import { setSelection } from './WorkActions';

export const selectSentence =
    (id: UUID): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(setSelection({ id, type: ImageType.Sentence }));
    };

export const selectWord =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const word = state.image.circles[id] as Word;
        const sentence = state.image.circles[word.parentId] as Sentence;

        const wordIndex = sentence.words.findIndex((wordId) => wordId === word.id);

        const minAngle = Maybe.of(sentence.words[wordIndex - 1])
            .map((wordId) => state.image.circles[wordId])
            .map((word) => word.circle.angle)
            .unwrapOr(0);

        const maxAngle = Maybe.of(sentence.words[wordIndex + 1])
            .map((wordId) => state.image.circles[wordId])
            .map((word) => word.circle.angle)
            .unwrapOr(360);

        dispatch(setSelection({ id, type: ImageType.Word, minAngle, maxAngle }));
    };

export const selectConsonant =
    (id: UUID): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(setSelection({ id, type: ImageType.Consonant }));
    };

export const selectVocal =
    (id: UUID): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(setSelection({ id, type: ImageType.Vocal }));
    };

export const selectDot =
    (id: UUID): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(setSelection({ id, type: ImageType.Dot }));
    };

export const selectLineSlot =
    (id: UUID): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(setSelection({ id, type: ImageType.LineSlot }));
    };
