import { calculateConsonantDistanceConstraints, calculateNeighborAngleConstraints } from '../../utils/Constraints';
import { isValidLetter } from '../../utils/LetterGroups';
import { splitWordToChars } from '../../utils/TextConverter';
import { AppThunkAction } from '../AppState';
import { setSentence } from '../image/ImageThunks';
import { Consonant, Dot, ImageType, Sentence, UUID, Vocal, Word } from '../image/ImageTypes';
import { setConstraints, setExpandedTreeNodes, setSelection, setTextInput } from './WorkActions';

export const setInputText =
    (text: string): AppThunkAction =>
    (dispatch, getState) => {
        let state = getState();

        const sanitizedText = text
            .split(' ')
            .map((word) => splitWordToChars(word).filter(isValidLetter).join(''))
            .filter((word) => word.length > 0)
            .join(' ');

        dispatch(setTextInput({ text, sanitizedText }));

        if (state.work.textInput.sanitizedText !== sanitizedText) {
            dispatch(setSentence(sanitizedText));

            state = getState();

            dispatch(setExpandedTreeNodes([state.image.rootCircleId]));
        }
    };

export const setSentenceConstraints =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const sentence = state.image.circles[id] as Sentence;
        const svgSize = state.image.svgSize;

        dispatch(
            setConstraints({
                angle: { minAngle: 0, maxAngle: 360 },
                distance: { minDistance: 0, maxDistance: svgSize / 2 - sentence.circle.r },
            })
        );
    };

export const setWordConstraints =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const word = state.image.circles[id] as Word;
        const sentence = state.image.circles[word.parentId] as Sentence;

        const angleConstraints = calculateNeighborAngleConstraints(
            id,
            sentence.circle.r,
            sentence.words,
            state.image.circles
        );

        dispatch(
            setConstraints({
                angle: angleConstraints,
                distance: { minDistance: 0, maxDistance: sentence.circle.r - word.circle.r },
            })
        );
    };

export const setConsonantConstraints =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const consonant = state.image.circles[id] as Consonant;
        const word = state.image.circles[consonant.parentId] as Word;

        const angleConstraints = calculateNeighborAngleConstraints(
            id,
            word.circle.r,
            word.letters,
            state.image.circles
        );

        const distanceConstraints = calculateConsonantDistanceConstraints(consonant, word);

        dispatch(setConstraints({ angle: angleConstraints, distance: distanceConstraints }));
    };

export const setVocalConstraints =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const vocal = state.image.circles[id] as Vocal;
        const parent = state.image.circles[vocal.parentId] as Word | Consonant;

        // if nested vocal
        if (parent.type === ImageType.Consonant) {
            // TODO nested vocal constraints
            dispatch(setConstraints({}));
        } else {
            const word = parent;
            const angleConstraints = calculateNeighborAngleConstraints(
                id,
                word.circle.r,
                word.letters,
                state.image.circles
            );
            // TODO distance constraints
            dispatch(setConstraints({ angle: angleConstraints }));
        }
    };

export const setDotConstraints =
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const dot = state.image.circles[id] as Dot;
        const consonant = state.image.circles[dot.parentId] as Consonant;

        dispatch(
            setConstraints({
                angle: { minAngle: 0, maxAngle: 360 },
                distance: { minDistance: 0, maxDistance: consonant.circle.r },
            })
        );
    };

export const setLineSlotConstraints =
    (_id: UUID): AppThunkAction =>
    (dispatch, _getState) => {
        // TODO
        //const state = getState();
        //const lineSlot = state.image.lineSlots[id]!;

        dispatch(setConstraints({}));
    };

const createSelectThunk =
    (type: ImageType, setConstraints: (id: UUID) => AppThunkAction) =>
    (id: UUID): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        if (state.work.selection?.id === id) {
            return;
        }

        dispatch(setSelection({ id, type }));
        dispatch(setConstraints(id));
    };

export const selectSentence = createSelectThunk(ImageType.Sentence, setSentenceConstraints);
export const selectWord = createSelectThunk(ImageType.Word, setWordConstraints);
export const selectConsonant = createSelectThunk(ImageType.Consonant, setConsonantConstraints);
export const selectVocal = createSelectThunk(ImageType.Vocal, setVocalConstraints);
export const selectDot = createSelectThunk(ImageType.Dot, setDotConstraints);
export const selectLineSlot = createSelectThunk(ImageType.LineSlot, setLineSlotConstraints);
