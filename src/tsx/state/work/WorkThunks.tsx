import { rotate, toRadian, Vector2 } from '../../utils/LinearAlgebra';
import Maybe from '../../utils/Maybe';
import { AppThunkAction } from '../AppState';
import { CircleShape, Consonant, ImageType, Sentence, UUID, Vocal, Word } from '../image/ImageTypes';
import { setSelection } from './WorkActions';
import { AngleConstraints } from './WorkTypes';

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

        const angleConstraints = calculateAngleConstraints(id, sentence.circle.r, sentence.words, state.image.circles);

        dispatch(
            setSelection({
                id,
                type: ImageType.Word,
                angleConstraints,
            })
        );
    };

export const selectConsonant =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const consonant = state.image.circles[id] as Consonant;
        const word = state.image.circles[consonant.parentId] as Word;

        const angleConstraints = calculateAngleConstraints(id, word.circle.r, word.letters, state.image.circles);

        dispatch(
            setSelection({
                id,
                type: ImageType.Consonant,
                angleConstraints,
            })
        );
    };

export const selectVocal =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const vocal = state.image.circles[id] as Vocal;
        const parent = state.image.circles[vocal.parentId] as Word | Consonant;

        // if nested vocal
        if (parent.type === ImageType.Consonant) {
            dispatch(setSelection({ id, type: ImageType.Vocal }));
        } else {
            const word = parent;
            const angleConstraints = calculateAngleConstraints(id, word.circle.r, word.letters, state.image.circles);
            dispatch(setSelection({ id, type: ImageType.Vocal, angleConstraints }));
        }
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

const calculateAngleConstraints = (
    id: UUID,
    parentRadius: number,
    siblings: UUID[],
    circles: Partial<Record<UUID, CircleShape>>
): AngleConstraints => {
    const index = siblings.findIndex((siblingId) => siblingId === id);

    const minAngle = Maybe.of(siblings[index - 1])
        .map((siblingId) => circles[siblingId])
        .map((sibling) => sibling.circle.angle)
        .unwrapOr(0);

    const maxAngle = Maybe.of(siblings[index + 1])
        .map((siblingId) => circles[siblingId])
        .map((letter) => letter.circle.angle)
        .unwrapOr(360);

    const zeroDegreeVector: Vector2 = { x: 0, y: parentRadius };

    return {
        minAngle,
        maxAngle,
        minAngleVector: rotate(zeroDegreeVector, -toRadian(minAngle)),
        maxAngleVector: rotate(zeroDegreeVector, -toRadian(maxAngle)),
    };
};
