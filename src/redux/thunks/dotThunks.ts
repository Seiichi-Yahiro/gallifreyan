import mAngle from '@/math/angle';
import type { PolarCoordinate } from '@/math/polar';
import { type DotId, dotId, type LetterId } from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import { textActions } from '@/redux/slices/textSlice';
import type { AppThunkAction } from '@/redux/store';

const add =
    (parent: LetterId): AppThunkAction =>
    (dispatch, _getState) => {
        const id = dotId();

        dispatch(textActions.addDot({ id, parent }));
        dispatch(svgActions.addCircle(id));
    };

const remove =
    (id: DotId): AppThunkAction =>
    (dispatch, _getState) => {
        dispatch(svgActions.removeCircle(id));
        dispatch(textActions.removeDot(id));
    };

const reset =
    (id: DotId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const dot = state.text.elements[id];

        const letter = state.text.elements[dot.parent];
        const letterRadius = state.svg.circles[dot.parent].radius;

        const dotCount = letter.dots.length;
        const index = letter.dots.indexOf(id);

        const radius = letterRadius * 0.1;

        const letterSideAngle = 180;
        const dotDistanceAngle = 45;

        const centerDotsOnLetterSideAngle =
            ((dotCount - 1) * dotDistanceAngle) / 2;

        const distance = letterRadius - radius * 2;

        const angle =
            index * dotDistanceAngle -
            centerDotsOnLetterSideAngle +
            letterSideAngle;

        const position: PolarCoordinate = {
            distance,
            angle: mAngle.degree(angle),
        };

        dispatch(svgActions.setCircle({ id, radius, position }));
    };

const dotThunks = {
    add,
    remove,
    reset,
};

export default dotThunks;
