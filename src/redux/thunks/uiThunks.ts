import mAngle from '@/math/angle';
import mPolar, { type PolarCoordinate } from '@/math/polar';
import mVec2, { type Vec2 } from '@/math/vec';
import ids, { type LineSlotId, type SentenceId } from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import { uiActions } from '@/redux/slices/uiSlice';
import type { AppThunkAction } from '@/redux/store';
import svgThunks from '@/redux/thunks/svgThunks';
import type { CircleId } from '@/redux/types/svgTypes';

const setSelection =
    (id: CircleId | LineSlotId | null): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        if (state.ui.selected !== id && !state.ui.dragging) {
            dispatch(uiActions.setSelection(id));
        }
    };

const onDrag =
    (
        id: Exclude<CircleId, SentenceId> | LineSlotId,
        delta: Vec2,
    ): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        const parentId = state.text.elements[id].parent;
        const parentAngle = ids.letter.is(parentId)
            ? state.svg.circles[parentId].position.angle
            : mAngle.radian(0);

        const calculateNewPosition = (current: PolarCoordinate) => {
            const pos = mPolar.toCartesian(current);

            const rotatedDelta = mVec2.rotate(
                mVec2.create(delta.x, -delta.y),
                parentAngle,
                true,
            );

            return mVec2.add(pos, rotatedDelta);
        };

        if (ids.lineSlot.is(id)) {
            const current = state.svg.lineSlots[id].position;
            const next = calculateNewPosition(current);

            dispatch(
                svgActions.setLineSlotPosition({
                    id,
                    position: { angle: mPolar.angleFromCartesian(next) },
                }),
            );
        } else {
            const current = state.svg.circles[id].position;
            const next = calculateNewPosition(current);

            dispatch(
                svgThunks.setCirclePosition(id, {
                    distance: mVec2.length(next),
                    angle: mPolar.angleFromCartesian(next),
                }),
            );
        }
    };

const uiThunks = {
    setSelection,
    onDrag,
};

export default uiThunks;
