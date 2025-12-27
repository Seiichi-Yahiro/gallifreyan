import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/ids';
import type { AppThunkAction } from '@/redux/store';
import { svgActions } from '@/redux/svg/svgSlice';
import { textActions } from '@/redux/text/textSlice';

const sentence =
    (id: SentenceId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        state.text.elements[id].words.forEach((wordId) =>
            dispatch(removeThunks.word(wordId)),
        );

        dispatch(svgActions.removeCircle(id));
        dispatch(textActions.removeSentence(id));
    };

const word =
    (id: WordId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        state.text.elements[id].letters.forEach((letterId) =>
            dispatch(removeThunks.letter(letterId)),
        );

        dispatch(svgActions.removeCircle(id));
        dispatch(textActions.removeWord(id));
    };

const letter =
    (id: LetterId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const letter = state.text.elements[id];

        letter.dots.forEach((dotId) => dispatch(removeThunks.dot(dotId)));

        letter.lineSlots.forEach((lineSlotId) =>
            dispatch(removeThunks.lineSlot(lineSlotId)),
        );

        dispatch(svgActions.removeCircle(id));
        dispatch(textActions.removeLetter(id));
    };

const dot =
    (id: DotId): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(svgActions.removeCircle(id));
        dispatch(textActions.removeDot(id));
    };

const lineSlot =
    (id: LineSlotId): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(svgActions.removeLineSlot(id));
        dispatch(textActions.removeLineSlot(id));
    };

const removeThunks = { sentence, word, letter, dot, lineSlot };

export default removeThunks;
