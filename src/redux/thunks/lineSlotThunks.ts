import mAngle from '@/math/angle';
import { type PolarCoordinate } from '@/math/polar';
import type { Vec2 } from '@/math/vec';
import ids, { type LetterId, type LineSlotId } from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import { textActions } from '@/redux/slices/textSlice';
import type { AppThunkAction } from '@/redux/store';
import { LetterDecoration } from '@/redux/types/letterTypes';
import { calculatePositionAfterDrag } from '@/redux/utils/dragUtils';

const add =
    (parent: LetterId): AppThunkAction =>
    (dispatch, _getState) => {
        const id = ids.lineSlot.create();

        dispatch(textActions.addLineSlot({ id, parent }));

        dispatch(
            svgActions.addLineSlot({
                id,
                lineSlot: {
                    position: {
                        distance: 0,
                        angle: mAngle.radian(0),
                    },
                },
            }),
        );
    };

const remove =
    (id: LineSlotId): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(svgActions.removeLineSlot(id));
        dispatch(textActions.removeLineSlot(id));
    };

const reset =
    (id: LineSlotId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const lineSlot = state.text.elements[id];

        const letter = state.text.elements[lineSlot.parent];
        const letterRadius = state.svg.circles[lineSlot.parent].radius;

        const lineCount = letter.lineSlots.length;
        const index = letter.lineSlots.indexOf(id);

        const letterSideAngle =
            letter.letter.decoration === LetterDecoration.LineOutside ? 0 : 180;

        const lineDistanceAngle = 45;

        const centerLinesOnLetterSideAngle =
            ((lineCount - 1) * lineDistanceAngle) / 2;

        const distance = letterRadius;

        const angle =
            index * lineDistanceAngle -
            centerLinesOnLetterSideAngle +
            letterSideAngle;

        const position: PolarCoordinate = {
            distance,
            angle: mAngle.toRadian(mAngle.degree(angle)),
        };

        dispatch(svgActions.setLineSlotPosition({ id, position }));
    };

const drag =
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

        dispatch(
            svgActions.setLineSlotPosition({
                id,
                position: { angle: newPos.angle },
            }),
        );
    };

const lineSlotThunks = {
    add,
    remove,
    reset,
    drag,
};

export default lineSlotThunks;
