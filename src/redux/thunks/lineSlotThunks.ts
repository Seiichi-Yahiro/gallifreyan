import mAngle from '@/math/angle';
import type { PolarCoordinate } from '@/math/polar';
import ids, { type LetterId, type LineSlotId } from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import { textActions } from '@/redux/slices/textSlice';
import type { AppThunkAction } from '@/redux/store';
import { LetterDecoration } from '@/redux/types/letterTypes';

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
                        angle: mAngle.degree(0),
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
            angle: mAngle.degree(angle),
        };

        dispatch(svgActions.setLineSlotPosition({ id, position }));
    };

const lineSlotThunks = {
    add,
    remove,
    reset,
};

export default lineSlotThunks;
