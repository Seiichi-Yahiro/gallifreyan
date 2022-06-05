import { rotate, toRadian, Vector2 } from '../../utils/LinearAlgebra';
import Maybe from '../../utils/Maybe';
import { AppThunkAction } from '../AppState';
import { Consonant, ImageType, Sentence, UUID, Word } from '../image/ImageTypes';
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

        const zeroDegreeVector: Vector2 = { x: 0, y: sentence.circle.r };

        dispatch(
            setSelection({
                id,
                type: ImageType.Word,
                angleConstraints: {
                    minAngle,
                    maxAngle,
                    minAngleVector: rotate(zeroDegreeVector, -toRadian(minAngle)),
                    maxAngleVector: rotate(zeroDegreeVector, -toRadian(maxAngle)),
                },
            })
        );
    };

export const selectConsonant =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const consonant = state.image.circles[id] as Consonant;
        const word = state.image.circles[consonant.parentId] as Word;

        const consonantIndex = word.letters.findIndex((letterId) => letterId === consonant.id);

        const minAngle = Maybe.of(word.letters[consonantIndex - 1])
            .map((letterId) => state.image.circles[letterId])
            .map((letter) => letter.circle.angle)
            .unwrapOr(0);

        const maxAngle = Maybe.of(word.letters[consonantIndex + 1])
            .map((letterId) => state.image.circles[letterId])
            .map((letter) => letter.circle.angle)
            .unwrapOr(360);

        const zeroDegreeVector: Vector2 = { x: 0, y: word.circle.r };

        dispatch(
            setSelection({
                id,
                type: ImageType.Consonant,
                angleConstraints: {
                    minAngle,
                    maxAngle,
                    minAngleVector: rotate(zeroDegreeVector, -toRadian(minAngle)),
                    maxAngleVector: rotate(zeroDegreeVector, -toRadian(maxAngle)),
                },
            })
        );
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
