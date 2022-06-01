import { rotate, toRadian, Vector2 } from '../../utils/LinearAlgebra';
import Maybe from '../../utils/Maybe';
import { AppThunkAction } from '../AppState';
import { ImageType, Sentence, UUID, Word } from '../image/ImageTypes';
import { setSelection } from './WorkActions';

export const selectSentence =
    (id: UUID): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(setSelection({ id, type: ImageType.Sentence, context: undefined }));
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

        const zeroDegreeVector: Vector2 = { x: 0, y: sentence.circle.r };

        dispatch(
            setSelection({
                id,
                type: ImageType.Word,
                context: {
                    angleConstraints: {
                        minAngle,
                        maxAngle,
                        minAngleVector: rotate(zeroDegreeVector, -toRadian(minAngle)),
                        maxAngleVector: rotate(zeroDegreeVector, -toRadian(maxAngle)),
                    },
                },
            })
        );
    };

export const selectConsonant =
    (id: UUID): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(setSelection({ id, type: ImageType.Consonant, context: undefined }));
    };

export const selectVocal =
    (id: UUID): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(setSelection({ id, type: ImageType.Vocal, context: undefined }));
    };

export const selectDot =
    (id: UUID): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(setSelection({ id, type: ImageType.Dot, context: undefined }));
    };

export const selectLineSlot =
    (id: UUID): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(setSelection({ id, type: ImageType.LineSlot, context: undefined }));
    };
