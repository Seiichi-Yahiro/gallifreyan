import type { Vec2 } from '@/math/vec';
import type { DotId, LetterId, LineSlotId, WordId } from '@/redux/ids';
import type { AppThunkAction } from '@/redux/store';
import { calculatePositionAfterDrag } from '@/redux/svg/drag.utils';
import svgThunks from '@/redux/svg/svg.thunks';

const word =
    (id: WordId, delta: Vec2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const wordCircle = state.svg.circles[id];
        const newPos = calculatePositionAfterDrag(wordCircle.position, delta);

        dispatch(svgThunks.wordPosition(id, newPos));
    };

const letter =
    (id: LetterId, delta: Vec2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const letterCircle = state.svg.circles[id];
        const newPos = calculatePositionAfterDrag(letterCircle.position, delta);

        dispatch(svgThunks.letterPosition(id, newPos));
    };

const dot =
    (id: DotId, delta: Vec2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const dotCircle = state.svg.circles[id];
        const parentId = state.text.elements[id].parent;
        const parentAngle = state.svg.circles[parentId].position.angle;

        const newPos = calculatePositionAfterDrag(
            dotCircle.position,
            delta,
            parentAngle,
        );

        dispatch(svgThunks.dotPosition(id, newPos));
    };

const lineSlot =
    (id: LineSlotId, delta: Vec2): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const lineSlot = state.svg.lineSlots[id];
        const parentId = state.text.elements[id].parent;
        const parentAngle = state.svg.circles[parentId].position.angle;

        const newPos = calculatePositionAfterDrag(
            lineSlot.position,
            delta,
            parentAngle,
        );

        dispatch(svgThunks.lineSlotPosition(id, { angle: newPos.angle }));
    };

const dragThunks = { word, letter, dot, lineSlot };

export default dragThunks;
